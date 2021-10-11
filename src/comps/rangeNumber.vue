
<template>
    <div class="cti-range-number" :style="configProps.style" :times="times">
        <el-input-number
            :value="value[0]"
            @input="(val) => emitUpdate(val, 0)"
            @blur="times -= 1"
            @focus="times += 1"
            v-bind="configProps"
            :style="{ width: '100%' }"
            :class="{ focus: times }"
        />
        <span class="div">~</span>
        <el-input-number
            @blur="times -= 1"
            @focus="times += 1"
            :value="value[1]"
            @input="(val) => emitUpdate(val, 1)"
            v-bind="configProps"
            :style="{ width: '100%' }"
            :class="{ focus: times }"
        />
    </div>
</template>

<script>
import defaultConfig from '../config';
import _merge from 'lodash/merge';

export default {
    name: 'rangeNumber',
    props: {
        value: {
            type: Array,
            default: () => [],
        },
        config: {
            type: Object,
            default: () => ({}),
        },
    },
    methods: {
        emitUpdate(val, idx) {
            const ans = [...this.value];
            ans[idx] = val;
            this.$emit('input', ans);
        },
        getProps() {
            return this.configProps.style;
        },
        getItemProps() {},
    },
    created() {
        this.configProps = _merge({}, defaultConfig[this.config.formType] || {}, this.config.props || {});
    },
    data() {
        return {
            times: 0,
        };
    },
};
</script>

<style lang="scss" scoped>
.cti-range-number {
    display: inline-flex;
    align-items: center;
    background: #ffffff;
    border-radius: 4px;
    color: #747474;
    font-size: 12px;
    line-height: 26px;
    position: relative;
    .div {
        position: absolute;
        left: 50%;
        font-size: 18px;
        top: 50%;
        z-index: 1;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0);
    }
    .focus {
        /deep/ .el-input__inner {
            border-color: #4b8bee;
        }
    }
    /deep/ .el-input-number {
        /deep/ .el-input {
            .el-input__inner {
                padding: 0 6px;
                border-radius: 4px;
            }
        }
    }
    /deep/ .el-input-number:first-child {
        .el-input__inner {
            border-right: none;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
        }
    }
    /deep/ .el-input-number:last-child {
        .el-input__inner {
            border-left: none;
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
        }
    }
}
</style>
