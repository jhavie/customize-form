const msgMap = {
    select: '请选择',
    input: '请输入',
    add: '请添加',
};

const selectArr = ['select', 'areaInput', 'datetime-date', 'datetime-time', 'datetime', 'checkboxAll', 'checkbox', 'checkboxButton', 'radio'];
const addArr = ['uploadImage'];

export default function getValidateMsg(config) {
    // 获取验证不通过的提示信息
    const formType = config.formType;
    // 替换label末尾的中英文冒号
    const label = config.label.replace(/(:|：$)/g, '') || '';
    let msg = msgMap.input;
    if (selectArr.includes(formType)) {
        msg = msgMap.select;
    } else if (addArr.includes(formType)) {
        msg = msgMap.add;
    }
    return `${msg}${label}`;
}