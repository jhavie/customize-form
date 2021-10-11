<template>
    <fragment>
        <div v-for="idx in Array.from(new Array(getLength).keys())" :key="idx" class="customize-form-order">
            <template v-for="(item, subIdx) in config.list">
                <template v-if="item.formType === 'bind'">
                    <template v-for="(bindItem, bindIdx) in item.bindList">
                        <customize-base
                            v-if="bindItem.bind === value[idx][0]"
                            v-model="value[idx][subIdx]"
                            :key="`bind${bindIdx}`"
                            :config="bindItem"
                            :prop="prop"
                        />
                    </template>
                </template>
                <template v-else>
                    <customize-base
                        v-model="value[idx][subIdx]"
                        :key="subIdx"
                        :config="getConfig(item)"
                        v-if="item.where ? item.where({ value, idx, subIdx }) : true"
                        :prop="prop"
                    />
                </template>
            </template>
            <template v-if="config.btns">
                <customize-base
                    :config="{ ...config, length: getLength }"
                    :value="value"
                    :currentIdx="idx"
                    :eventHandle="{ click: btnClickHandler }"
                    :prop="prop"
                />
            </template>
        </div>
        <cti-tip v-if="config.tipText" :config="config" />
    </fragment>
</template>

<script>
import customizeBase from './base';
import _cloneDeep from 'lodash/cloneDeep';
import ctiTip from './comps/tip';

export default {
    name: 'customizeOrder',
    props: {
        config: {
            type: Object,
            required: true,
            default: {},
        },
        value: {
            type: Array,
            default: [],
            required: true,
        },
        prop: {
            type: String,
            required: true,
        },
    },
    components: {
        customizeBase,
        ctiTip,
    },
    inject: ['formNode'],
    methods: {
        getConfig(config) {
            if (!config) {
                return new Error('传入无效配置项!');
            } else if (config.constructor === String) {
                return {
                    formType: config,
                };
            } else if (config.constructor !== Object) {
                return new Error('配置项必须为数组!');
            }
            return config;
        },
        btnClickHandler({ key, val }, idx, event) {
            this.config[key] = val;
            if (event === 'add' && this.value.length < val) {
                // 添加按钮点击
                this.value.push([...this.defaultValue]);
            } else if (event === 'del') {
                // 删除按钮点击
                this.$nextTick(() => this.formNode.validateField([this.prop]));
                this.value.splice(idx, 1);
            }
        },
    },
    computed: {
        getLength() {
            if (this.value.constructor === Array) {
                return this.value.length;
            }
            return 1;
        },
    },
    data() {
        return {
            defaultValue: _cloneDeep(this.config.default[0]),
        };
    },
};
</script>

<style lang="scss" scoped>
.customize-form-order {
    /deep/ > div {
        vertical-align: bottom;
    }
}
</style>