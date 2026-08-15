const path = require('path')
const XLSX = require('xlsx')

const excelPath = path.resolve(__dirname, '../products_data/BIOLYTIX.xlsx')
const workbook = XLSX.readFile(excelPath)

console.log('Sheet Names:', workbook.SheetNames)

workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 })
  console.log(`\n=== SHEET: ${sheetName} (Rows: ${rows.length}) ===`)
  rows.slice(0, 15).forEach((r, i) => console.log(`Row ${i}:`, JSON.stringify(r)))
})
