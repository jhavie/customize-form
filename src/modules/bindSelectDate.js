/*
 * 选择展示，date和datetime根据select选择
 * params
 *   label<String>: 中文名
 *   formType<String>: 服务项名
 *   itemProps<Object>: 传入服务项的控制参数
 *     label<String>: 服务项名
 *   default<Array>: 默认值
 *   list<Array>: 子组件的集合
 *   length<Number>: default数组的数量， 默认1
 *   btns<Array>:按钮
 */
import _merge from 'lodash/merge';
import dayjs from 'dayjs';

export default ({ label, value, options, props = {}, ...mores }) => ({
    ...mores,
    props: _merge({}, props),
    itemProps: {
        label,
        style: {
            width: '100%',
        },
    },
    formType: 'order',
    default: value || [['', '']],
    getText: data => {
        let date = '';
        if (data[1].constructor === Array) {
            date = data[1].map(item => dayjs(item).format('YYYY-MM-DD')).join(' 至 ');
        } else {
            date = dayjs(data[1]).format('YYYY-MM-DD');
        }
        return `${data[0]} ${date}`;
    },
    length: value && value.constructor === Array ? value.length : 1,
    list: [
        {
            formType: 'select',
            options,
            props: {
                style: {
                    width: '70px',
                },
            },
        },
        {
            formType: 'bind',
            bindList: [
                {
                    formType: 'date',
                    bind: options[0],
                    props: {
                        style: {
                            width: '200px',
                        },
                    },
                },
                {
                    formType: 'date-range',
                    bind: options[1],
                    props: {
                        style: {
                            width: '200px',
                        },
                    },
                },
            ],
        },
    ],
    btns: [
        {
            formType: 'button',
            event: 'del',
            label: '删除',
            where: ({ length }) => length > 1,
            click: ({ length }) => ({ key: 'length', val: length - 1 }),
            props: {},
        },
        {
            formType: 'button',
            event: 'add',
            label: '添加',
            where: ({ length, idx }) => idx + 1 === length,
            click: ({ length }) => ({ key: 'length', val: length + 1 }),
            props: {},
        },
    ],
});
