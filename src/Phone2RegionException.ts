/**
 * Phone2Region异常类
 * @version 2024/08/14 11:11:11
 * @author ALI[ali-k&#64;foxmail.com]
 * @since 1.0.0
 */
class Phone2RegionException extends Error {

  /**
   * Phone2Region异常
   * @param message 信息
   */
  constructor(message?: string) {
    super(message)
    this.name = 'Phone2RegionException'
  }
}

export {Phone2RegionException}
