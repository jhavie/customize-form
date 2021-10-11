<template>
    <div class="operator" :class="{ 'edit-mode': useType === 'edit' }">
        <div class="toolbar">
            <div class="toolbar-title" v-if="isShowTitle && useType === 'review'">
                <span class="toolbar-title__text" :title="getTitle()">{{ getTitle() }}</span>
                <slot name="status"></slot>
            </div>
            <div class="toolbar-btns" v-if="hasBtn">
                <!--<span v-if="useType === 'edit'" @click="clickHandler('copy')" class="btns-copy">复制</span>-->
                <span @click="clickHandler('copy')" class="toolbar-btns__copy">复制</span>
                <el-popover placement="top" width="160" v-model="delPopoverVisible">
                    <p>确定删除吗？</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="delPopoverVisible = false">取消</el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            @click="
                                delPopoverVisible = false;
                                clickHandler('delete');
                            "
                        >
                            确定
                        </el-button>
                    </div>
                    <span class="toolbar-btns__delete" slot="reference">删除</span>
                </el-popover>
            </div>
        </div>
        <cti-form :data="data" ref="formNode" :type="useType" :formProps="formProps">
            <div slot="bottom" class="customize-form-bottom" v-if="hasTools">
                <el-button
                    round
                    type="primary"
                    v-if="useType === 'edit'"
                    plain
                    size="mini"
                    @click="clickHandler('reset')"
                    title="表单输入项重置为全空状态"
                >
                    重置
                </el-button>
                <el-button
                    round
                    type="primary"
                    v-if="useType === 'edit'"
                    plain
                    size="mini"
                    @click="clickHandler('cancel')"
                    :disabled="!edited"
                    title="表单输入项回退到上一次确认状态"
                >
                    取消
                </el-button>
                <el-button
                    round
                    type="primary"
                    v-if="useType === 'edit'"
                    size="mini"
                    @click="clickHandler('save')"
                    title="确认表单数据，触发校验通过后才可提交审核"
                >
                    确认
                </el-button>
                <!--el-button
                    round
                    plain
                    type="primary"
                    v-if="useType === 'review'"
                    size="mini"
                    @click="clickHandler('print')"
                >
                    打印
                </el-button-->
                <el-button
                    round
                    type="primary"
                    v-if="useType === 'review'"
                    size="mini"
                    @click="clickHandler('edit')"
                    title="切换为可编辑形态"
                >
                    编辑
                </el-button>
            </div>
        </cti-form>
    </div>
</template>
<script>
import _get from 'lodash/get';
import { isDefined } from './utils/tools/';

export default {
    name: 'customizeBox',
    props: {
        isShowTitle: {
            type: Boolean,
            default: () => false,
        },
        data: {
            type: Array,
            default: () => [],
        },
        formProps: {
            type: Object,
            default: () => ({}),
        },
        hasTools: {
            type: Boolean,
            default: () => true,
        },
        hasBtn: {
            type: Boolean,
            default: () => false,
        },
        defUseType: {
            type: String,
            default: () => 'edit',
        },
        itemName: {
            type: String,
            default: () => 'itemName',
        },
        cacheData: {
            type: Object,
            default: () => ({}),
        },
    },
    created() {
        this.edited = false;
    },
    methods: {
        setData(config, type = 'default') {
            // 更新动态表单数据
            const oldData = this.$refs.formNode.getFormData(type);
            config.forEach((value, idx) => {
                if (isDefined(value)) {
                    oldData[idx] = value;
                }
            });
            this.$refs.formNode.isCanValidate = false;
            this.$refs.formNode.setData(oldData);
            this.clickHandler('edit');
            this.$nextTick(() => {
                this.$refs.formNode.clearValidate();
                this.$refs.formNode.isCanValidate = true;
            });
        },
        getTitle() {
            // 返回title
            if (this.$refs.formNode) {
                return this.$refs.formNode.getData()[0];
            }
            return _get(this, 'data.0.value', '');
        },
        clickHandler(type, isClear = false) {
            if (type === 'delete') {
                // 删除按钮点击事件
                this.$emit('eventHandler', 'delete', { op: this });
            } else if (type === 'copy') {
                // 复制按钮点击事件
                this.$emit('eventHandler', 'copy', {
                    data: this.$refs.formNode.getFormData(),
                    op: this,
                });
            } else if (type === 'edit') {
                // 编辑按钮点击事件
                this.useType = 'edit';
                this.edited = true;
                this.$emit('eventHandler', 'edit', { op: this });
            } else if (type === 'save') {
                // 提交按钮点击事件
                this.edited = true;
                this.$refs.formNode.validate((valid) => {
                    if (valid) {
                        // 验证通过处理
                        this.useType = 'review';
                        this.$refs.formNode.saveData();
                        this.$emit( 'eventHandler', 'save', {
                            op: this,
                            data: this.$refs.formNode.getData(),
                            fullData: this.$refs.formNode.getFormData(),
                            autoSave: isClear,
                        });
                    } else if (isClear) {
                        // 验证不通过处理
                        this.$refs.formNode.clearValidate();
                        // 两秒后清除验证
                        // setTimeout(() => this.$refs.formNode.clearValidate(), 3000);
                    }
                });
            } else if (type === 'reset') {
                // 重置按钮点击事件
                this.message('是否确认重置？', this.$refs.formNode.resetData);
            } else if (type === 'cancel') {
                // 取消按钮点击事件
                if (!this.edited) return;
                this.$refs.formNode.lastData();
                // this.useType = 'review';
                this.$nextTick(() => {
                    this.clickHandler('save');
                    // this.$refs.formNode.clearValidate();
                });
            } else if (type === 'print') {
                // 打印按钮点击事件
                this.$emit('eventHandler', 'print', { op: this });
                console.log(JSON.stringify(this.$refs.formNode.getData(), null, 2));
            }
        },
        message(tip, func) {
            // 提示并执行回调
            this.$confirm(tip, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    func();
                })
                .catch((_) => _);
        },
        isDataUpdate() {
            return this.$refs.formNode.isDataUpdate();
        },
    },
    watch: {
        useType(val) {
            this.$nextTick(() => this.$emit('showChange', val));
        },
    },
    data() {
        return {
            useType: this.defUseType,
            delPopoverVisible: false,
        };
    },
};
</script>
<style lang="scss" scoped>
@import './varible.scss';
@mixin getStatus() {
    @include getfull(24px, 52px);
    border-radius: 2px;
    display: inline-block;
    text-align: center;
    font-size: 12px;
    margin-left: 10px;
}
.operator {
    width: 100%;
    padding: 10px 0 30px;
    &-bar {
        @include getflex(center, center);
    }
    .toolbar {
        @include getflex(flex-start, center);
        margin-bottom: 10px;
        &-title {
            font-size: 16px;
            font-weight: 800;
            line-height: 22px;
            color: #383838;
            max-width: 50%;
            position: relative;
            &__text {
                display: inline-block;
                width: 100%;
                text-align: left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-left: 70px;
            }
            &__status {
                display: inline-block;
                position: absolute;
                top: 0;
                width: 500px;
                right: -510px;
                @include getflex(flex-start, center);
                &__success {
                    border: 1px solid #7cd4ab;
                    color: #7cd4ab;
                    background-color: #effbf3;
                    @include getStatus();
                }
                &__info {
                    border: 1px solid #b0b0b0;
                    background-color: #f7f7f7;
                    color: #b0b0b0;
                    @include getStatus();
                }
                &__reason {
                    width: calc(100% - 54px - 18px);
                    font-size: 14px;
                    color: #F5643D;
                    letter-spacing: 0;
                    margin-left: 16px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        &-btns {
            flex: 1;
            @include getflex(flex-end, center);
            span {
                margin-right: 15px;
            }
            color: #4b8bee;
            &__delete {
                cursor: pointer;
            }
            &__copy {
                cursor: copy;
            }
        }
    }
}
.edit-mode {
    background-color: #fafbfd;
}
</style>
