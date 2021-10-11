/*
 * 默认配置
 * params
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 */
import { getPrototype } from 'Utils';

export default ({ label, value = '', ...mores }) => ({
    ...mores,
    default: value || '',
    itemProps: {
        label,
        style: {
            width: '240px'
        }
    },
    validate: (data) => {
        if (Array.isArray(data)) {
            return data.length !== 0;
        } else if (getPrototype(data) === 'Object') {
            return JSON.stringify(data) !== '{}';
        } else if (getPrototype(data) === 'String') {
            return data.trim() === '';
        }
        return false;
    },
});
