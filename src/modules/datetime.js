/*
 * 单选日期
 * params
 *   formType<String>: 服务项名
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 */
import _merge from 'lodash/merge';
import { datetimeConfig } from '../config/datetime';

export default ({ label, value, props = {}, ...mores }) => ({
    validate: (data) => !data,
    ...mores,
    props: _merge({ placeholder: datetimeConfig(props.type).placeholder }, props),
    formType: props.type === 'time' ? 'datetime-time' : 'datetime-date',
    getText: data => data,
    default: value || null,
    itemProps: {
        label,
        style: {
            width: '50%',
        },
    },
});
