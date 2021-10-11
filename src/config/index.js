// 组件默认配置
import storage from '../utils/storage';
import orderProps from './orderProps';

export default {
    date: {
        placeholder: '选择日期',
        size: 'mini',
        style: {
            width: '240px',
        },
    },
    checkbox: {
        getText: (data) => data.join('、'),
        style: {
            width: '100%',
        },
    },
    checkboxAll: {
        getText: (data) => data.join('、'),
        size: 'mini',
        style: {
            width: '100%',
        },
    },
    checkboxButton: {
        getText: (data) => data.join('、'),
        size: 'mini',
        style: {
            width: '100%',
        },
    },
    time: {
        placeholder: '选择时间',
        size: 'mini',
        style: {
            width: '240px',
        },
    },
    'time-range': {
        size: 'mini',
        'range-separator': '-',
        'start-placeholder': '开始时间',
        'end-placeholder': '结束时间',
        placeholder: '选择时间范围',
        'is-range': true,
        style: {
            width: '240px',
        },
    },
    'date-range': {
        size: 'mini',
        'start-placeholder': '开始日期',
        'end-placeholder': '结束日期',
        'range-separator': '-',
        style: {
            width: '240px',
        },
    },
    input: {
        size: 'mini',
        placeholder: '请输入',
        style: {
            width: '240px',
        },
    },
    select: {
        size: 'mini',
        style: {
            width: '240px',
        },
    },
    multiSelect: {
        size: 'mini',
        style: {
            width: '240px',
        },
    },
    button: {
        size: 'mini',
    },
    'input-number': {
        size: 'mini',
        style: {
            width: '240px',
        },
    },
    'price-date': {
        style: {
            width: '100%',
            minWidth: '300px',
        },
    },
    searchInput: {
        style: {
            width: '240px',
        },
        size: 'mini',
    },
    rangeNumber: {
        size: 'mini',
        type: 'number',
        style: {
            width: '240px',
        },
    },
    'datetime-time': {
        type: 'time',
        'range-separator': '-',
        'start-placeholder': '开始时间',
        'end-placeholder': '结束时间',
        size: 'mini',
        style: {
            width: '240px',
        },
    },
    'datetime-date': {
        type: 'date',
        size: 'mini',
        'range-separator': '-',
        'start-placeholder': '开始',
        'end-placeholder': '结束',
        style: {
            width: '240px',
        },
    },
    'radio-button': {
        size: 'mini'
    },
    areaInput: {
        size: 'mini',
        style: {
            width: '240px',
        },
    },
    inputSelect: {
        size: 'mini',
        style: {
            width: '240px',
        },
    },
    textarea: {
        style: {
            width: '100%',
        },
    },
    'price-calendar': {
        size: 'mini',
        type: 'text',
        icon: 'el-icon-date',
        round: false,
        plain: false,
    },
};

// form默认配置
export const fromConfig = {
    formProps: {
        'label-width': '160px',
    },
    formItemProps: {
        style: {
            width: '50%',
        },
    },
};

// 配置项结构配置
export const formStructure = {
    itemProps: {
        style: {
        }
    }
};

export const controller = {
    autoFill: storage.getItem('customize-form::autoFill', 'N'),
};

function getPropsWidth(list = []) {
    return list.map(width => ({ style: { width } }));
}

export const getOrderDefaultProps = function getOrderDefaultProps(formType) {
    const formTypeList = formType.split('_');
    if (orderProps[formType]) {
        return orderProps[formType];
    } else if (formTypeList.length === 2 && formTypeList[1] === 'unit') {
        return { props: getPropsWidth(['150px', '90px']) };
    }
    return {};
};
