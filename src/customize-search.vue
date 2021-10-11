<template>
    <div class="customize-form-search">
        <cti-form
            :data="formConfigs"
            ref="formNode"
            type="edit"
            :keyName="keyName"
            :formProps="formProps"
            :isFault="isFault"
        >
            <div slot="bottom" class="customize-form-btn">
                <el-button
                    v-for="(btn, idx) in btnList"
                    round
                    :type="btn.show || 'default'"
                    size="mini"
                    :key="idx"
                    @click="clickHandle(btn.type || '')"
                >
                    {{ btn.text || '' }}
                </el-button>
            </div>
        </cti-form>
    </div>
</template>

<script>
export default {
    name: 'customizeSearch',
    props: {
        // 数据键
        keyName: {
            type: String,
            default: () => 'keyName',
        },
        // 表单配置
        formConfigs: {
            type: Array,
            default: () => [],
        },
        // form配置
        formProps: {
            type: Object,
            default: () => ({ 'label-width': 'auto' }),
        },
        isFault: {
            type: Boolean,
            default: true,
        },
        // 按钮列表
        btnList: {
            type: Array,
            default: () => [
                {
                    text: '重置',
                    show: 'default',
                    type: 'reset',
                },
                {
                    text: '搜索',
                    show: 'primary',
                    type: 'search',
                },
            ],
        },
    },
    methods: {
        clickHandle(type) {
            // 按钮点击事件
            const cb = () => this.$refs.formNode.getData();
            switch (type) {
                case 'reset':
                    // 重置按钮点击事件处理
                    this.$refs.formNode.resetData();
                    break;
                default:
                    break;
            }
            // 发送事件
            this.$emit('change', cb(), type, cb);
        },
        clearData(key) {
            this.$refs.formNode.clearData(key);
        },
    },
};
</script>

<style scoped lang="scss">
.customize-form-search {
    padding: 30px;
    background: #fff;
    box-shadow: 0 2px 10px 0 hsla(0, 0%, 81%, 0.5);
    border-radius: 4px;
    position: relative;
    /deep/ .customize-form-btn {
        position: absolute;
        right: 30px;
        bottom: 30px;
    }
}
</style>
