// node test-js.js
const fs = require('fs')
const Phone2Region = require('../dist/phone2region.js')

let url = 'https://www.404z.cn/files/phone2region/v2.0.0/data/phone2region.zdb'
let zdbPath = 'D:/phone2region.zdb'

let phone2Region = new Phone2Region()

// runUrl()
runFile()

async function runUrl() {
  await phone2Region.initByUrl(url)
  run()
}

async function runFile() {
  console.log(`是否已经初始化：${phone2Region.initialized()}`)
  let buffer = fs.readFileSync(zdbPath).buffer
  await phone2Region.init(buffer)
  console.log(`是否已经初始化：${phone2Region.initialized()}`)
  run()
}

function run() {
  console.log(phone2Region.parse('1875471'))
  console.log(phone2Region.parse('18754710000'))
  console.log(phone2Region.parse7(1875471))
  console.log(phone2Region.parse11(18754710000))
}
