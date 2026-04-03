import webPush from 'web-push'
import db from '@/lib/db'

// VAPID keys - these MUST be set as environment variables on Vercel
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BK8y5hs_ev2TuKciYGhzusV55X3NTrlPa5UjekYOdbONeaK8oFRH6uzB2rgj0yuzC8nb58m9RKPIJHE1bya4et0'
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'D7xK2py_q3K7Kwhv6PN3IMkMDK8ZSpSL3jP3qFXa9Nw'

webPush.setVapidDetails(
  'mailto:admin@kgv-hohefeld.de',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

export async function sendPushToAll(title: string, body: string, url: string = '/admin') {
  try {
    const subs = (await db.execute('SELECT * FROM push_subscriptions')).rows as any[]
    
    const payload = JSON.stringify({ title, body, url })
    
    const results = await Promise.allSettled(
      subs.map(async (sub) => {
        try {
          await webPush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys_p256dh,
                auth: sub.keys_auth,
              }
            },
            payload
          )
        } catch (error: any) {
          // If subscription is expired or invalid, remove it
          if (error.statusCode === 410 || error.statusCode === 404) {
            await db.execute({
              sql: 'DELETE FROM push_subscriptions WHERE endpoint = ?',
              args: [sub.endpoint]
            })
          }
          throw error
        }
      })
    )

    const sent = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length
    
    console.log(`Push sent: ${sent} success, ${failed} failed`)
    return { sent, failed }
  } catch (error) {
    console.error('Push send error:', error)
    return { sent: 0, failed: 0 }
  }
}
