/*
 * 输入框
 * params
 *   formType<String>: 服务项名
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 */
import _merge from 'lodash/merge';

export default ({ label, value = '', props = {}, ...mores }) => ({
    ...mores,
    label,
    props: _merge({}, props),
    formType: 'checkboxAll',
    default: value || [],
    itemProps: {
        label: '',
        style: {
            width: '100%',
        }
    },
    validate: (data) => data.length === 0,
});
