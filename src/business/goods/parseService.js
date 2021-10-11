import _orderBy from 'lodash/orderBy';
import _pick from 'lodash/pick';
import parseItem from './parseServiceData';

/**
 * 输入单个服务项, 返回包含动态表单配置项的对象
 *
 * @param {Object} service 单个服务项
 * @param {Object} obj 配置项
 * @param {String} key 存放服务项的键名
 * @param {Array} list 用于过滤service对象
 * @returns {Array} 包含动态表单配置项的对象
 */
function dataParse (service, { key = 'bpServiceItemList', list = ['serviceName', 'serviceId', 'bpServiceType'], callback } = {}) {
    // 处理服务项，将包括添加删除按钮的服务项放最后显示
    const btnsList = { config: [], list: [] };
    const baseList = { config: [], list: [] };
    _orderBy(service[key], ['sortNum']).forEach((item) => {
        let flag = false;
        if (item.cptType === 'priceCalendar') {
            item.unit = null;
            flag = true;
            if (['Y', 'N'].includes(service.isServicePrice)) {
                item.itemValue = service.isServicePrice === 'Y';
            } else if (Array.isArray(service.bpServicePriceCalendarList)) {
                item.itemValue = service.bpServicePriceCalendarList;
            } else {
                item.itemValue = false;
            }
        }
        const data = parseItem(item, callback);
        if (data.btnType === 'add_delete' || data.formType === 'image' ) {
            data.span = 12;
            btnsList.config.push(data);
            btnsList.list.push(item);
        } else if (data.formType === 'textarea') {
            data.span = 10;
            btnsList.config.push(data);
            btnsList.list.push(item);
        } else {
            baseList.config.push(data);
            baseList.list.push(item);
        }
        flag && (item.itemValue = null);
    });
    // 排序结果覆盖赋值
    service[key] = [...baseList.list, ...btnsList.list];
    return { ..._pick(service, list), config: [...baseList.config, ...btnsList.config] };
}

/**
 * 输入服务列表, 通过调用dataParse方法返回包含动态表单配置项对集合
 *
 * @param {Array} serviceList 服务配置项组成的集合
 * @returns {Array} 包含动态表单配置项的集合
 */
function dataParseList (serviceList, params) {
    return _orderBy(serviceList, ['sortNum']).map(item => dataParse(item, params));
}

export default {
    dataParse,
    dataParseList,
};
