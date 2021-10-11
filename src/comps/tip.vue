<template>
    <el-tooltip
        :content="config.tipText"
        placement="top"
        popper-class="customize-global-tip"
    >
        <div class="tip">
            <i class="el-icon-warning-outline tip-icon" />
        </div>
    </el-tooltip>
</template>

<script>
export default {
    name: 'tip',
    props: {
        config: {
            type: Object,
            default: () => ({}),
        },
    },
};
</script>

<style lang="scss">
.customize-global-tip {
    color: #F5643D !important;
    box-shadow: 0 4px 10px 0 rgba(206, 206, 206, 0.5);
    border-radius: 4px;
    background: #FFFFFF !important;
    max-width: 200px;
    .popper__arrow, .popper__arrow::after, .popper__arrow::before {
        border-top-color: #FFF !important;
        border-bottom-color: #FFF !important;
    }
}
</style>

<style lang="scss" scoped>
.tip {
    padding-left: 10px;
}
.tip-icon {
    color: #F5643D;
}
</style>