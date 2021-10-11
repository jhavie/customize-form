/**
 * 将传入的服务项列表使用动态表单函数处理后返回动态表单展示模式的字符串或字符串组成的数组
 *
 * @param {Object} serviceList 服务项组成的原始数组
 * @returns {Object} 处理每个服务项返回对应的渲染数据, 其中键名为itemId生成的业务含义key
 */
import _get from 'lodash/get';
import parseItem from './parseServiceData';
import getConfig from '../../utils/getConfig';
import { jsonParse } from '../../utils/tools/';
 
export default function service2json(serviceList) {
    return (Array.isArray(serviceList) ? serviceList : [serviceList]).reduce((ans, service) => {
        let [bpKey, bpType] = service.itemId.split('_').reverse();
        if (bpKey === 'price') {
            bpKey = `${bpType}_${bpKey}`;
            bpType = '';
        }
        const data = { label: service.itemName, origin: '', keyMap: {} };
        let serData = {};
        let config = {};
        try {
            serData = parseItem(service);
            data.origin = serData.value;
            config = getConfig(serData);
            data.origin = config.default;
            if (config.btnType && config.default.length > 0) {
                data.value = config.default.map(item => config.getText(item, config));
            } else if (config.formType === 'order') {
                data.value = config.getText(config.default[0], config);
            } else {
                data.value = config.getText(config.default, config);
            }
        } catch (err) {
            data.value = config.default || serData.value || '';
            // console.log('customize-form::service2json', err);
        }
        data.bpType = bpType;
        // if (service.itemName === '配套设施') debugger;
        ['bpSubServiceItemList', 'bpSubServiceItemValueList'].forEach(key => {
            if (service[key]) {
                service[key].forEach(item => {
                    data.keyMap[item.itemId] = {
                        label: item.itemName,
                        icon: item.icon,
                    };
                });
            }
        });
        if (service.cptSource) {
            jsonParse(service.cptSource, []).forEach(item => {
                data.keyMap[item.k] = { label: item.v };
            });
        }
        const { showType } = (service.cptCfg || '').includes('showType') ? jsonParse(service.cptCfg, {}) : {};
        if (showType) data.showType = showType;
        if (ans[bpKey]) {
            const oriType = ans[bpKey].bpType;
            ans[`${oriType}_${bpKey}`] = ans[bpKey];
            delete ans[bpKey];
            ans[`${bpType}_${bpKey}`] = data;
        } else {
            ans[bpKey] = data;
        }
        return ans;
    }, {});
}

export function getValue(
    showType,
    data = {},
    config = {
        listKeys: [],
        AUDIT_STATUS_SUPPLIER: {},
        AUDIT_STATUS: {},
        TAGS_MAP: {},
    },
) {
    if (typeof config[showType] === 'function') return config[showType](data[showType]);
    // 以下为默认返回值
    try {
        switch (showType) {
            case 'name': {
                // 名称
                return data.name?.value ?? '';
            }
            case 'rate': {
                // 星级
                return data.starLevel?.origin ?? '';
            }
            case 'location': {
                // 详细信息
                const [
                    proName = '',
                    cityName = '',
                    districtName = '',
                ] = (data.addressArea?.value ?? '').replace(/ /g, '').split('/');
                const address = data.address?.value ?? '';
                let res;
                if (districtName) {
                    res = `${districtName} ${cityName}${districtName}${address.split(' ').pop()}`;
                } else {
                    res = `${cityName} ${proName}${cityName}${address.split(' ').pop()}`;
                }
                return res.trim();
            }
            case 'detail': {
                // 具体信息显示
                return (config.listKeys || []).reduce((ans, key) => {
                    if (!data[key]) return ans;
                    const item = data[key];
                    if (typeof config[key] === 'function') {
                        ans.push(config[key](item));
                    } else {
                        ans.push({ label: item.label || '', value: item.value || '' });
                    }
                    return ans;
                }, []);
            }
            case 'image':
                // 图片
                return (data.image?.value ?? []).map(item => item.url);
            case 'label':
                // 标签
                return (data.label?.value ?? '').split(',').filter(item => item);
            case 'nearby':
                // 周边
                return { label: '周边', value: data.nearby?.value ?? null };
            case 'status': {
                // 状态展示
                const audit_status = data.infos?.auditStatus ?? '';
                const goods_status = data.info?.goodsStatus ?? '';
                const list = [];
                if (audit_status) {
                    list.push({
                        class: 'audit',
                        label: _get(config, `AUDIT_STATUS_SUPPLIER.${audit_status}`) || audit_status,
                        effect: 'plain',
                        type: _get(config, `TAGS_MAP.${audit_status}`) || audit_status,
                    });
                }
                if (goods_status) {
                    list.push({
                        class: 'goods',
                        label: _get(config, `GOODS_STATUS.${goods_status}`) || goods_status,
                        effect: 'dark',
                        type: _get(config, `TAGS_MAP.${goods_status}`) || goods_status,
                    });
                }
                return list;
            }
            case 'setStage': {
                // 支持摆台
                if (!data.setting) return {};
                return {
                    label: data.setting.label,
                    value: data.setting.origin.map(([key, num]) => ({
                        ...data.setting.keyMap[key],
                        num,
                    }))
                };
            }
            case 'nearbyall': {
                // 周边景点、周边地标、周边商圈的整合
                const value = ['landMark', 'busiDistrict', 'attractions'].map(key => data[key]?.value ?? '');
                return {
                    label: '周边',
                    value: value.join(' ').trim(),
                };
            }
            case 'remark': {
                return {
                    label: '备注说明',
                    value: data.remarks?.value ?? '',
                };
            }
            case 'frequency': {
                return {
                    label: '频次单位',
                    value: data.frequency?.value ?? '',
                };
            }
            case 'introduction': {
                const introduction = data.hotelIntroduction || data.introduction || {};
                return {
                    label: introduction.label || '',
                    value: introduction.value || '',
                };
            }
            case 'desc': {
                // 商品服务描述:w
                return {
                    label: data.desc?.label ?? '',
                    value: data.desc?.value ?? '',
                };
            }
            case 'hotel':
            case 'venue':
            case 'room':
            case 'hotelDining': {
                if (data[showType]?.bpType === 'facility') {
                    const item = data[showType] || {};
                    if (!Array.isArray(item.value)) return '';
                    return {
                        label: item.label || '',
                        value: item.value.map(each => item.keyMap[each].label),
                    };
                }
                return '';
            }
            default:
                return '';
        }
    } catch (err) {
        return '';
    }
}