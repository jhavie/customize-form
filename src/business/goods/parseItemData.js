/**
 * 传入服务项与输入数据，生成对应的结果数据并返回
 *
 * @param {Array} serv 服务项
 * @param {Array} data 服务项对应的输入值
 * @returns {any} 返回结果数据
 */
import { isNotDefined, isDefined, jsonParse } from '../../utils/tools/';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';

function getDataForKey(keyRule, data) {
    return keyRule.split('_').reduce((ans, key, idx) => {
        ans[key] = data[idx];
        return ans;
    }, {});
}

function not2null(val) {
    if (
        isNotDefined(val)
        || val === ''
        || (typeof val === 'number' && window.isNaN(val))
        || (isObject(val) && Object.keys(val).length === 0)
        || (isArray(val) && (val.length === 0 || val.every(item => isNotDefined(item))))
    ) return null;
    return val;
}

export default function parseItemData(ori, data, oriList, dataList) {
    const cptCfg = jsonParse(ori.cptCfg) || {};
    const unitList = jsonParse(ori.unitList) || {};
    const resData = { itemValue: null };
    let ans = data;
    if (cptCfg.isAdd === 'Y') {
        resData.unit = unitList[0];
    } else if (ori.unitList) {
        resData.unit = data[data.length - 1];
        ans = data[0];
    } else {
        ans = data;
    }
    switch (ori.cptType) {
        case 'image':
            ans = data.map(item => item.value);
            resData.fileList = data.map(item => ({ fileUrl: item.url }));
            break;
        case 'stepNumber':
            if (ori.unitList) {
                ans = Number(data[0]);
            } else {
                ans = Number(data);
            }
            break;
        case 'input':
            if (cptCfg.type === 'number') {
                ans = data ? Number(data.constructor === Array ? data[0] : data) : data;
            } else if (cptCfg.type === 'location') {
                // 位置框返回位置字符串及位置坐标
                ans = data;
            } else if (cptCfg.type === 'search') {
                // 搜索框返回搜索字符串
                ans = data.value;
            } else if (ori.unitList) {
                ans = data.constructor === Array ? data[0] : data;
            } else {
                ans = data;
            }
            break;
        default:
            break;
    }
    if (cptCfg.keyRule) {
        if (cptCfg.isAdd === 'Y') {
            ans = data.map(item => getDataForKey(cptCfg.keyRule, item));
        } else {
            ans = getDataForKey(cptCfg.keyRule, data);
        }
    }
    ans = not2null(ans);
    if ((ans && ans.constructor !== String) || typeof ans === 'number') {
        ans = JSON.stringify(ans);
    }
    if (isDefined(data) && ori.bpSubServiceItemList && ori.bpSubServiceItemList.length > 0) {
        // 存在bpSubServiceItemList则返回bpSubServiceItemValueList
        const ansList = data.constructor !== Array ? [data] : data;
        if (ori.cptType === 'bind_select_select') {
            resData.bpSubServiceItemValueList = [{
                ...ori.bpSubServiceItemList.find(service => service.itemId === data[0]),
                itemValue: typeof data[1] === 'number' ? String(data[1]) : data[1],
            }];
        } else if (cptCfg.isAdd === 'Y') {
            // if (ori.unitList) resData.unit = [];
            resData.bpSubServiceItemValueList = data.map(item => {
                const res = {
                    ...ori.bpSubServiceItemList.find(service => service.itemId === item[0]),
                };
                if (ori.unitList) {
                    // resData.unit.push(item[item.length - 1]);
                    res.unit = item[item.length - 1];
                    resData.unit = null;
                }
                if (item.length >= 3) {
                    res.itemValue = typeof item[1] === 'number' ? String(item[1]) : item[1] || null;
                }
                return res;
            }).filter(_ => _.itemId);
        } else {
            resData.bpSubServiceItemValueList = [...ori.bpSubServiceItemList].filter(item => ansList.includes(item.itemId));
        }
    } else {
        resData.bpSubServiceItemValueList = [];
    }
    resData.itemValue = ans;
    return resData;
}
