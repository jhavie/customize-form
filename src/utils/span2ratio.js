/* **
 * 将栅格值转换为百分比
 * @param {Number} span 栅格值
 * @returns {String} 转换后的百分比值
 * */
const maxSpan = 12;
export default function span2ratio(span) {
    // 百分宽度直接返回
    if (span && span.constructor === String && /^\d{1,3}%$/.test(span)) return span;
    if (span || span.constructor === Number) return `${span / maxSpan * 100}%`;
    return span;
}
