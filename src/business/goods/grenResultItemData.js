/**
 * 传入服务项列表与输入数据列表， 生成对应的结果数据并返回
 *
 * @param {Array} servList 服务项列表
 * @param {Array} dataList 服务项列表对应的输入值
 * @returns {Array} 返回结果数据的集合
 */
import { serviceItemList } from './config';
import { pick } from './utils';
import parseItemData from './parseItemData';

export default function grenResultItemData(servList, dataList) {
    return servList.map((item, idx) => {
        const data = {
            ...pick(item, serviceItemList),
            ...parseItemData(servList[idx], dataList[idx]),
        };
        return data;
    });
}
