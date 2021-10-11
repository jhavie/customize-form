<template>
    <pre class="textarea-show">{{ value }}</pre>
</template>

<script>
export default {
    name: 'rangeNumber',
    props: {
        value: {
            type: String,
            default: () => '',
        },
        config: {
            type: Object,
            default: () => ({}),
        },
    },
    methods: {},
    created() {},
};
</script>

<style lang="scss" scoped>
.textarea-show {
    line-height: 1.2;
    max-height: 372px;
    white-space: pre-wrap;
    overflow: auto;
    margin-top: 6px;
}
</style>