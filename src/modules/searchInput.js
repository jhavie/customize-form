/*
 * 输入框
 * params
 *   formType<String>: 服务项名
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 */
import _merge from 'lodash/merge';

export default ({ label, value, props = {}, ...mores }) => ({
    labelKey: 'label',
    valueKey: 'value',
    validate: (data) => data.value === '',
    ...mores,
    props: _merge({
        placeholder: '请输入关键词',
        showSlot: false
    }, props),
    formType: 'searchInput',
    getText: data => data.value,
    default: value || { value: '' },
    itemProps: {
        label,
        style: {
            width: '50%',
        },
    },
});
