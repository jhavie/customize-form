/**
 * 判断数据是否是定义数据
 *
 * @param {any} param 传入的数据
 * @returns {boolean} 返回布尔值
 */
import isDefined from './isDefined';

export default function isNotDefined(param) {
    return !isDefined(param);
}
