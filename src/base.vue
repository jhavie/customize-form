<!--
  基础表单通过此组件渲染
  list: [
    input => el-input,
    date => el-date-picker(type: date),
    date-range => el-date-picker(type: daterange),
  ]
  params:
    v-model: 关联值
    config: 配置项
  使用:
    import customizeBase from './base';
    <customize-base
      v-model="formData[item.key]"
      :config="config"
    />
-->
<template>
    <fragment>
        <!--单选-->
        <el-radio-group
            :value="getValue()"
            v-if="config.formType.indexOf('radio') === 0"
            v-bind="getProps()"
            @input="emitUpdate"
        >
            <template v-if="config.formType === 'radio'">
                <el-radio v-for="(option, optIdx) in config.options" :key="optIdx" :label="getOption(option).value">
                    {{ getOption(option).label }}
                </el-radio>
            </template>
            <template v-else-if="config.formType === 'radio-button'">
                <el-radio-button
                    v-for="(option, optIdx) in config.options"
                    :key="optIdx"
                    :label="getOption(option).value"
                >
                    {{ getOption(option).label }}
                </el-radio-button>
            </template>
        </el-radio-group>
        <!--搜索框-->
        <search-input
            v-else-if="config.formType === 'searchInput'"
            :value="getValue()"
            :config="config"
            :eventType="btnAction"
            @input="emitUpdate"
        />
        <!--省市区选择框-->
        <area-input v-else-if="config.formType === 'areaInput'" :value="value" :config="config" @input="emitUpdate" />
        <!--上传按钮-->
        <upload-btn
            v-else-if="config.formType === 'uploadBtn'"
            :value="getValue()"
            :config="config"
            @input="emitUpdate"
        />
        <!--图片上传-->
        <upload-image
            v-else-if="config.formType === 'uploadImage'"
            :value="getValue()"
            :config="config"
            @input="emitUpdate"
        />
        <!--范围输入框-->
        <range-number
            v-else-if="config.formType === 'rangeNumber'"
            :value="getValue()"
            :config="config"
            @input="emitUpdate"
        />
        <!--多选框-->
        <checkbox
            v-else-if="config.formType.indexOf('checkbox') === 0"
            :value="getValue()"
            :config="config"
            :options="getOptionList(config.options)"
            @input="emitUpdate"
        />
        <el-input
            v-else-if="config.formType === 'input'"
            :value="value"
            v-bind="getProps()"
            @blur="emitBlur"
            @input="emitUpdate"
            :class="`customize-base-${config.props.type}`"
        />
        <!--选择器-->
        <el-cascader
            v-else-if="config.formType === 'cascader'"
            :value="getValue()"
            :options="getOptionList(config.options)"
            v-bind="getProps()"
            @input="emitUpdate"
        />
        <!--按钮控件-->
        <el-button round v-else-if="config.formType === 'button'" @click="eventHandle.click" v-bind="getProps()">
            {{ config.label }}
        </el-button>
        <!--单选下拉框-->
        <el-select
            v-else-if="config.formType === 'select'"
            :value="getValue('getSelectValue', '')"
            @input="emitUpdate"
            v-bind="getProps()"
        >
            <el-option
                v-for="(option, optIdx) in config.options"
                :key="optIdx"
                v-bind="getProps(getOption(option), 'none')"
            />
        </el-select>
        <!--可输入的下拉选择-->
        <input-select
            v-else-if="config.formType === 'inputSelect'"
            :value="getValue()"
            @input="emitUpdate"
            :config="config"
            :options="config.options"
        >
        </input-select>
        <!--城市选择-->
        <int-city-input
            v-else-if="config.formType === 'city-input-remark'"
            :value="getValue()"
            @input="emitUpdate"
            :config="config"
            :options="config.options"
        >
        </int-city-input>
        <!--单日日期选择-->
        <el-date-picker
            v-else-if="config.formType === 'date'"
            :value="getValue('datetime', 'date')"
            type="date"
            v-bind="getProps()"
            @input="(value) => emitUpdate(value, 'datetime', 'date')"
        />
        <!--单时间选择-->
        <el-time-picker
            v-else-if="config.formType === 'time'"
            :value="getValue('datetime', 'time')"
            v-bind="getProps()"
            @input="(value) => emitUpdate(value, 'datetime', 'time')"
        />
        <!--范围时间选择-->
        <el-time-picker
            v-else-if="config.formType === 'time-range'"
            :value="getValue('datetime', 'time')"
            v-bind="getProps()"
            @input="(value) => emitUpdate(value, 'datetime', 'time')"
        />
        <!--多日日期选择-->
        <el-date-picker
            v-else-if="config.formType === 'date-range'"
            :value="getValue('datetime', 'date')"
            type="daterange"
            v-bind="getProps()"
            @input="(value) => emitUpdate(value, 'datetime', 'date')"
        />
        <!--多日日期时间选择-->
        <el-time-picker
            v-else-if="config.formType === 'datetime-time'"
            :value="getValue('datetime', config.props.type)"
            v-bind="getProps()"
            @input="(value) => emitUpdate(value, 'datetime', config.props.type)"
        />
        <!--日期时间选择-->
        <el-date-picker
            v-else-if="config.formType === 'datetime-date'"
            :value="getValue('datetime', config.props.type)"
            v-bind="getProps()"
            @input="(value) => emitUpdate(value, 'datetime', config.props.type)"
        />
        <!--价格日历选择-->
        <price-calendar
            v-else-if="config.formType === 'price-date'"
            :value="getValue()"
            v-bind="getProps()"
            v-on="config.props.on || {}"
            @input="(value) => emitUpdate(value)"
        />
        <!--价格日历选择-->
        <cti-price-calendar
            v-else-if="config.formType === 'price-calendar'"
            :value="getValue()"
            :config="config"
            @input="(value) => emitUpdate(value)"
        />
        <!--直接调用elementUI组件-->
        <element-comp
            v-else-if="config.formType !== 'order'"
            @input="emitUpdate"
            :compName="config.formType"
            :compProps="{ ...getProps(), value: getValue() }"
        />
        <cti-tip
            v-if="config.tipText && config.formType !== 'order'"
            :value="getValue()"
            :config="config"
        />
        <template v-if="config.btns && config.btns.constructor === Array">
            <template v-for="(btn, btnIdx) in config.btns">
                <el-button
                    round
                    v-if="btn.where({ ...config, idx: currentIdx, value })"
                    :key="btn.label"
                    @click="() => btnClickHandle(btn)"
                    v-bind="getProps(btn.props, 'button')"
                    class="handle-btn"
                >
                    {{ btn.label }}
                </el-button>
            </template>
        </template>
    </fragment>
</template>

<script>
import defaultConfig from './config';
import rangeNumber from './comps/rangeNumber';
import uploadImage from './comps/uploadImage';
import uploadBtn from './comps/uploadBtn';
import checkbox from './comps/checkbox';
import searchInput from './comps/searchInput';
import ctiTip from './comps/tip';
import areaInput from './comps/areaInput';
import inputSelect from './comps/inputSelect';
import ctiPriceCalendar from './comps/ctiPriceCalendar';
import intCityInput from './comps/intCityInput';
import elementComp from './element';
import _merge from 'lodash/merge';
import _cloneDeep from 'lodash/cloneDeep';
import { dataParserFront, dataParserBack } from './utils/dataParser';
import { isFunction, isDefined, isNotDefined } from './utils/tools/index';
import _get from 'lodash/get';

export default {
    name: 'customizeBase',
    components: {
        intCityInput,
        ctiTip,
        rangeNumber,
        uploadImage,
        uploadBtn,
        checkbox,
        elementComp,
        searchInput,
        areaInput,
        inputSelect,
        ctiPriceCalendar,
    },
    props: {
        value: [String, Date, Number, Boolean, Object, Array],
        config: {
            type: Object,
            default: {},
            required: true,
        },
        eventHandle: {
            type: Object,
            default: () => ({
                click: (_) => _,
            }),
        },
        currentIdx: {
            type: Number,
            default: () => 0,
        },
        prop: {
            type: String,
            required: true,
        },
    },
    created() {
        this.isUpdated = false;
    },
    mounted() {
        this.isUpdated = true;
    },
    inject: ['formNode'],
    renderError(h, err) {
        console.error('customize-form::base::', this.prop, err);
    },
    methods: {
        btnClickHandle(btn) {
            // 按钮点击事件
            if (this.config.formType === 'order') {
                // 联级组件
                this.eventHandle.click(btn.click(this.config), this.currentIdx, btn.event);
            } else {
                // 普通组件修改动作号
                btn.click((action) => {
                    this.btnAction = action;
                });
            }
        },
        emitUpdate(val, type, param) {
            if (!this.isUpdated) return;
            // 数据更新处理及数据冒泡
            let ans = dataParserBack(val, { type, param, config: this.config });
            if (isFunction(this.config.dataParserBack)) {
                ans = this.config.dataParserBack(val, ans, this.config.props);
            }
            const func = _get(this.config, 'props.on.change');
            if (func && func.constructor === Function) func(val);
            console.log('customize::base::update', JSON.stringify(ans || '', null, 4));
            this.$emit('input', ans);
            this.formNode.clearValidate([this.prop]);
            // this.formNode.isCanValidate && this.$nextTick(() => this.formNode.validateField([this.prop]));
        },
        emitBlur(e) {
            if (!this.value) return;
            // 数据更新处理及数据冒泡
            this.formNode.clearValidate([this.prop]);
            const func = _get(this.config, 'props.on.blur');
            if (func && func.constructor === Function) func(this.value);
            // this.formNode.isCanValidate && this.$nextTick(() => this.formNode.validateField([this.prop]));
        },
        getValue(type, param) {
            // 执行数据正向解析
            let ans = dataParserFront(_cloneDeep(this.value), { type, param, config: this.config });
            if (isFunction(this.config.dataParserFront)) {
                ans = this.config.dataParserFront(_cloneDeep(this.value), ans, this.config.props);
            }
            return ans;
        },
        getOption(opt) {
            if (opt.constructor === String) {
                return {
                    value: opt,
                    label: opt,
                };
            } else if (opt.constructor === Object) {
                if (isDefined(opt.value) && isNotDefined(opt.label)) {
                    opt.label = opt.value;
                } else if (isNotDefined(opt.value)) {
                    throw new Error('option配置项必须包含value');
                }
                return opt;
            }
            throw new Error('传入option配置项无效');
        },
        getOptionList(options) {
            return options.map((option) => this.getOption(option));
        },
        getProps(props = this.config.props, formType = this.config.formType) {
            // 传入props与默认props合并
            return _merge({}, defaultConfig[formType] || {}, props || {});
        },
    },
    data() {
        return {
            btnAction: '',
        };
    },
};
</script>

<style lang="scss" scoped>
.customize-base-textarea {
    width: calc(100% - 24px) !important;
}
</style>
