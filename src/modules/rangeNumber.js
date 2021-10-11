/*
 * 下拉列表
 * params
 *   label<String>: 中文名
 *   options<Array>: 下拉项
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 *
 * options -> params: 同elementUI
 */
import _merge from 'lodash/merge';
import { isDefined } from '../utils/tools/';

export default ({ props = {}, value, units, label, ...mores }) => ({
    ...mores,
    props: _merge({
        controls: false,
    }, props),
    formType: 'rangeNumber',
    default: value || [undefined, undefined],
    getText: (data, { props: prop = {} } = {}, idx) => {
        return data.filter(isDefined)
            .map(item => item.toFixed((isDefined(idx) ? prop[idx].precision : prop.precision) || 0))
            .join(' ~ ');
    },
    itemProps: {
        label,
        style: {
            width: '50%',
        },
    },
    validate: (data) => {
        if (data.every(item => item === undefined)) {
            return true;
        } else if (!(isDefined(data[0]) && isDefined(data[1]))) {
            // 只有一项填写 另一项没有填写
            return {
                notOk: true,
                message: `请输入完整的${label}`
            };
        } else if (data[0] > data[1]) {
            return {
                notOk: true,
                message: '请输入正确数字范围',
            };
        }
        return false;
    },
});
