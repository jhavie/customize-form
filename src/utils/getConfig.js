import _omit from 'lodash/omit';
import _isString from 'lodash/isString';
import _get from 'lodash/get';
import _isBoolean from 'lodash/isBoolean';
import _merge from 'lodash/merge';
import { base, nameMap } from '../modules/';
import defaultConfig from '../modules/defaulted';
import { getOrderDefaultProps } from '../config/index';
import { functor } from './tools/';
import getRatio from './span2ratio';
import validater from '../validater';
import getValidateMsg from '../config/validateMsg';

// 基础组件名列表
const baseNames = Object.keys(base);
// 高级组件无用键过滤
const orderOmitLists = ['default', 'getText', 'itemProps', 'tipText'];

function getValidate(formType = [], config = {}) {
    // 生成验证函数
    return (data) => {
        let ans;
        const temp = formType.some((type, idx) => {
            const configDef = config.constructor === Array ? config[idx] : config;
            const valid = base[type](configDef).validate(data[idx], idx, data);
            if (!_isBoolean(valid)) {
                ans = valid;
            }
            return valid;
        });
        return ans || temp;
    };
}

function getDefault(formType = [], config = {}) {
    // 拼接默认值
    return formType.map((type, idx) => {
        const configDef = config.constructor === Array ? config[idx] : config;
        return base[type]({ ...configDef, value: null }).default;
    });
}

function getTextFunc(formType = [], config = {}) {
    // 返回拼接展示状态值的函数
    return (data) => {
        return formType.map((type, idx) => {
            const configDef = config.constructor === Array ? config[idx] : config;
            return base[type]({
                ...configDef,
                props: _get(configDef, `props.${idx}`, configDef.props),
            }).getText(data[idx], configDef, idx);
        }).join(' ');
    };
}

function getItemProps(config = {}) {
    // 返回formItemProps
    return _merge({
        label: config.label || '',
        style: {},
    }, config.itemProps || {});
}

function getList(formType = [], config = {}) {
    // 返回子组件列表
    return formType.map((type, idx) => {
        const props = _merge(
            {},
            _get(getOrderDefaultProps(config.formType), `props.${idx}`, {}),
            _get(config, `props.${idx}`, {}),
        );
        return _omit(base[type]({ ...config, props }), orderOmitLists);
    });
}

function getBindList(bindFormType = [], { bindList, ...config } = { bindList: [] }) {
    // 返回bind类型子组件列表
    return [
        _omit(base[bindFormType[0]]({
            ...config,
            props: _merge({}, _get(getOrderDefaultProps(config.formType), 'props.0') || {}, config.props || {}),
        }), orderOmitLists),
        {
            formType: 'bind',
            bindList: bindList.map((item, idx) => {
                item.props = _merge( {}, _get(getOrderDefaultProps(config.formType), `props.${idx + 1}`) || {}, item.props || {});
                return item;
            })
        },
    ];
}

function getBtns(config = {}) {
    // 返回按钮
    if (config.btnType === 'add_delete') {
        return [
            {
                formType: 'button',
                event: 'del',
                label: '删除',
                where: ({ length }) => length > 1,
                click: ({ length }) => ({ key: 'length', val: length - 1 }),
                props: {},
            },
            {
                formType: 'button',
                event: 'add',
                label: '添加',
                where: ({ length, idx }) => idx + 1 === length,
                click: ({ length }) => ({ key: 'length', val: length + 1 }),
                props: {},
            },
        ];
    }
    if (config.btnType === 'ok') {
        return [
            {
                formType: 'button',
                event: 'ok',
                label: '确定',
                where: () => true,
                click: config.btnClick || functor,
                props: {},
            },
        ];
    }
    return [];
}

function formItemPropsHandler(config, ans) {
    // itemProps特殊处理
    if (config.span) {
        // 解析span栅格化
        const width = getRatio(config.span);
        if (width !== undefined) {
            ans.itemProps.style.width = width;
        }
    }
    if (ans.validate && config.isRequire) {
        // 表单验证函数逻辑
        // 校验次数
        ans.itemProps.rules = {
            required: true,
            trigger: [],
            validator: (rule, value) => {
                return new Promise((resolve, reject) => {
                    // 返回布尔值或{ notOk, message }
                    let valid;
                    let validate = ans.formType === 'order'
                        ? value.some(item => {
                            const temp = ans.validate(item, value);
                            if (!_isBoolean(temp)) {
                                valid = { notOk: true, message: temp };
                            }
                            return temp;
                        })
                        : ans.validate(value);
                    if (!valid && !validate && ans.formType === 'order') {
                        try {
                            valid = validater(value, config.formType.split('_'), config.props);
                        } catch (err) {
                            console.log('customize-form::error::formItemPropsHandler::validate', err);
                        }
                    }
                    if (valid) validate = valid;
                    const { notOk, message = getValidateMsg(ans) } = _isBoolean(validate)
                        ? { notOk: validate }
                        : validate;
                    if (notOk) {
                        // eslint-disable-next-line
                        reject(message);
                    } else {
                        resolve();
                    }
                });
            },
        };
    }
    return ans;
}
export default function getConfig(config = {}) {
    if (!_isString(config.formType)) return false;
    // 生成配置信息
    let ans = false;
    const typeStr = nameMap[config.formType] ? nameMap[config.formType] : config.formType;
    const formType = typeStr.split('_');
    if (formType.length === 0) {
        ans = false;
    } else if (formType.length === 1) {
        // 基础form组件
        ans = base[formType[0]] && base[formType[0]](config) || defaultConfig(config);
        if (config.btnType) {
            ans.btns = getBtns(config);
        }
    } else if (formType[0].toLocaleLowerCase() === 'bind') {
        const [, ...bindFormType] = formType;
        if (bindFormType.length === config.bindList.length && bindFormType.every(name => baseNames.includes(name))) {
            ans = {
                keyName: config.keyName,
                default: config.value || [getDefault(bindFormType, config.bindList)],
                getText: getTextFunc(bindFormType, config.bindList),
                list: getBindList(bindFormType, config),
                btns: getBtns(config),
                itemProps: getItemProps(config),
                validate: getValidate(bindFormType, config.bindList),
                formType: 'order',
                length: 1,
            };
        }
    } else if (formType.every(name => baseNames.includes(name))) {
        // 高级组件(order)
        ans = {
            tipText: config.tipText,
            keyName: config.keyName,
            default: config.value || [getDefault(formType, config)],
            getText: getTextFunc(formType, config),
            list: getList(formType, config),
            btns: getBtns(config),
            itemProps: getItemProps(config),
            validate: getValidate(formType, config),
            formType: 'order',
            length: 1,
        };
    }
    ans = ans || defaultConfig(config);
    ans.label = config.label;
    return formItemPropsHandler(config, ans);
}
