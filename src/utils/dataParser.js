/**
 * 数据修改后对数据进行处理返回新数据
 *
 * @param {any} data 数据
 * @param {Object} params 配置信息
 * @returns {any} 返回修改后的data
 */
import { isNotDefined, isDefined } from './tools/index';
import { datetimeConfig } from '../config/datetime';
import dayjs from 'dayjs';
import { valueMap } from '../config/elementMap';

export function dataParserBack(data, { config = {}, type, param } = {}) {
    // 反向数据解析, 数据生成后执行处理函数
    if (isNotDefined(data)) return data;
    if (data.constructor === Array && data.some(item => isNotDefined(item))) return data;
    let ans = data;
    const { props = {} } = config;
    if (isDefined(props.zoom)) {
        // 数值扩大倍数
        if (props.zoom.constructor !== Number) {
            console.log('customize-form::error::dataParserBack::zoom', data, props.zoom);
        } else if (data.constructor === Number) {
            ans = data * props.zoom;
        } else if (data.constructor === Array && data.every(item => item.constructor === Number)) {
            ans = data.map(item => item * props.zoom);
        } else {
            console.log('customize-form::error::dataParserBack::zoom', data, props.zoom);
        }
    }
    if (type === 'datetime') {
        const format = config.props?.format ?? datetimeConfig(param).format;
        const formatFunc = (item) => dayjs(item).format(format.replace('yyyy-MM-dd', 'YYYY-MM-DD'));
        ans = data.constructor === Array ? data.map(formatFunc) : formatFunc(data);
    }
    return ans;
}

export function dataParserFront(data, { config = {}, type, param } = {}) {
    // 正向数据解析, 执行处理函数生成数据
    let ans = data;
    (valueMap[config.formType] || []).forEach(val => {
        if (ans === val[0]) ans = val[1];
    });
    if (isNotDefined(ans)) return ans;
    if (ans.constructor === Array && ans.some(item => isNotDefined(ans))) return ans;
    const { props = {} } = config;
    if (isDefined(props.zoom)) {
        // 数值扩大倍数
        if (props.zoom.constructor !== Number) {
            console.log('customize-form::error::dataParserFront::zoom', ans, props.zoom);
        } else if (ansj.constructor === Number) {
            ans /= props.zoom;
        } else if (ans.constructor === Array && ans.every(item => item.constructor === Number)) {
            ans = ans.map(item => item / props.zoom);
        } else {
            console.log('customize-form::error::dataParserFront::zoom', ans, props.zoom);
        }
    }
    if (type === 'datetime') {
        ans = ans.constructor === Array
            ? ans.map((item) => dayjs(datetimeConfig(param).getVal(item)).toDate())
            : dayjs(datetimeConfig(param).getVal(ans)).toDate();
    }
    if (type === 'getSelectValue') {
        // 下拉选择框数据特殊处理, 返回select类型的值, 当不在下拉列表返回default
        ans = (config.options && config.options.map((item) => item.value).includes(ans)) || ans.constructor === Array ? ans : param;
    }
    return ans;
}