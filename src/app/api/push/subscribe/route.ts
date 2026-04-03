import { NextResponse } from 'next/server'
import db from '@/lib/db'

// Save push subscription
export async function POST(req: Request) {
  try {
    const { subscription } = await req.json()
    
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
    }

    // Upsert subscription
    await db.execute({
      sql: `INSERT OR REPLACE INTO push_subscriptions (endpoint, keys_p256dh, keys_auth) VALUES (?, ?, ?)`,
      args: [
        subscription.endpoint,
        subscription.keys.p256dh,
        subscription.keys.auth,
      ]
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Push subscription error:', error)
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
  }
}

// Delete push subscription
export async function DELETE(req: Request) {
  try {
    const { endpoint } = await req.json()
    
    await db.execute({
      sql: 'DELETE FROM push_subscriptions WHERE endpoint = ?',
      args: [endpoint]
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
