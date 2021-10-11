/**
 * @param {string} str 待解析的字符串
 * @returns {object | null} 解析结果
 */

export default function(str, defaultValue = null) {
    try {
        return JSON.parse(str);
    } catch (err) {
        return defaultValue;
    }
}