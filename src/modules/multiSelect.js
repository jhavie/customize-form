/*
 * 多选下拉框
 * params
 *   label<String>: 中文名
 *   options<Array>: 下拉项
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 *
 * options -> params: 同elementUI
 */
import _merge from 'lodash/merge';
import _get from 'lodash/get';

export default ({ props = {}, value, options, label, ...mores }) => ({
    ...mores,
    props: _merge({
        'collapse-tags': true,
        multiple: true,
        clearable: true,
    }, props),
    formType: 'select',
    default: value || [],
    getText: (data, config) => data.map(item => _get(config, 'options', []).find(opt => opt.value === item).label).join(','),
    itemProps: {
        label,
        style: {
            width: '50%',
        },
    },
    options,
    validate: (data) => data.length === 0,
});
