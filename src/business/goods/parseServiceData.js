/**
 * 将传入对服务项处理后生成动态表单可识别对配置项
 *
 * @param {Object} config 单个服务配置项
 * @returns {Object} 动态表单可识别对配置项
 */
import dayjs from 'dayjs';
import { formatMoney, accDiv } from 'Utils';
import _set from 'lodash/set';
import name2url from './name2url';
import { nameMap as datetimeNameMap } from '../../config/datetime';
import setData from '../../utils/setValue';
import { functor, jsonParse } from '../../utils/tools/';
import apiCommon from 'Api/common/';

function parseVal(config, ans, cptCfg) {
    if (cptCfg.type === 'year' && config.itemValue) {
        // 处理后端年数据为YYYY-MM-dd问题
        config.itemValue = config.itemValue.slice(0, 4);
    }
    // 解析数据值
    if (!config || !config.itemValue) return;
    // if (config.itemName === '税率') debugger;
    if (config.cptType === 'stepNumber') {
        config.itemValue = config.itemValue && Number(config.itemValue);
    }
    if (config.cptType === 'priceCalendar' && Array.isArray(config.itemValue)) {
        ans.value = config.itemValue.map(({
            calendar: date,
            targetPrice: price,
        }) => ({
            date: dayjs(new Date(date)).format('YYYY-MM-DD'),
            price: accDiv(price, 100),
            // price: price / 100,
        }));
    } else if (config.cptType === 'stepNumber' && !config.unit) {
        ans.value = config.itemValue;
    } else if (config.cptType === 'image' && config.fileList) {
        ans.value = config.fileList.map(file => ({ url: file.fileUrl, value: file.fileId }));
    } else if (config.cptType === 'input' && cptCfg.type === 'search') {
        ans.value = { value: config.itemValue };
    } else {
        try {
            if (config.itemValue.constructor === String && ['[', '{'].includes(config.itemValue[0])) {
                ans.value = jsonParse(config.itemValue);
            } else {
                ans.value = config.itemValue;
            }
            if (cptCfg.keyRule) {
                ans.value = ans.value.map(item => cptCfg.keyRule.split('_').map(key => item[key]));
            } else {
                const unit = jsonParse(config.unit, config.unit);
                if (unit && unit.constructor === Array) {
                    console.log('customize-form::parseServiceData:: 预留处理unit值为数组');
                } else if (unit) {
                    ans.value = [[ans.value, unit]];
                }
            }
        } catch (err) {
            ans.value = config.itemValue;
        }
    }
}

export default function parseServiceData(config, callback = functor) {
    // 配置根信息
    const obj = {
        formType: config.cptType,
        label: config.itemName,
        itemProps: {},
        props: {},
        keyName: config.itemId,
    };
    if (config.itemId === 'bp_auxiliary_hotelIntroduction') {
        // 酒店简介删除label, 为特殊处理项，需注意
        obj.itemProps.label = '';
    }
    if (config.itemId === 'bp_good_name') {
        // 失焦验证该名称是否已存在
        obj.props.on = {
            blur: (value) => callback({ type: 'blur', config }, value)
        };
    }
    if (config.isRequired === 'Y') {
        // 必选项处理
        obj.isRequire = true;
    }
    try {
        const cptCfg = config.cptCfg && config.cptCfg.constructor === Object ? config.cptCfg : jsonParse(config.cptCfg);
        parseVal(config, obj, cptCfg || {});
        callback({ type: 'setGlobal', config });
        // 服务端返回类型， 根据类型修改配置信息
        switch (config.cptType) {
            case 'checkboxAll':
                if (obj.value) {
                    // 后端返回数据转为字符串
                    obj.value = obj.value.map(val => String(val));
                }
                obj.options = jsonParse(config.cptSource, []).map(({ k, v }) => ({ label: v, value: k }));
                break;
            case 'textarea':
                setData(obj, 'text', { value: config.itemName });
                break;
            case 'rangeNumber':
                setData(obj, 'rangeNumber');
                break;
            case 'image':
                obj.limit = 10;
                break;
            case 'stepNumber':
            case 'rangeTime':
                break;
            case 'input':
                if (!cptCfg) {
                    setData(obj, 'text');
                } else if (cptCfg.type === 'search') {
                    obj.formType = 'searchInput';
                    obj.remoteOptions = async (text) => {
                        const res = await apiCommon.getDataByUrl(name2url[cptCfg.name], { pageSize: 10, hotelName: text });
                        if (res.resultCode !== '1000') return []; 
                        return res.data.hotelInfoList.map(item => ({ value: item.hotelId, label: item.hotelName })).slice(0, 8);
                    };
                    obj.valueKey = 'label';
                    obj.props.on = {
                        click: (...params) => callback({ type: 'search', config }, ...params),
                        blur: (...params) => callback({ type: 'blur', config }, ...params)
                    };
                } else if (cptCfg.type === 'number') {
                    obj.formType = 'stepNumber';
                    obj.props['controls-position'] = 'right';
                    obj.props.controls = false;
                    setData(obj, 'text', { value: '30' });
                } else if (cptCfg.type === 'area') {
                    obj.formType = 'cityInput';
                } else if (cptCfg.type === 'location') {
                    obj.formType = 'searchInput';
                    obj.delayTime = 2;
                    obj.bindKey = 'bp_basic_hotel_addressArea';
                    obj.searchType = cptCfg.type;
                    // obj.props.on = { getIdx: (...params) => callback({ type: 'location', config }, ...params) };
                    // obj.btnType = 'ok';
                    // obj.btnClick = (func) => func(cptCfg.type + new Date().getTime());
                } else {
                    setData(obj, 'text');
                }
                break;
            case 'multiSelect':
                obj.options = jsonParse(config.cptSource, []).map(({ k, v }) => ({ label: v, value: k }));
                setData(obj, '', { value: obj.options.map(item => item.value) });
                break;
            case 'select_stepNumber':
            case 'select':
                obj.options = [];
                if (config.cptSource) {
                    obj.options = jsonParse(config.cptSource, []).map(({ k, v }) => ({ label: v, value: k }));
                } else if (config.bpSubServiceItemList) {
                    obj.options = config.bpSubServiceItemList.map(item => ({
                        label: item.itemName,
                        value: item.itemId,
                    }));
                }
                setData(obj, 'text', { value: obj.options[0].value });
                break;
            case 'datetime':
                obj.formType = 'datetime';
                obj.props.type = cptCfg ? datetimeNameMap[cptCfg.type] || cptCfg.type : 'date';
                setData(obj, 'date', { type: cptCfg && cptCfg.type || 'date' });
                break;
            case 'rangeDatetime':
                obj.formType = 'rangeDatetime';
                obj.props.type = cptCfg ? datetimeNameMap[cptCfg.type] || cptCfg.type : 'daterange';
                setData(obj, 'rangeDate', { type: cptCfg && cptCfg.type || 'date' });
                break;
            case 'rangeDate_input':
                break;
            case 'bind_select_select':
                obj.bindList = [];
                obj.options = [];
                config.bpSubServiceItemList.forEach(item => {
                    obj.bindList.push({ ...parseServiceData(item), bind: item.itemId });
                    obj.options.push({
                        label: item.itemName,
                        value: item.itemId,
                    });
                });
                break;
            case 'inputSelect':
                obj.options = [];
                if (config.cptSource) {
                    obj.options = jsonParse(config.cptSource, []).map(({ k, v }) => ({ label: v, value: k }));
                }
                setData(obj, 'text', { value: obj.options[0].value });
                break;
            case 'rangeDate_stepNumber_unit':
                _set(cptCfg, 'props.1.parseData', (data) => formatMoney(String(data), 2, ''));
                break;
            case 'priceCalendar':
                obj.props.id = config.goodsServiceId;
                obj.props.syncConfig = (...params) => callback({ type: 'endDate', config }, ...params);
                break;
            default:
                break;
        }
        if (config.unitList) {
            // 带单位处理
            if (!config.cptType.includes('unit')) {
                obj.formType += '_unit';
            }
            obj.units = jsonParse(config.unitList, []).map(item => ({ label: item, value: item }));
        } else if (config.unit && config.unit !== '') {
            obj.formType += '_unit';
            obj.units = [config.unit];
        }
        if (config.itemRejectReason) {
            // 存在退回原因处理
            obj.tipText = config.itemRejectReason;
        }
        if (cptCfg && cptCfg.isAdd === 'Y') {
            // 含添加按钮处理
            obj.btnType = 'add_delete';
        }
        if (cptCfg && cptCfg.showType) {
            // 增加显示形态处理
            obj.showType = cptCfg.showType;
        }
        if (cptCfg && cptCfg.width) {
            // 控制单个item宽度
            obj.span = cptCfg.width;
        }
        const formTypeList = obj.formType.split('_');
        if (cptCfg && cptCfg.props) {
            // 存在cptCfg.props则赋值并保持基础组件与props数组数量一致
            obj.props = { ...obj.props, ...cptCfg.props };
            if (formTypeList.length > 1 && cptCfg.props.constructor === Object) {
                obj.props = [obj.props];
            } else if (formTypeList.length > 1 && cptCfg.props.constructor === Array) {
                obj.props = cptCfg.props;
            }
            if (formTypeList.length > 1 && obj.props.length < formTypeList.length) {
                (new Array(formTypeList.length - obj.props.length)).fill('').forEach(key => obj.props.push({}));
            }
        } else if (formTypeList.length > 1 && obj.props.constructor === Object) {
            // 否则高级组件全部赋空对象， 数量与基础组件数量保持一致
            obj.props = [{ ...obj.props }, ...formTypeList.slice(0, formTypeList.length - 1).map(key => ({}))];
        }
        if (config.itemId === 'bp_useDate') {
            // 适用日期特殊处理
            const typeIdx = formTypeList.findIndex(key => key === 'rangeDate');
            if (typeIdx > -1) {
                // 适用日期增加验证
                obj.props[typeIdx].validateList = ['ONLY_DATE'];
            }
        }
    } catch (err) {
        // console.log('customize-form::error::parseServiceData', config, err);
    }
    return obj;
}
