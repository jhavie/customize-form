
<template>
    <div class="upload-image">
        <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="true"
            :limit="config.limit || limit"
            :on-exceed="exceedHandle"
            :on-change="changeHandle"
            :http-request="progressHandle"
            accept="image/png, image/jpeg"
            :file-list="value"
            :class="{ 'hide-plus': value.length >= config.limit }"
        >
            <div slot="tip" class="el-upload__tip">
                图片仅支持JPG、PNG格式，大小不超过5M，建议尺寸960*540
            </div>
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }" class="tools-bar">
                <img class="tools-bar-thumbnail" :src="file.url" :alt="file.name" />
                <div class="tools-bar-actions el-upload-list__item-actions">
                    <span class="tools-bar-left" @click="handleLeft(file)">
                        <i class="el-icon-arrow-left"></i>
                    </span>
                    <span class="tools-bar-delete" @click="handleDelete(file)">
                        <i class="el-icon-delete"></i>
                    </span>
                    <span class="tools-bar-right" @click="handleRight(file)">
                        <i class="el-icon-arrow-right"></i>
                    </span>
                </div>
            </div>
        </el-upload>
    </div>
</template>

<script>
import getFormData from '../utils/getFormData';

export default {
    props: {
        limit: {
            type: Number,
            default: () => 3,
        },
        config: {
            type: Object,
            default: () => ({}),
        },
        value: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {};
    },
    methods: {
        handleDelete(file) {
            const idx = this.value.findIndex((item) => item.uid === file.uid);
            this.$emit('input', [...this.value.slice(0, idx), ...this.value.slice(idx + 1)]);
        },
        handleLeft(file) {
            this.handleSwitch(file.uid, 0, -1);
        },
        handleRight(file) {
            this.handleSwitch(file.uid, this.value.length - 1, 1);
        },
        handleSwitch(uid, cor, diff) {
            const idx = this.value.findIndex((item) => item.uid === uid);
            if (idx !== cor) {
                const current = this.value[idx];
                const temp = this.value[idx + diff];
                this.$emit(
                    'input',
                    this.value.reduce((ans, item, i) => {
                        if (i === idx + diff) {
                            ans.push(current);
                        } else if (i === idx) {
                            ans.push(temp);
                        } else {
                            ans.push(item);
                        }
                        return ans;
                    }, []),
                );
            }
        },
        async progressHandle(event) {
            const formData = getFormData(
                event.file,
                {
                    bizType: 'BP_IMAGE_FILE',
                    bizId: '',
                },
                {
                    typeList: ['png', 'jpg'],
                    maxSize: 5,
                },
            );
            if (formData.type === 'error') {
                this.$message(formData);
            } else {
                const res = await this.$store.dispatch('uploadFile', formData);
                if (res && res.resultCode == '1000') {
                    this.$emit('input', [...this.value, { value: res.data.fileId, url: res.data.fileUrl }]);
                } else {
                    this.$message({
                        type: 'error',
                        message: res.resultMsg,
                        customClass: 'resMessage',
                        showClose: true,
                    });
                }
            }
        },
        changeHandle() {
            this.$emit('input', this.value);
        },
        exceedHandle() {
            this.$message.warning(`上传图片请不要超过${this.config.limit || this.limit}张!`);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../varible.scss';
.upload-image {
    /deep/ .el-upload-list {
        &__item {
            @include getfull(70px, 70px);
        }
    }
    /deep/ .el-upload--picture-card {
        @include getfull(70px, 70px);
        line-height: 70px;
        .el-icon-plus {
        }
    }
    .hide-plus {
        /deep/ .el-upload--picture-card {
            display: none;
        }
    }
    .tools-bar {
        @include getfull();
        @include getflex(center, center);
        background-color: #000;
        opacity: 1;
        &-thumbnail {
            width: 100%;
        }
        &-actions {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 78px;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.6);
            font-size: 15px;
            @include getflex(space-around, flex-end);
            span {
                margin: 0;
                padding: 0;
            }
        }
    }
    .el-upload__tip {
        padding: 0;
        margin: 0;
        color: #b4b4b4;
    }
    /deep/ .el-upload {
        .el-icon-plus {
            vertical-align: sub;
        }
    }
}
</style>
