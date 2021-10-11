
<template>
    <div class="checkbox">
        <el-checkbox
            v-if="config.formType === 'checkboxAll'"
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            class="select-all"
        >
            {{ config.label }}
        </el-checkbox>
        <el-checkbox-group
            :value="value"
            @input="emitUpdate"
            :class="config.formType"
            v-bind="getProps(config.props, config.formType)"
        >
            <template v-if="config.formType === 'checkboxButton'">
                <el-checkbox-button v-for="(option, optIdx) in options" :key="optIdx" :label="option.value">
                    {{ option.label }}
                </el-checkbox-button>
            </template>
            <template v-else>
                <el-checkbox v-for="(option, optIdx) in options" :key="optIdx" :label="option.value">
                    {{ option.label }}
                </el-checkbox>
            </template>
        </el-checkbox-group>
    </div>
</template>

<script>
import defaultConfig from '../config';
import _merge from 'lodash/merge';

export default {
    name: 'checkbox',
    props: {
        value: {
            type: Array,
            default: () => [],
        },
        config: {
            type: Object,
            default: () => ({}),
        },
        options: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        value(val) {
            const isIndeter = val.length === 0 ? false : !(this.config.options.length === val.length);
            const checkAll = this.config.options.length === val.length;
            if (isIndeter !== this.isIndeterminate) this.isIndeterminate = isIndeter;
            if (checkAll !== this.checkAll) this.checkAll = checkAll;
        },
    },
    methods: {
        emitUpdate(val) {
            this.$emit('input', val);
        },
        handleCheckAllChange(val) {
            // 全选按钮点击事件
            this.$emit('input', val ? this.config.options.map((item) => item.value) : []);
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            const checkedCount = value.length;
            this.checkAll = checkedCount === this.config.options.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.config.options.length;
        },
        getProps(props = this.config.props, formType = this.config.formType) {
            // 传入props与默认props合并
            return _merge({}, defaultConfig[formType] || {}, props || {});
        },
    },
    computed: {},
    data() {
        return {
            isIndeterminate: this.value.length === 0 ? false : !(this.config.options.length === this.value.length),
            checkAll: this.config.options.length === this.value.length,
        };
    },
};
</script>

<style lang="scss" scoped>
@import '../varible.scss';
.checkbox {
    flex: 1;
    .select-all {
        /deep/ .el-checkbox__label {
            font-size: 14px;
        }
        /deep/ .el-checkbox__inner {
            width: 14px;
            height: 14px;
        }
    }
    .checkboxAll {
        line-height: 1.5;
        margin-left: 10px;
        /deep/ .el-checkbox {
            @include checkbox();
        }
    }
}
</style>