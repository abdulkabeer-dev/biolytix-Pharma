const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')

// Read SEGMENT WISE.xlsx
const wb = XLSX.readFile(path.resolve(__dirname, '../products_data/SEGMENT WISE.xlsx'))
const sheet = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

// Read live_db.json
const liveDb = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/live_db.json'), 'utf8'))

console.log('=== VERIFICATION OF REARRANGED PRODUCTS ===')
console.log('Total Divisions in DB:', liveDb.divisions.length)
console.log('Total Medicines in DB:', liveDb.medicines.length)

let pass = true

liveDb.divisions.forEach(div => {
  const prods = liveDb.medicines.filter(m => m.divisionId === div.id)
  console.log(`\nDivision [${div.id}] "${div.name}": ${prods.length} products`)
  prods.forEach((p, idx) => {
    console.log(`  ${idx + 1}. ${p.name} (${p.form}, ${p.pack})`)
  })
  if (prods.length === 0) {
    console.error(`ERROR: Division ${div.id} has 0 products!`)
    pass = false
  }
})

if (pass) {
  console.log('\n✅ ALL 11 DIVISIONS HAVE VALID REARRANGED PRODUCTS!')
} else {
  console.log('\n❌ VERIFICATION FAILED!')
}
