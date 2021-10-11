
<template>
    <table class="checkbox-all-show">
        <tr>
            <td>
                {{ config.label }}
            </td>
            <td>
                <el-checkbox
                    v-for="(item, idx) in config.options"
                    :value="true"
                    :key="idx"
                    :indeterminate="!value.includes(item.value || item)"
                    :disabled="!value.includes(item.value || item)"
                >
                    {{ item.label }}
                </el-checkbox>
            </td>
        </tr>
    </table>
</template>

<script>
export default {
    name: 'checkboxAllShow',
    props: ['value', 'config'],
    methods: {},
    created() {},
};
</script>

<style lang="scss" scoped>
@import '../varible.scss';
.checkbox-all-show {
    width: 100%;
    border-right: 1px solid #e8e8e8;
    tr {
        td:first-child {
            vertical-align: middle;
            text-align: center;
            width: 120px;
            background: #f8f8f8;
        }
        td {
            line-height: 2;
            padding: 10px;
            /deep/ .el-checkbox {
                @include checkbox();
            }
            border-bottom: 1px solid #e8e8e8;
            border-left: 1px solid #e8e8e8;
            border-top-style: solid;
            border-top-color: #e8e8e8;
        }
    }
}
</style>
