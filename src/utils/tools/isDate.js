/**
 * 判断数据是否是日期对象
 *
 * @param {any} param 传入的数据
 * @returns {boolean} 返回布尔值
 */

export default function isDate(param) {
    return param && param.constructor === Date;
}
