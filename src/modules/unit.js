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

export default ({ props = {}, units, label, ...mores }) => ({
    ...mores,
    props: _merge({
        style: {
            width: '90px',
        },
    }, props),
    formType: 'select',
    default: units[0].value || units[0],
    getText: data => data,
    options: units,
    validate: (data) => false,
});
