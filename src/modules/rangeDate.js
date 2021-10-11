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
    formType: 'date-range',
    default: value || null,
    getText: data => data.map(item => dayjs(item).format('YYYY-MM-DD')).join(' 至 '),
    itemProps: {
        label,
        style: {
            width: '50%',
        },
    },
    validate: (data) => !data,
});
