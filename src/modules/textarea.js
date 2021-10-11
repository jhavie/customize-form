/*
 * 输入框
 * params
 *   formType<String>: 服务项名
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 */
import _merge from 'lodash/merge';

export default ({ label, value, props = {}, itemProps = {}, ...mores }) => ({
    ...mores,
    props: _merge({
        type: 'textarea',
        autosize: {
            minRows: 5,
            maxRows: 20,
        },
        maxlength: 1000,
        'show-word-limit': true,
        style: {
            width: '100%',
        },
    }, props),
    formType: 'input',
    getText: data => data,
    default: value || '',
    itemProps: _merge({
        label,
        style: {
            width: '100%',
        },
    }, itemProps),
    validate: (data) => {
        return data === '';
    },
});
