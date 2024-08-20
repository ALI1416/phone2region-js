# Phone Number To Region For JavaScript 手机号码转区域JavaScript版

[![License](https://img.shields.io/github/license/ALI1416/phone2region-js?label=License)](https://www.apache.org/licenses/LICENSE-2.0.txt)
[![Node Support](https://img.shields.io/badge/Node-14+-green)](https://nodejs.org/)
[![NPM](https://img.shields.io/npm/v/@ali1416/phone2region?label=NPM)](https://www.npmjs.com/package/@ali1416/phone2region)
[![Tag](https://img.shields.io/github/v/tag/ALI1416/phone2region-js?label=Tag)](https://github.com/ALI1416/phone2region-js/tags)
[![Repo Size](https://img.shields.io/github/repo-size/ALI1416/phone2region-js?label=Repo%20Size&color=success)](https://github.com/ALI1416/phone2region-js/archive/refs/heads/master.zip)

[![Node CI](https://github.com/ALI1416/phone2region-js/actions/workflows/ci.yml/badge.svg)](https://github.com/ALI1416/phone2region-js/actions/workflows/ci.yml)

## 简介

本项目迁移自[ALI1416/phone2region](https://github.com/ALI1416/phone2region)，构建后`phone2region.min.js`文件仅`3kb`

[在线示例](https://www.404z.cn/demo/phone2region.html)

## 数据文件

- 数据文件目录：[点击查看](https://github.com/ALI1416/phone2region/tree/master/data)

### 其他语言项目

- `Java` : [ALI1416/phone2region](https://github.com/ALI1416/phone2region)

## 依赖导入

### 网页

<https://unpkg.com/@zip.js/zip.js/dist/zip.min.js>
<https://unpkg.com/@ali1416/phone2region/dist/phone2region.min.js>

### node

```sh
npm install @ali1416/phone2region
```

## 使用示例

```js
// node test-node.js
const fs = require('fs')
const {Phone2Region} = require('../dist/phone2region.node')

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
  let buffer = fs.readFileSync(zdbPath).buffer
  await phone2Region.init(buffer)
  run()
}

function run() {
  console.log(phone2Region.parse('1875471'))
  console.log(phone2Region.parse('18754710000'))
  console.log(phone2Region.parse7(1875471))
  console.log(phone2Region.parse11(18754710000))
}
```

更多请见[测试](./test)

## 更新日志

[点击查看](./CHANGELOG.md)

## 参考

- [ALI1416/phone2region](https://github.com/ALI1416/phone2region)

## 关于

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://www.404z.cn/images/about.dark.svg">
  <img alt="About" src="https://www.404z.cn/images/about.light.svg">
</picture>
