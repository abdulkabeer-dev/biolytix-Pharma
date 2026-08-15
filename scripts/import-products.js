import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as XLSX from 'xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.resolve(__dirname, '../products_data')
const outputFilePath = path.resolve(__dirname, '../src/data/products.ts')

// Find the latest Excel / CSV file in products_data
const files = fs.readdirSync(uploadDir).filter(f => f.endsWith('.xlsx') || f.endsWith('.xls') || f.endsWith('.csv'))

if (files.length === 0) {
  console.log('No Excel or CSV file found in products_data folder.')
  process.exit(1)
}

const targetFile = path.join(uploadDir, files[0])
console.log(`Reading products from: ${targetFile}`)

const workbook = XLSX.readFile(targetFile)
const sheetName = workbook.SheetNames[0]
const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' })

console.log(`Parsed ${rawRows.length} rows. Ready to generate products.ts...`)
