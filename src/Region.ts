/**
 * 区域
 * @version 2024/08/14 11:11:11
 * @author ALI[ali-k&#64;foxmail.com]
 * @since 1.0.0
 */
class Region {

  /**
   * 省份
   */
  readonly province: string
  /**
   * 城市
   */
  readonly city: string
  /**
   * 邮编
   */
  readonly zipCode: string
  /**
   * 区号
   */
  readonly areaCode: string
  /**
   * ISP
   */
  readonly isp: string

  /**
   * 构造函数
   * @param region 区域字符串
   */
  constructor(region: string) {
    // 省份|城市|邮编|区号|ISP
    let s = region.split('|')
    if (s.length === 5) {
      this.province = s[0]
      this.city = s[1]
      this.zipCode = s[2]
      this.areaCode = s[3]
      this.isp = s[4]
    }
  }

}

export {Region}
