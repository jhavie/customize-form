import input from './input';
import stepNumber from './stepNumber';
import select from './select';
import inputSelect from './inputSelect';
import date from './date';
import cascader from './cascader';
import image from './image';
import multiSelect from './multiSelect';
import rangeDate from './rangeDate';
import time from './time';
import rangeTime from './rangeTime';
import bindSelectDate from './bindSelectDate';
import priceDate from './priceDate';
import rangePriceDate from './rangePriceDate';
import checkbox from './checkbox';
import checkboxAll from './checkboxAll';
import checkboxButton from './checkboxButton';
import textarea from './textarea';
import defaulted from './defaulted';
import searchInput from './searchInput';
import unit from './unit';
import rangeNumber from './rangeNumber';
import datetime from './datetime';
import rangeDatetime from './rangeDatetime';
import cityInput from './cityInput';
import priceCalendar from './priceCalendar';
import uploadBtn from './uploadBtn';

export const base = {
    input,
    stepNumber,
    select,
    inputSelect,
    date,
    cascader,
    image,
    rangeDate,
    multiSelect,
    time,
    rangeTime,
    priceDate,
    rangePriceDate,
    checkbox,
    checkboxAll,
    checkboxButton,
    textarea,
    searchInput,
    unit,
    rangeNumber,
    datetime,
    rangeDatetime,
    cityInput,
    priceCalendar,
    uploadBtn,
};

export const nameMap = {
    stepNumberUnit: 'stepNumber_unit',
    rangeNumberUnit: 'rangeNumber_unit',
    inputUnit: 'input_unit',
    selectStepNumberUnit: 'select_stepNumber_unit',
    rangeDateInputUnit: 'rangeDate_input_unit',
    bindSelectDate: 'bind_select_date',
};

export const bind = {
    bindSelectDate,
};

export default {
    ...base,
    ...bind,
    defaulted,
};
