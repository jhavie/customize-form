/*
 * 多选框
 * params
 *   formType<String>: 服务项名
 *   options<Array>: 下拉列表
 *   props<Object>: 传入源组件的配置项
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 */
import _merge from 'lodash/merge';

export default ({ options, label, props = {}, ...mores }) => ({
    ...mores,
    formType: 'cascader',
    getText(data) {
        return data.join('、');
    },
    props: _merge({
        props: {
            multiple: true,
        },
        'collapse-tags': true,
        clearable: true,
    }, props),
    options,
    itemProps: {
        label,
        style: {
            width: '50%',
        },
    },
});
