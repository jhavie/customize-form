/**
 * 传入对象， 对对象键处理后返回新对象
 *
 * @param {Object} obj 待处理对象
 * @param {Array} keys 需要处理的键的集合
 * @param {String} value keys中的键不在obj中时赋的值
 * @returns {Object} 返回经过处理后的值
 */
export function pick(obj, keys, value = null) {
    const objKeys = Object.keys(obj);
    return keys.reduce((ans, key) => {
        if (objKeys.includes(key)) {
            ans[key] = obj[key];
        } else {
            ans[key] = value;
        }
        return ans;
    }, {});
}

export default {
};
