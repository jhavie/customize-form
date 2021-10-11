export default {
    hotelName: {
        formType: 'input',
        label: '行程标题',
        rules: [
            {
                required: true,
                message: '请输入邮箱地址',
                trigger: 'blur',
            },
        ],
        props: {
            placeholder: '目的地用车',
        },
    },
    hotelLevel: {
        formType: 'select',
        label: '行程类型',
        options: [
            {
                label: '去程',
                value: 'to',
            },
            {
                label: '返程',
                value: 'from',
            },
            {
                label: '中间段',
                value: 'middle',
            },
        ],
    },
    from: {
        formType: 'order',
        label: '出发地',
        length: 1,
        default: [['', '']],
        list: [
            {
                formType: 'input',
                props: {
                    placeholder: '请输入城市名检索',
                    style: {
                        width: '240px',
                    },
                },
            },
            {
                formType: 'input',
                props: {
                    placeholder: '未找到在此备注',
                    style: {
                        width: '240px',
                        marginLeft: '10px',
                    },
                },
            },
        ],
    },
    to: {
        formType: 'order',
        label: '目的地',
        length: 1,
        default: [['', '']],
        list: [
            {
                formType: 'input',
                props: {
                    placeholder: '请输入城市名检索',
                    style: {
                        width: '240px',
                    },
                },
            },
            {
                formType: 'input',
                props: {
                    placeholder: '未找到在此备注',
                    style: {
                        width: '240px',
                        marginLeft: '10px',
                    },
                },
            },
        ],
    },
    startDate: {
        formType: 'order',
        label: '出发日期',
        length: 1,
        default: [['once', '']],
        rules: [
            {
                required: true,
                message: '请输入邮箱地址',
                trigger: 'change',
            },
        ],
        list: [
            {
                formType: 'select',
                options: [
                    {
                        label: '单天',
                        value: 'once',
                    },
                    {
                        label: '范围',
                        value: 'range',
                    },
                ],
            },
            {
                formType: 'bind',
                bindList: [
                    {
                        formType: 'date',
                        bind: 'once',
                        props: {
                            placeholder: '选择日期',
                        },
                    },
                    {
                        formType: 'date-range',
                        bind: 'range',
                        props: {
                            'start-placeholder': '开始日期',
                            'end-placeholder': '结束日期',
                            'range-separator': '-',
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
    },
    startTime: {
        formType: 'order',
        label: '出发时间',
        minNum: 1,
        length: 1,
        default: [['once', '']],
        list: [
            {
                formType: 'select',
                event: 'select',
                options: [
                    {
                        label: '单天',
                        value: 'once',
                    },
                    {
                        label: '范围',
                        value: 'range',
                    },
                ],
            },
            {
                formType: 'bind',
                bindList: [
                    {
                        formType: 'date',
                        bind: 'once',
                    },
                    {
                        formType: 'date-range',
                        bind: 'range',
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
    },
    airLevel: {
        formType: 'order',
        label: '仓等',
        minNum: 1,
        length: 1,
        default: [['', '']],
        list: [
            {
                formType: 'select',
                event: 'select',
                options: [
                    {
                        label: '头等舱',
                        value: 'L1',
                    },
                    {
                        label: '商务舱',
                        value: 'L2',
                    },
                    {
                        label: '经济舱',
                        value: 'L3',
                    },
                ],
            },
            {
                formType: 'input-number',
                where: ({ value }) => value[0][0] !== '',
                props: {
                    width: '15px',
                    marginLeft: '10px',
                },
            },
        ],
        btns: [
            {
                formType: 'button',
                event: 'del',
                label: '删除',
                where: ({ length, value }) => length > 1 && value[0][0] !== '',
                click: ({ length }) => ({ key: 'length', val: length - 1 }),
                props: {},
            },
            {
                formType: 'button',
                event: 'add',
                label: '添加',
                where: ({ length, idx, value }) => idx + 1 === length && value[0][0] !== '',
                click: ({ length }) => ({ key: 'length', val: length + 1 }),
                props: {},
            },
        ],
    },
    isStop: {
        formType: 'order',
        label: '仓等',
        minNum: 1,
        length: 1,
        default: [['', '']],
        list: [
            {
                formType: 'select',
                options: [
                    {
                        label: '是',
                        value: 'yes',
                    },
                    {
                        label: '否',
                        value: 'no',
                    },
                ],
            },
            {
                formType: 'input',
                where: ({ value }) => value[0][0] === 'yes',
            },
        ],
    },
    local: {
        formType: 'order',
        label: '地理位置（公里）',
        minNum: 1,
        length: 1,
        default: [['', '']],
        list: [
            {
                formType: 'select',
                options: [
                    {
                        label: '距市中心',
                        value: 'center',
                    },
                    {
                        label: '距机场',
                        value: 'airport',
                    },
                    {
                        label: '距景点',
                        value: 'play',
                    },
                    {
                        label: '其它',
                        value: 'other',
                    },
                ],
            },
            {
                formType: 'input',
            },
        ],
    },
    vip: {
        formType: 'input',
        label: 'VIP需求',
        props: {
            type: 'textarea',
            placeholder: '高楼层 不需电梯不靠两端 吸烟/禁烟楼层',
            style: {
                width: '400px',
            },
            autosize: {
                minRows: 4,
                maxRows: 8,
            },
            maxlength: 200,
            'show-word-limit': true,
        },
    },
};
