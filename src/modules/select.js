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
import _get from 'lodash/get';

export default ({ props = {}, value, options, label, ...mores }) => ({
    ...mores,
    props: _merge({
        clearable: true,
    }, props),
    formType: 'select',
    default: value || null,
    getText: (data, config) => _get(config, 'options', []).find(item => item.value === data).label,
    itemProps: {
        label,
        style: {
            width: '50%',
        },
    },
    options,
    validate: (data) => data === '' || data === null,
});
