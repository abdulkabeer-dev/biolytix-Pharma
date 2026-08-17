import type { Plugin, ViteDevServer } from 'vite'
import fs from 'fs'
import path from 'path'
import type { IncomingMessage, ServerResponse } from 'http'

const DB_PATH = path.resolve(process.cwd(), 'data/live_db.json')

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return null
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('[API Plugin] Error reading DB:', err)
    return null
  }
}

function writeDb(data: any) {
  try {
    data.lastUpdated = new Date().toISOString()
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('[API Plugin] Error writing DB:', err)
    return false
  }
}

// Active SSE client connections
const sseClients = new Set<ServerResponse>()

function broadcastSSE(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  for (const client of sseClients) {
    try {
      client.write(payload)
    } catch {
      sseClients.delete(client)
    }
  }
}

function logAudit(db: any, action: string, entity: string, summary: string) {
  if (!db.auditLog) db.auditLog = []
  db.auditLog.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    action,
    entity,
    summary,
    timestamp: new Date().toISOString(),
  })
  // Keep last 50 entries
  if (db.auditLog.length > 50) db.auditLog.pop()
}

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, data: any) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  res.end(JSON.stringify(data))
}

export function viteApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-biolytix-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''
        const method = req.method || 'GET'

        // Handle CORS preflight
        if (method === 'OPTIONS' && url.startsWith('/api/')) {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          })
          res.end()
          return
        }

        // SSE Real-Time Stream endpoint
        if (url === '/api/events' && method === 'GET') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          })
          res.write('event: connected\ndata: {"status":"connected"}\n\n')
          sseClients.add(res)

          req.on('close', () => {
            sseClients.delete(res)
          })
          return
        }

        // Check if request is an API route
        if (!url.startsWith('/api/')) {
          return next()
        }

        const db = readDb()
        if (!db) {
          return sendJson(res, 500, { error: 'Database not found or corrupted' })
        }

        try {
          // ── GET FULL SNAPSHOT ─────────────────────────────────────────────
          if (url === '/api/data' && method === 'GET') {
            return sendJson(res, 200, db)
          }

          // ── PRODUCTS CRUD ────────────────────────────────────────────────
          if (url === '/api/products/reorder' && method === 'PUT') {
            const body = await parseJsonBody(req)
            if (Array.isArray(body.medicines)) {
              db.medicines = body.medicines
              logAudit(db, 'REORDER', 'PRODUCT', `Reordered product catalogue & division assignments (${body.medicines.length} products)`)
              writeDb(db)
              broadcastSSE('sync', { type: 'PRODUCT_REORDER', medicines: db.medicines, db })
              return sendJson(res, 200, { success: true, medicines: db.medicines, message: 'Products sequence updated successfully.' })
            }
            return sendJson(res, 400, { error: 'Invalid medicines array' })
          }

          if (url === '/api/products/batch-move' && method === 'POST') {
            const { medicineIds, targetDivisionId } = await parseJsonBody(req)
            if (!Array.isArray(medicineIds) || !targetDivisionId) {
              return sendJson(res, 400, { error: 'medicineIds array and targetDivisionId required' })
            }
            const targetDiv = (db.divisions || []).find((d: any) => d.id === targetDivisionId)
            const divName = targetDiv ? targetDiv.name : targetDivisionId
            let movedCount = 0
            db.medicines.forEach((m: any) => {
              if (medicineIds.includes(m.id)) {
                m.divisionId = targetDivisionId
                movedCount++
              }
            })
            logAudit(db, 'UPDATE', 'PRODUCT', `Moved ${movedCount} products to division "${divName}"`)
            writeDb(db)
            broadcastSSE('sync', { type: 'PRODUCT_BATCH_MOVE', medicineIds, targetDivisionId, db })
            return sendJson(res, 200, { success: true, movedCount, message: `Moved ${movedCount} products to ${divName}.` })
          }

          if (url === '/api/products' && method === 'POST') {
            const newProduct = await parseJsonBody(req)
            if (!newProduct.id) {
              newProduct.id = `med-${Date.now()}`
            }
            if (!db.medicines) db.medicines = []
            db.medicines.unshift(newProduct)
            logAudit(db, 'CREATE', 'PRODUCT', `Added product "${newProduct.name}" (${newProduct.form})`)
            writeDb(db)
            broadcastSSE('sync', { type: 'PRODUCT_ADD', product: newProduct, db })
            return sendJson(res, 201, { success: true, product: newProduct, message: `Product "${newProduct.name}" added successfully.` })
          }

          if (url.startsWith('/api/products/') && method === 'PUT') {
            const id = decodeURIComponent(url.replace('/api/products/', ''))
            const updated = await parseJsonBody(req)
            const idx = db.medicines.findIndex((m: any) => m.id === id)
            if (idx === -1) {
              return sendJson(res, 404, { error: 'Product not found' })
            }
            db.medicines[idx] = { ...db.medicines[idx], ...updated, id }
            logAudit(db, 'UPDATE', 'PRODUCT', `Updated product "${db.medicines[idx].name}"`)
            writeDb(db)
            broadcastSSE('sync', { type: 'PRODUCT_UPDATE', product: db.medicines[idx], db })
            return sendJson(res, 200, { success: true, product: db.medicines[idx], message: `Product "${db.medicines[idx].name}" updated.` })
          }

          if (url.startsWith('/api/products/') && method === 'DELETE') {
            const id = decodeURIComponent(url.replace('/api/products/', ''))
            const idx = db.medicines.findIndex((m: any) => m.id === id)
            if (idx === -1) {
              return sendJson(res, 404, { error: 'Product not found' })
            }
            const deleted = db.medicines.splice(idx, 1)[0]
            logAudit(db, 'DELETE', 'PRODUCT', `Removed product "${deleted.name}"`)
            writeDb(db)
            broadcastSSE('sync', { type: 'PRODUCT_DELETE', id, db })
            return sendJson(res, 200, { success: true, id, message: `Product "${deleted.name}" deleted.` })
          }

          // ── DIVISIONS CRUD ───────────────────────────────────────────────
          if (url === '/api/divisions' && method === 'POST') {
            const newDiv = await parseJsonBody(req)
            if (!newDiv.id) {
              newDiv.id = newDiv.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            }
            if (!db.divisions) db.divisions = []
            db.divisions.push(newDiv)
            logAudit(db, 'CREATE', 'DIVISION', `Added division "${newDiv.name}"`)
            writeDb(db)
            broadcastSSE('sync', { type: 'DIVISION_ADD', division: newDiv, db })
            return sendJson(res, 201, { success: true, division: newDiv, message: `Division "${newDiv.name}" added.` })
          }

          if (url.startsWith('/api/divisions/') && method === 'PUT') {
            const id = decodeURIComponent(url.replace('/api/divisions/', ''))
            const updated = await parseJsonBody(req)
            const idx = db.divisions.findIndex((d: any) => d.id === id)
            if (idx === -1) {
              return sendJson(res, 404, { error: 'Division not found' })
            }
            db.divisions[idx] = { ...db.divisions[idx], ...updated, id }
            logAudit(db, 'UPDATE', 'DIVISION', `Updated division "${db.divisions[idx].name}"`)
            writeDb(db)
            broadcastSSE('sync', { type: 'DIVISION_UPDATE', division: db.divisions[idx], db })
            return sendJson(res, 200, { success: true, division: db.divisions[idx], message: `Division "${db.divisions[idx].name}" updated.` })
          }

          if (url.startsWith('/api/divisions/') && method === 'DELETE') {
            const id = decodeURIComponent(url.replace('/api/divisions/', ''))
            const idx = db.divisions.findIndex((d: any) => d.id === id)
            if (idx === -1) {
              return sendJson(res, 404, { error: 'Division not found' })
            }
            const deleted = db.divisions.splice(idx, 1)[0]
            logAudit(db, 'DELETE', 'DIVISION', `Removed division "${deleted.name}"`)
            writeDb(db)
            broadcastSSE('sync', { type: 'DIVISION_DELETE', id, db })
            return sendJson(res, 200, { success: true, id, message: `Division "${deleted.name}" deleted.` })
          }

          // ── HERO SLIDES CRUD ─────────────────────────────────────────────
          if (url === '/api/slides' && method === 'POST') {
            const newSlide = await parseJsonBody(req)
            newSlide.id = Date.now()
            if (!db.slides) db.slides = []
            db.slides.push(newSlide)
            logAudit(db, 'CREATE', 'SLIDE', `Added slide "${newSlide.eyebrow || 'New Slide'}"`)
            writeDb(db)
            broadcastSSE('sync', { type: 'SLIDE_ADD', slide: newSlide, db })
            return sendJson(res, 201, { success: true, slide: newSlide, message: 'Hero slide created.' })
          }

          if (url === '/api/slides/reorder' && method === 'PUT') {
            const { slides } = await parseJsonBody(req)
            if (Array.isArray(slides)) {
              db.slides = slides
              logAudit(db, 'UPDATE', 'SLIDES', 'Reordered hero slides')
              writeDb(db)
              broadcastSSE('sync', { type: 'SLIDES_REORDER', slides, db })
              return sendJson(res, 200, { success: true, message: 'Slides reordered successfully.' })
            }
          }

          if (url.startsWith('/api/slides/') && method === 'PUT') {
            const id = parseInt(decodeURIComponent(url.replace('/api/slides/', '')), 10)
            const updated = await parseJsonBody(req)
            const idx = db.slides.findIndex((s: any) => s.id === id)
            if (idx === -1) {
              return sendJson(res, 404, { error: 'Slide not found' })
            }
            db.slides[idx] = { ...db.slides[idx], ...updated, id }
            logAudit(db, 'UPDATE', 'SLIDE', `Updated slide #${id}`)
            writeDb(db)
            broadcastSSE('sync', { type: 'SLIDE_UPDATE', slide: db.slides[idx], db })
            return sendJson(res, 200, { success: true, slide: db.slides[idx], message: 'Slide updated successfully.' })
          }

          if (url.startsWith('/api/slides/') && method === 'DELETE') {
            const id = parseInt(decodeURIComponent(url.replace('/api/slides/', '')), 10)
            const idx = db.slides.findIndex((s: any) => s.id === id)
            if (idx === -1) {
              return sendJson(res, 404, { error: 'Slide not found' })
            }
            db.slides.splice(idx, 1)
            logAudit(db, 'DELETE', 'SLIDE', `Removed slide #${id}`)
            writeDb(db)
            broadcastSSE('sync', { type: 'SLIDE_DELETE', id, db })
            return sendJson(res, 200, { success: true, id, message: 'Slide deleted successfully.' })
          }

          // ── COMPANY SETTINGS ─────────────────────────────────────────────
          if (url === '/api/company' && method === 'PUT') {
            const updatedCompany = await parseJsonBody(req)
            db.company = { ...db.company, ...updatedCompany }
            logAudit(db, 'UPDATE', 'COMPANY', 'Updated company profile and contact details')
            writeDb(db)
            broadcastSSE('sync', { type: 'COMPANY_UPDATE', company: db.company, db })
            return sendJson(res, 200, { success: true, company: db.company, message: 'Company settings updated.' })
          }

          // ── INQUIRIES ───────────────────────────────────────────────────
          if (url === '/api/inquiries' && method === 'POST') {
            const inq = await parseJsonBody(req)
            inq.id = `inq-${Date.now()}`
            inq.date = new Date().toISOString()
            inq.read = false
            if (!db.inquiries) db.inquiries = []
            db.inquiries.unshift(inq)
            logAudit(db, 'CREATE', 'INQUIRY', `Received inquiry from ${inq.name} (${inq.subject || 'General'})`)
            writeDb(db)
            broadcastSSE('sync', { type: 'INQUIRY_ADD', inquiry: inq, db })
            return sendJson(res, 201, { success: true, inquiry: inq, message: 'Thank you! Your message has been sent.' })
          }

          if (url.startsWith('/api/inquiries/') && method === 'DELETE') {
            const id = decodeURIComponent(url.replace('/api/inquiries/', ''))
            db.inquiries = (db.inquiries || []).filter((i: any) => i.id !== id)
            logAudit(db, 'DELETE', 'INQUIRY', `Deleted inquiry ${id}`)
            writeDb(db)
            broadcastSSE('sync', { type: 'INQUIRY_DELETE', id, db })
            return sendJson(res, 200, { success: true, message: 'Inquiry deleted.' })
          }

          return sendJson(res, 404, { error: `Endpoint not found: ${method} ${url}` })
        } catch (err: any) {
          console.error('[API Plugin] Error handling request:', err)
          return sendJson(res, 500, { error: err.message || 'Internal Server Error' })
        }
      })
    },
  }
}
