
<template>
    <order-price-calendar-dialog
        v-bind="getProps()"
        class="opc-dialog-box"
        @input="change"
        @init="init"
    />
</template>

<script>
import _merge from 'lodash/merge';
import defaultConfig from '../config';

export default {
    name: 'ctiPriceCalendar',
    props: {
        value: {
            type: [Array, Boolean],
            default: () => [],
        },
        config: {
            type: Object,
            default: () => ({}),
        },
        text: {
            type: String,
            default: '价格录入'
        },
        isEdit: {
            type: Boolean,
            default: true,
        },
        isSwitch: {
            type: Boolean,
            default: true,
        },
    },
    inject: ['formNode'],
    methods: {
        init(data) {
            const idx = this.$parent.prop;
            this.formNode.setInitData(idx, data);
        },
        change(data) {
            const { endDate } = this.getProps().opcCfg || {};
            if (typeof endDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
                // 存在截止日期，过滤数据
                this.$emit('input', data.filter(item => item.date <= endDate));
            } else {
                this.$emit('input', data);
            }
        },
        getProps() {
            const syncConfig = this.config?.props?.syncConfig ?? {};
            if (syncConfig.endDate) {
                const nowYear = new Date().getFullYear();
                const needYear = new Date(syncConfig.endDate).getFullYear();
                syncConfig.nextYearNum = Math.max(needYear - nowYear, 0);
            }
            return {
                ...this.config.props,
                text: this.text,
                diaCfg: {
                    width: `${this.isEdit ? 962 : 640}px`,
                    'before-close': this.beforeClose,
                },
                opcCfg: {
                    isEdit: this.isEdit,
                    isSwitch: this.isSwitch,
                    ...(syncConfig || {}),
                },
                btnCfg: this.configProps,
                value: Array.isArray(this.value) ? this.value : undefined,
                queryType: 'bp',
            };
        },
    },
    created() {
        this.configProps = _merge({}, defaultConfig[this.config.formType] || {}, this.config.props || {});
    },
    data() {
        return {
        };
    },
};
</script>

<style lang="scss" scoped>
.price-calendar-dialog {
    /deep/ .el-dialog__header {
        padding: 0;
    }
    /deep/ .el-dialog__body {
        padding: 0;
        margin: 0;
    }
}
</style>
