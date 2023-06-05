/**
 * To mark the way of Component composition, each Component corresponds to a bit at certain position.
 * 用于标记组件的组合的方式，每一个组件对应一个bit位
 */
export class Signature {
  /**
   * Current bit length.
   * 当前签名位数
   */
  protected bits = 0

  /**
   * Apply for a new bit.
   * 申请一个新的bit位
   */
  register () {
    return this.bits++
  }

  /**
   * Convert the signature value to a decimal number.
   * 将二进制签名值转换为十进制
   * @param value signature value
   */
  parse (value: number | string | string[]) {
    if (typeof value === 'number') {
      return value
    }

    if (Array.isArray(value)) {
      value = value.map((v) => v || '0').join('')
    }

    return Number('0b' + value)
  }

  /**
   * Create a signature template.
   * 创建一个签名模板（数组）
   */
  create () {
    return new Array(this.bits).fill('0')
  }

  /**
   * Set the bit at the specified position.
   * 设置指定位置的bit位
   * @param signature signature in array
   * @param bitIndex bit position
   * @param value bit value
   */
  setBitAt (signature: string[], bitIndex: number, value: string) {
    signature[this.bits - bitIndex] = value
  }
}
