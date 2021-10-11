import _merge from 'lodash/merge';

export default ({ value, priceObj = {}, label, props = {}, ...mores }) => ({
    validate: (data) => (typeof data === 'boolean' ? !data : data.length === 0),
    ...mores,
    props: _merge({
        text: '价格录入',
        priceObj,
    }, props),
    formType: 'price-calendar',
    default: value || [],
    itemProps: {
        label,
        style: {
            width: '50%',
        },
    },
});