import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  res.write('event: connected\ndata: {"status":"connected"}\n\n')

  const timer = setTimeout(() => {
    try {
      res.write(': keepalive\n\n')
    } catch {}
  }, 3000)

  req.on('close', () => {
    clearTimeout(timer)
  })
}
