/*
 * 图片上传
 * params
 *   formType<String>: 服务项名
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 */
import _merge from 'lodash/merge';

export default ({ label, value, props = {}, ...mores }) => ({
    ...mores,
    props: _merge({}, props),
    formType: 'uploadImage',
    default: value || [],
    itemProps: {
        label,
        style: {
            width: '100%',
        },
    },
    validate: (data) => data.length === 0,
});
