const fs = require('fs')
const path = require('path')

const dumped = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'dumped_products.json'), 'utf8'))

console.log('--- Sample Products ---')
dumped.slice(0, 40).forEach((p, i) => {
  console.log(`${i+1}. [${p.name}] -> ${p.composition}`)
})
