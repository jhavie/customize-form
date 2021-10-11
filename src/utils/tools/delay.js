/**
 * 延时处理函数
 *
 * @param {number} s 延时时间, 单位秒
 * @returns {promise} 返回promise对象
 */

export default function(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}
