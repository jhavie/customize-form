import _merge from 'lodash/merge';

export default ({ label, value, props = {}, ...mores }) => ({
    limit: 10,
    ...mores,
    props: _merge({}, props),
    formType: 'uploadBtn',
    default: value || [],
    itemProps: {
        label,
        style: {
            width: '100%',
        },
    },
    validate: (data) => data.length === 0,
});