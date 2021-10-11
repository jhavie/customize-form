/**
 * 生成结果对象的映射
 *
 * @param {Array} list 服务项列表
 * @returns {Object} 返回包含键list和res的对象
 */
import { serviceList } from './config';
import { pick } from './utils';

export default function grenResultData(list) {
    return list.reduce((ans, item) => {
        ans.res[item.serviceId] = pick(item, serviceList);
        ans.res[item.serviceId].submitBpServiceItemList = [];
        ans.list[item.serviceId] = item.bpServiceItemList || [];
        return ans;
    }, { list: {}, res: {} });
}
