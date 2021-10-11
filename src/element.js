import nameMap, { valueMap } from './config/elementMap';

// 顶级元素列表
const keys = ['class', 'style', 'key', 'ref', 'props', 'on'];

function getName(name) {
    return nameMap[name] || name;
}

function getProps({
    className,
    style,
    key,
    ref,
    on,
    ...props
} = {}, compName) {
    // 从props中过滤顶级元素
    const data = { ref, key, style, props, on };
    if (className) data.class = className;
    (valueMap[compName] || []).forEach(val => {
        if (props.value === val[0]) props.value = val[1];
    });
    return keys.reduce((ans, keyName) => {
        if (ans[keyName] === undefined) delete ans[keyName];
        return ans;
    }, data);
}

export default {
    name: 'elementComp',
    props: {
        compProps: {
            type: Object,
            default: () => ({}),
        },
        compName: {
            type: String,
            default: () => 'span',
        },
    },
    render(h) {
        // 渲染elementUI组件
        const self = this;
        const { on, ...props } = getProps(this.compProps, this.compName);
        const compName = getName(this.compName);
        return h(compName, {
            ...props,
            on: {
                ...on,
                input: (params) => {
                    self.$emit('input', params);
                },
            },
        });
    },
};
