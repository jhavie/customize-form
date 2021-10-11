
<template>
    <div class="show-tag">
        <el-tag v-for="(item, idx) in value" :key="idx" size="mini" :type="getType(idx)" class="show-tag-item">
            {{ getShowText(item) }}
        </el-tag>
    </div>
</template>

<script>
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
        getType(idx) {
            return ['', 'success', 'info', 'warning', 'danger'][idx % 5];
        },
        getShowText(value) {
            return this.config.options.find((item) => item.value === value).label;
        },
    },
    created() {},
};
</script>

<style lang="scss" scoped>
.show-tag {
    &-item {
        margin: 0 2px;
    }
}
</style>
