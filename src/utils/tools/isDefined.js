/**
 * 判断数据是否是定义数据
 *
 * @param {any} param 传入的数据
 * @returns {boolean} 返回布尔值
 */

export default function isDefined(param) {
    return param !== null && typeof param !== 'undefined';
}
