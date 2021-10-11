<!--
动态表单组件
  params:
    type<String> 用于控制显示形式，edit: 编辑模式，review：显示模式
    data<Array> 动态配置信息数组，用于获取生成表单的配置信息
    formProps<Object> elementUI el-form组件配置信息
  控制函数:
    getData: 返回表单数据
    saveData: 保存当前表单输入数据
    lastData：还原上次保存的数据
    resetData：重置表单数据为初始状态
  使用：
    <cti-form
        ref="ctiForm"
        :data="data"
        type="edit"
        :formProps="{'label-width': '130px'}"
    />
-->

<template>
    <el-form :model="formData" class="customize-form" v-bind="getProps('formProps', formProps)" ref="formNode">
        <slot name="top"></slot>
        <template v-for="(item, idx) in configs">
            <div class="other-item" :style="otherStyle" v-if="item.beforeSlot">
                <slot :name="item.beforeSlot" />
            </div>
            <el-form-item
                v-if="type === 'review'"
                :key="idx"
                v-bind="getProps('formItemProps', item.itemProps)"
                :class="`customize-form-review customize-form-${item.formType}`"
                :prop="item.name || `${idx}`"
            >
                <customize-show :config="item" v-model="formData[idx]" :prop="item.name || String(idx)"/>
            </el-form-item>
            <el-form-item
                v-else
                :key="idx"
                v-bind="getProps('formItemProps', item.itemProps)"
                :prop="item.name || `${idx}`"
                class="customize-form-edit"
            >
                <customize-order
                    v-if="item.formType === 'order'"
                    v-model="formData[idx]"
                    :config="item"
                    :prop="item.name || String(idx)"
                />
                <customize-base v-else v-model="formData[idx]" :config="item" :prop="item.name || String(idx)" />
            </el-form-item>
            <div class="other-item" :style="otherStyle" v-if="item.afterSlot">
                <slot :name="item.afterSlot" />
            </div>
        </template>
        <slot name="bottom"></slot>
    </el-form>
</template>

<script>
import customizeOrder from './order';
import customizeBase from './base';
import customizeShow from './show';
import { fromConfig } from './config';
import _merge from 'lodash/merge';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import getConfig from './utils/getConfig';
import { functor } from './utils/tools';

export default {
    name: 'CustomizeForm',
    props: {
        data: {
            type: Array,
            required: true,
            default: () => [],
        },
        type: {
            // edit: 编辑模式，review：显示模式
            type: String,
            default: () => 'edit',
        },
        keyName: {
            // 控制数据键名， 默认为default表示顺序位数字， 否则根据当前key名取值
            type: String,
            default: () => 'default',
        },
        formProps: {
            type: Object,
            default: () => ({}),
        },
        isFault: {
            // 是否断层, true则开启断层, false关闭断层, 关闭后对data监听且动态计算配置, 影响性能, 默认开启
            type: Boolean,
            default: true,
        }
    },
    created() {
        // 控制是否允许校验
        this.isCanValidate = true;
        this.changeListenList = this.change2data();
        this.preFormData = _cloneDeep(this.formData);
    },
    mounted() {
        this.customizeRoot = true;
        if (!this.formProps || !this.formData) {
            console.log('customize-form::无效formProps或formData', this.formProps, this.formData, this.data);
        }
    },
    beforeCreate() {
        // 用于缓存操作数据， 不用于渲染
        this.contro = {
            // 缓存初始信息，用于重置功能
            initData: {},
            // 缓存全空数据
            spaceData: {},
            // 用户缓存指定节点的数据
            prevData: {},
        };
    },
    components: {
        customizeOrder,
        customizeBase,
        customizeShow,
    },
    provide() {
        return {
            formNode: this,
        };
    },
    methods: {
        change2data() {
            return Object.keys(this.$listeners)
                .filter(name => name.includes('change:'))
                .map(name => {
                    const keyName = name.split(':')[1];
                    const idx = this.data.findIndex(item => item.keyName === keyName);
                    return { key: keyName, name, idx };
                });
        },
        isDataUpdate() {
            // 判断数据是否有变动
            const length = this.data.length;
            /* 价格日历特殊处理
            const custom = {};
            const idx = this.data.findIndex((item) => item.formType === 'priceCalendar');
            if (idx > -1) custom[idx] = [];
            */
            const initData = Array.from({ ...this.contro.initData, length });
            const currData = Array.from({ ..._cloneDeep(this.formData), length });
            return !_isEqual(initData, currData);
        },
        getData(configs = this.configs, formData = this.formData, keyName = this.keyName) {
            // 返回表单数据
            return configs.reduce((ans, item, idx) => {
                const key = keyName === 'default' ? idx : item[keyName];
                //const key = item.keyName || idx;
                if (item.formType === 'order' && item.btns.length === 0) {
                    // order类型且无按钮返回数组第一项
                    ans[key] = formData[idx][0];
                } else {
                    ans[key] = formData[idx];
                }
                return ans;
            }, {});
        },
        getFormData(type = 'default') {
            // 返回表单渲染数据
            if (type === 'default') {
                return _cloneDeep(this.formData);
            }
            return _cloneDeep(this.contro[type]);
        },
        setData(data) {
            this.formData = data;
        },
        setDataList(dataList, data = this.getFormData) {
            // 批量设置数据值, dataList为{ key, value }的集合
            dataList.forEach(({ key, value }) => {
                this.setDataOne(key, value, data);
            });
            this.setData(data);
        },
        setDataOne(key, value, data = this.formData) {
            // 设置单个数据值, key为下标或keyName
            if (typeof key === 'number') {
                if (key >= this.configs.length) return false;
                data[key] = value;
            } else if (typeof key === 'string') {
                const index = this.configs.findIndex(item => item.keyName === key);
                if (index === -1) return false;
                this.setDataOne(index, value);
            } else {
                return false;
            }
            return data;
        },
        saveData() {
            // 保存当前数据
            this.contro.prevData = _cloneDeep(this.formData);
        },
        resetData() {
            // 重置数据
            this.formData = _cloneDeep(this.contro.spaceData);
        },
        clearData(key, bufferData = _cloneDeep(this.formData), deep = 0) {
            if (typeof key === 'number') {
                bufferData[key] = _cloneDeep(this.contro.spaceData[key]);
            } else if (typeof key === 'string') {
                const index = this.data.findIndex(item => item.keyName === key);
                if (index > -1) bufferData[index] = _cloneDeep(this.contro.spaceData[index]);
            } else if (Array.isArray(key)) {
                key.forEach(k => this.clearData(k, bufferData, deep + 1));
            }
            !deep && (this.formData = bufferData);
        },
        lastData() {
            // 恢复数据
            this.formData = _cloneDeep(this.contro.prevData);
        },
        getConfig(config) {
            // 返回对应formType的配置信息
            const setting = getConfig(config);
            return setting;
        },
        getProps(type, props = {}) {
            // 传入props与默认props合并
            return _merge({}, fromConfig[type] || {}, props || {});
        },
        validate(callback = functor) {
            // 表单验证
            this.$refs.formNode.validate(callback);
        },
        validateField(props, callback = functor) {
            // 指定项验证
            if (!this.$refs.formNode) return;
            this.$refs.formNode.validateField(props, callback);
        },
        clearValidate(props, callback = functor) {
            // 指定项情况验证, 传空则全部清空验证
            if (!this.$refs.formNode) return;
            this.$refs.formNode.clearValidate(props, callback);
        },
        setInitData(idx, data) {
            // 用于给初始值对象赋值，用于组件数据延时获取后初始值丢失问题
            if (idx === -1) {
                // 全量更新
                this.contro.initData = _cloneDeep(this.formData);
            } else {
                // 单位赋值
                this.contro.initData[idx] = _cloneDeep(data);
            }
        },
        calcConfig(data = this.data) {
            return data.reduce(
                (ans, item, idx) => {
                    const config = this.getConfig({ ...item, value: false });
                    this.contro.spaceData[idx] = _cloneDeep(config.default);
                    ans.formData[idx] = _cloneDeep(item.value || config.default);
                    this.contro.initData[idx] = _cloneDeep(ans.formData[idx]);
                    this.contro.prevData[idx] = _cloneDeep(ans.formData[idx]);
                    ans.configs.push(config);
                    return ans;
                },
                {
                    // 表单信息
                    formData: {},
                    // 根据formType生成配置信息的集合
                    configs: [],
                },
            );
        },
    },
    watch: {
        formData: {
            handler(newVal, oldVal) {
                const data = this.getData();
                if (this.$listeners.change) this.$emit('change', data);
                this.changeListenList.forEach(({ idx, key, name }) => {
                    if (!_isEqual(newVal[idx], this.preFormData[idx])) {
                        this.$emit(name, _cloneDeep(data[idx] || data[this.data[idx].keyName]));
                    }
                });
                this.preFormData = _cloneDeep(newVal);
            },
            deep: true,
        },
        data: {
            handler(newVal) {
                if (this.isFault) return;
                const { formData, configs } = this.calcConfig(newVal);
                this.formData = formData;
                this.configs = configs;
            },
            deep: true,
        },
    },
    data() {
        return this.calcConfig();
    },
    computed: {
        otherStyle() {
            const style = {};
            if (this.formProps && this.formProps['label-width']) {
                style['margin-left'] = this.formProps['label-width'];
            }
            return style;
        },
    },
};
</script>

<style lang="scss" scoped>
@import './varible.scss';
.customize-form {
    @include getflex();
    width: 100%;
    flex-wrap: wrap;
    text-align: left;
    .other-item {
        width: 100%;
        padding-bottom: 16px;
    }
    .el-form-item {
        padding: 0;
        margin-bottom: 16px;
        /deep/ .el-form-item__label {
            line-height: 30px;
            color: #747474;
            font-family: 'PingFangSC-Regular';
        }
        /deep/ .el-form-item__content {
            line-height: 30px;
            @include getflex();
            flex-wrap: wrap;
            .el-form-item__error {
                color: #ed6d4a;
                margin-top: 3px;
                padding: 0;
                line-height: 1;
                background-color: rgba(255, 255, 255, 0);
                box-shadow: none;
                &::before {
                    vertical-align: bottom;
                }
            }
        }
    }
    .customize-form-review.customize-form-checkboxAll {
        // checkboxAll的form-item特殊处理
        margin-bottom: 0px;
    }
    /deep/ .customize-form-top,
    /deep/ .customize-form-bottom {
        margin-top: 10px;
        width: 100%;
        @include getflex(center, center);
        button {
            border-width: 0;
        }
    }
    /deep/ .customize-form-right {
        margin-top: 10px;
        width: 100%;
        @include getflex(flex-end, center);
    }
    /deep/ .checkboxAll {
        /deep/ .el-checkbox {
            &__label {
                color: #383838;
                padding-left: 6px;
            }
            &__inner {
                background-color: rgba(0, 0, 0, 0);
                border-color: #cecece;
                &::after {
                    border-color: #4b8bee;
                    border-width: 1.5px;
                    box-sizing: border-box;
                    height: 9px;
                    left: 3px;
                    top: 0px;
                    width: 5px;
                }
            }
        }
        /deep/ .is-checked {
            .el-checkbox__inner {
                border-color: #4b8bee;
            }
        }
    }
    /deep/ .checkbox-all-show {
        /deep/ .el-checkbox {
            &__inner {
                background-color: rgba(0, 0, 0, 0);
                border-width: 0;
                &::after {
                    border-color: #4b8bee;
                    border-width: 1.5px;
                }
            }
            &__label {
                color: #383838;
                padding-left: 6px;
            }
        }
        /deep/ .is-disabled {
            .el-checkbox__inner {
                &::after {
                    border-color: #cecece;
                }
            }
            .el-checkbox__label {
                color: #aba9a9;
            }
        }
    }
    /deep/ .handle-btn {
        border: none;
        background-color: rgba(0, 0, 0, 0);
        color: #4b8bee;
    }
}
</style>
