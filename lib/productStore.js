import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { Pool } from 'pg'

const dataFile = path.join(process.cwd(), 'data', 'products.json')
const seedMigration = 'seed_products_v1'
let initialization

function getPool() {
  if (!process.env.DATABASE_URL) return null
  if (!globalThis.productStorePool) {
    globalThis.productStorePool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5
    })
  }
  return globalThis.productStorePool
}

function readLocalProducts() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'))
}

function writeLocalProducts(products) {
  fs.writeFileSync(dataFile, JSON.stringify(products, null, 2), 'utf8')
}

function normalizeProducts(products) {
  if (!Array.isArray(products)) {
    throw new Error('Products must be an array')
  }

  return products.map((product) => {
    if (!product || typeof product !== 'object' || Array.isArray(product)) {
      throw new Error('Each product must be an object')
    }

    return { ...product, id: product.id == null ? randomUUID() : String(product.id) }
  })
}

async function initializeDatabase(pool) {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS store_products (
        position BIGSERIAL PRIMARY KEY,
        id TEXT NOT NULL UNIQUE,
        product JSONB NOT NULL
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS store_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await client.query('BEGIN')
    try {
      await client.query('SELECT pg_advisory_xact_lock($1)', [431920241])
      const migration = await client.query(
        'SELECT 1 FROM store_migrations WHERE name = $1',
        [seedMigration]
      )

      if (migration.rowCount === 0) {
        const products = normalizeProducts(readLocalProducts())
        for (const product of products) {
          await client.query(
            'INSERT INTO store_products (id, product) VALUES ($1, $2)',
            [product.id, product]
          )
        }
        await client.query('INSERT INTO store_migrations (name) VALUES ($1)', [seedMigration])
      }

      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  } finally {
    client.release()
  }
}

async function ensureDatabaseInitialized(pool) {
  if (!initialization) {
    initialization = initializeDatabase(pool).catch((error) => {
      initialization = null
      throw error
    })
  }
  await initialization
}

export async function getProducts() {
  const pool = getPool()
  if (!pool) return readLocalProducts()

  await ensureDatabaseInitialized(pool)
  const result = await pool.query('SELECT product FROM store_products ORDER BY position')
  return result.rows.map((row) => row.product)
}

export async function addProduct(product) {
  const newProduct = { ...product, id: randomUUID() }
  const pool = getPool()

  if (!pool) {
    const products = readLocalProducts()
    products.push(newProduct)
    writeLocalProducts(products)
    return newProduct
  }

  await ensureDatabaseInitialized(pool)
  await pool.query(
    'INSERT INTO store_products (id, product) VALUES ($1, $2)',
    [newProduct.id, newProduct]
  )
  return newProduct
}

export async function replaceProducts(input) {
  const products = normalizeProducts(input)
  const pool = getPool()

  if (!pool) {
    writeLocalProducts(products)
    return
  }

  await ensureDatabaseInitialized(pool)
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    try {
      await client.query('DELETE FROM store_products')
      for (const product of products) {
        await client.query(
          'INSERT INTO store_products (id, product) VALUES ($1, $2)',
          [product.id, product]
        )
      }
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  } finally {
    client.release()
  }
}
