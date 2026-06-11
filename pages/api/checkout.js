import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { items } = req.body
      if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' })

      const line_items = items.map((it) => ({
        price_data: {
          currency: 'ngn',
          product_data: { name: it.title },
          unit_amount: Math.round(Number(it.price) * 100 || 0)
        },
        quantity: it.quantity || 1
      }))

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items,
        success_url: `${req.headers.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart`
      })

      res.status(200).json({ url: session.url })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to create checkout session' })
    }
    return
  }

  // allow GET to fetch session details by id (used by success page)
  if (req.method === 'GET') {
    try {
      const { session_id } = req.query
      if (!session_id) return res.status(400).json({ error: 'Missing session_id' })
      const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ['line_items'] })
      return res.status(200).json(session)
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'Failed to retrieve session' })
    }
  }

  res.setHeader('Allow', ['POST', 'GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
