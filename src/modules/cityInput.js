/*
 * 输入框
 * params
 *   formType<String>: 服务项名
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 */
import _merge from 'lodash/merge';
import { areaNameMap } from '../config/nameMap';

export default ({ label, value, props = {}, ...mores }) => ({
    ...mores,
    props: _merge({
        params: {
            type: 'input',
        },
    }, props),
    formType: 'areaInput',
    getText: data => areaNameMap.map(item => data[item[1]]).join(' / '),
    default: value || {},
    itemProps: {
        label,
        style: {
            width: '50%',
        },
    },
    validate: (data) => Object.keys(data).length === 0,
});
