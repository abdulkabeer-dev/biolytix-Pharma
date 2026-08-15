import path from 'path'
import { fileURLToPath } from 'url'
import * as XLSX from 'xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const excelPath = path.resolve(__dirname, '../products_data/BIOLYTIX.xlsx')
const workbook = XLSX.readFile(excelPath)

console.log('Sheet Names:', workbook.SheetNames)

workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
  console.log(`\n=== SHEET: ${sheetName} (Rows: ${rows.length}) ===`)
  if (rows.length > 0) {
    console.log('Columns:', Object.keys(rows[0]))
    console.log('Sample Row 1:', rows[0])
    if (rows.length > 1) console.log('Sample Row 2:', rows[1])
    if (rows.length > 2) console.log('Sample Row 3:', rows[2])
  }
})
