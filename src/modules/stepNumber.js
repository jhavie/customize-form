/*
 * 数字输入框
 * params
 *   formType<String>: 服务项名
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 */
import _merge from 'lodash/merge';
import { isDefined } from '../utils/tools/';

export default ({ props = {}, value, label, ...mores }) => ({
    ...mores,
    props: _merge({}, props),
    formType: 'input-number',
    getText: data => (isDefined(data) && props.parseData ? props.parseData(data) : data),
    default: value || undefined,
    itemProps: {
        label,
        style: {
            width: '50%',
        },
    },
    validate: (data) => data === undefined,
});
