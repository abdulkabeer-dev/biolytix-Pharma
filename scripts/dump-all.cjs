const path = require('path')
const fs = require('fs')
const XLSX = require('xlsx')

const excelPath = path.resolve(__dirname, '../products_data/BIOLYTIX.xlsx')
const workbook = XLSX.readFile(excelPath)

const allProducts = []

workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 })
  rows.forEach((r, i) => {
    const name = (r[0] || '').toString().trim()
    const comp = (r[1] || '').toString().trim()
    if (name && name !== 'Product Name' && name !== 'NAME') {
      allProducts.push({ sheet: sheetName, row: i, name, composition: comp })
    }
  })
})

console.log(`Total parsed items across sheets: ${allProducts.length}`)
fs.writeFileSync(path.resolve(__dirname, 'dumped_products.json'), JSON.stringify(allProducts, null, 2))
console.log('Saved dumped_products.json')
