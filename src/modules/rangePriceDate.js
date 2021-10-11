/*
 * 单选日期
 * params
 *   formType<String>: 服务项名
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 */
import _merge from 'lodash/merge';

export default ({ value, priceObj = {}, label, props = {}, ...mores }) => ({
    ...mores,
    props: _merge({
        isRange: true,
        showNum: 2,
        priceObj,
    }, props),
    formType: 'price-date',
    default: value || { data: [] },
    getText: data => `${data.data.join(' 至 ')} 合计 ${data.priceSum || '0'} 元`,
    itemProps: {
        label,
        style: {
            width: '100%',
        },
    },
    validate: (data) => data.data.length === 0,
});
