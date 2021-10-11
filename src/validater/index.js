import _isBoolean from 'lodash/isBoolean';
import onlyDateHandle from './onlyDateHandle';

/**
 * 表单验证模块校验函数
 *
 * @param {string} validateType 校验类型
 * @param {array} dataList 数据的集合
 * @returns {object|boolean} 返回boolean为true表示校验失败, 为true表示校验成功, 返回object则表示校验失败， 并包含提示信息
 */
function validateFunc(validateType, dataList) {
    switch (validateType) {
        case 'ONLY_DATE':
            // 日期保证唯一校验
            return onlyDateHandle(dataList);
        default:
            console.log('customize-form::error::validateFunc', validateType);
    }
    return false;
}

/**
 * 表单验证模块校验入口
 *
 * @param {array} dataList 数据的集合
 * @param {array} formTypeList formType的集合
 * @param {array} configList 配置信息的集合
 * @returns {object|boolean} 返回boolean为true表示校验失败, 为true表示校验成功, 返回object则表示校验失败， 并包含提示信息
 */
export default function validate(dataList, formTypeList, configList) {
    // 当formTypeList和configList数量对不上时, 或者dataList为空时直接返回false
    if (formTypeList.length !== configList.length || !dataList) return false;
    let ans;
    const temp = formTypeList.some((formType, idx) => {
        const { validateList } = configList[idx];
        if (validateList && validateList.length > 0) {
            return validateList.some(validateType => {
                const valid = validateFunc(validateType, dataList.map(item => item[idx]));
                if (!_isBoolean(valid)) {
                    ans = valid;
                    return true;
                }
                return valid;
            });
        }
        return false;
    });
    return ans || temp;
}