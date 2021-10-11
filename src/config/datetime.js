import { isDate } from '../utils/tools/';

const configs = {
    year: {
        format: 'YYYY',
        placeholder: '选择年份',
        getVal: val => (isDate(val) || val === null ? val : `${val.slice(0, 4)}-08-19`),
    },
    date: {
        format: 'YYYY-MM-DD',
        placeholder: '选择日期',
        getVal: val => val,
    },
    daterange: {
        format: 'YYYY-MM-DD',
        placeholder: '选择日期范围',
        getVal: val => val,
    },
    month: {
        format: 'YYYY-MM',
        placeholder: '选择月份',
        getVal: val => (isDate(val) || val === null ? val : `${val.slice(0, 7)}-19`),
    },
    monthrange: {
        format: 'YYYY-MM',
        placeholder: '选择月份范围',
        getVal: val => (isDate(val) || val === null ? val : `${val.slice(0, 7)}-19`),
    },
    datetime: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '选择日期时间',
        getVal: val => val,
    },
    datetimerange: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '选择日期时间范围',
        getVal: val => val,
    },
    time: {
        format: 'HH:mm:ss',
        placeholder: '选择时间',
        getVal: val => (isDate(val) || val === null ? val : `2020-08-19 ${val}`),
    },
    timerange: {
        format: 'HH:mm:ss',
        placeholder: '选择时间范围',
        getVal: val => (isDate(val) || val === null ? val : `2020-08-19 ${val}`),
    },
};

export function datetimeConfig(type) {
    if (!configs[type]) {
        console.log('customize-form::datetime:无效的type类型', type);
        return configs.datetime;
    }
    return configs[type];
}

export const nameMap = {
    rangeDate: 'daterange',
    rangeMonth: 'monthrange',
    rangeDatetime: 'datetimerange',
    rangeTime: 'timerange',
};