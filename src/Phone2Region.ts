import {Uint8ArrayReader, Uint8ArrayWriter, ZipReader} from '@zip.js/zip.js'
import {Phone2RegionException} from './Phone2RegionException'
import {Region} from './Region'
import {crc32} from './Crc32'

const decoder = new TextDecoder('utf-8')

/**
 * 手机号码转区域
 * @version 2024/08/14 11:11:11
 * @author ALI[ali-k&#64;foxmail.com]
 * @since 1.0.0
 */
class Phone2Region {

  /**
   * 已初始化
   */
  private isInit = false
  /**
   * 数据
   */
  private buffer: DataView
  /**
   * 二级索引区指针
   */
  private vector2AreaPtr: number
  /**
   * 索引区指针
   */
  private vectorAreaPtr: number

  /**
   * 是否已经初始化
   */
  initialized() {
    return this.isInit
  }

  /**
   * 初始化实例通过URL<br>
   * 例如：<code>https://www.404z.cn/files/phone2region/v2.0.0/data/phone2region.zdb</code>
   * @param url URL
   */
  async initByUrl(url: string) {
    if (this.isInit) {
      throw new Phone2RegionException('已经初始化过了，不可重复初始化！')
    }
    await this.init(await (await fetch(url)).arrayBuffer())
  }

  /**
   * 初始化实例
   * @param arraybuffer 压缩的zdb ArrayBuffer
   */
  async init(arraybuffer: ArrayBuffer) {
    if (this.isInit) {
      throw new Phone2RegionException('已经初始化过了，不可重复初始化！')
    }
    if (!arraybuffer) {
      throw new Phone2RegionException('数据文件为空！')
    }
    const zipReader = new ZipReader(new Uint8ArrayReader(new Uint8Array(arraybuffer)))
    const db = await (await zipReader.getEntries()).shift().getData(new Uint8ArrayWriter())
    this.buffer = new DataView(db.buffer)
    const crc32OriginValue = this.buffer.getInt32(0, true)
    if (crc32OriginValue !== crc32(db, 4)) {
      throw new Phone2RegionException('数据文件校验错误！')
    }
    this.vector2AreaPtr = this.buffer.getInt32(12, true)
    this.vectorAreaPtr = this.buffer.getInt32(16, true)
    this.isInit = true
    // console.log(`数据加载成功：版本号VERSION ${this.buffer.getInt32(4, true)} ，校验码CRC32 ${(crc32OriginValue + 0x100000000).toString(16).toLocaleUpperCase()}`)
  }

  /**
   * 解析手机号码的区域
   * @param phone 手机号码(前7-11位)
   * @return Region 找不到返回undefined
   */
  parse(phone: string): Region | undefined {
    if (typeof phone !== 'string') {
      throw new Phone2RegionException(`类型 ${(typeof phone)} 不合法！应为 string`)
    }
    // 7-11位
    if (!phone || phone.length < 7 || phone.length > 11) {
      throw new Phone2RegionException(`手机号码 ${phone} 不合法！`)
    }
    let num = Number(phone.substring(0, 7))
    // 1300000-1999999
    if (Number.isNaN(num) || num < 1300000 || num > 1999999) {
      throw new Phone2RegionException(`手机号码 ${phone} 不合法！`)
    }
    return this.innerParse(num - 1300000)
  }

  /**
   * 解析手机号码的区域
   * @param phone 手机号码(11位)
   * @return Region 找不到返回undefined
   */
  parse11(phone: number): Region | undefined {
    if (typeof phone !== 'number') {
      throw new Phone2RegionException(`类型 ${(typeof phone)} 不合法！应为 number`)
    }
    // 1300000_0000-1999999_9999
    if (phone < 1300000_0000 || phone > 1999999_9999) {
      throw new Phone2RegionException(`手机号码 ${phone} 不合法！`)
    }
    return this.innerParse(Math.floor((phone / 10000)) - 1300000)
  }

  /**
   * 解析手机号码的区域
   * @param phone 手机号码(前7位)
   * @return Region 找不到返回undefined
   */
  parse7(phone: number): Region | undefined {
    if (typeof phone !== 'number') {
      throw new Phone2RegionException(`类型 ${(typeof phone)} 不合法！应为 number`)
    }
    // 1300000-1999999
    if (phone < 1300000 || phone > 1999999) {
      throw new Phone2RegionException(`手机号码 ${phone} 不合法！`)
    }
    return this.innerParse(phone - 1300000)
  }

  /**
   * 解析手机号码的区域(内部)
   * @param phone 手机号码前7位-1300000
   * @return Region (找不到返回undefined)
   */
  private innerParse(phone: number): Region | undefined {
    if (!this.isInit) {
      throw new Phone2RegionException('未初始化！')
    }

    // 二级索引区
    let pos = this.vector2AreaPtr + ((phone >> 8) << 2)
    let left = this.buffer.getInt32(pos, true)
    let right = this.buffer.getInt32(pos + 4, true)

    // 索引区
    if (left === right) {
      return
    } else {
      right -= 5
      // 二分查找
      let num = 0
      let phoneSegments = phone & 0xFF
      // 索引区
      while (left <= right) {
        pos = this.align(Math.floor((left + right) / 2))
        // 查找是否匹配到
        num = this.buffer.getInt8(pos) & 0xFF
        if (phoneSegments < num) {
          right = pos - 5
        } else if (phoneSegments > num) {
          left = pos + 5
        } else {
          break
        }
      }
      if (num !== phoneSegments) {
        return
      }
    }

    // 记录区
    pos = this.buffer.getInt32(pos + 1, true)
    let recordValueLength = this.buffer.getInt8(pos) & 0xFF
    let recordValue = this.buffer.buffer.slice(pos + 1, pos + 1 + recordValueLength)
    return new Region(decoder.decode(recordValue))
  }

  /**
   * 字节对齐
   * @param pos 位置
   * @return number 对齐后的位置
   */
  private align(pos: number): number {
    let remain = (pos - this.vectorAreaPtr) % 5
    if (pos - this.vectorAreaPtr < 5) {
      return pos - remain
    } else if (remain !== 0) {
      return pos + 5 - remain
    } else {
      return pos
    }
  }

}

export {Phone2Region}