/**
 * 判断数据是否是函数
 *
 * @param {any} param 传入的数据
 * @returns {boolean} 返回布尔值
 */

export default function isFunction(param) {
    return param && param.constructor === Function;
}