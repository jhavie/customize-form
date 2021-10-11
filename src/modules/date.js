/*
 * 单选日期
 * params
 *   formType<String>: 服务项名
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 */
import _merge from 'lodash/merge';
import dayjs from 'dayjs';

export default ({ label, value, props = {}, ...mores }) => ({
    ...mores,
    props: _merge({}, props),
    formType: 'date',
    getText: data => dayjs(data).format('YYYY-MM-DD'),
    default: value || null,
    itemProps: {
        label,
        style: {
            width: '50%',
        },
    },
    validate: (data) => !data,
});
