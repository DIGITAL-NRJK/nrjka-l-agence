// Tâche planifiée Netlify : déclenche le traitement des jobs Payload une fois par jour.
export const config = {
  schedule: '0 0 * * *',
}

export default async () => {
  const url = process.env.URL
  const secret = process.env.CRON_SECRET

  if (!url || !secret) {
    return new Response('Variables URL ou CRON_SECRET manquantes', { status: 500 })
  }

  const response = await fetch(`${url}/api/payload-jobs/run`, {
    headers: { Authorization: `Bearer ${secret}` },
  })

  return new Response(`payload-jobs run: HTTP ${response.status}`)
}
