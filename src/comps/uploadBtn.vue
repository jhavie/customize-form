<template>
    <div class="upload-btn">
        <upload-file ref="uploadFile" @change="change" />
        <div v-for="(item, idx) in value" :key="idx" class="filelist">
            <span>{{ item.name }}</span>
            &nbsp;&nbsp;
            <el-popover trigger="click" ref="popoverList" placement="top" width="160">
                <p>确定删除吗？</p>
                <div class="popover-btn">
                    <el-button size="mini" type="text" @click="hidePopover(idx)">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteFile(item.value, idx)">确定</el-button>
                </div>
                <i slot="reference" class="el-icon-delete delete" />
            </el-popover>
        </div>
        <div class="uploadBtn" @click="chooseFile" v-show="value.length < config.limit">
            <span class="up_load" />
            上传附件
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import getFormData from '../utils/getFormData';

@Component({ name: 'upload-btn' })
export default class UploadBtn extends Vue {
    @Prop({ default: () => ({}) }) config!: object;

    @Prop({ default: () => ({}) }) value!: array;

    async change(event) {
        const formData = getFormData(
            event.file,
            {
                bizType: 'VOTE_FILE',
                bizId: '',
                ...(this.config?.requestParams ?? {}),
            },
            {
                typeList: [],
                maxSize: 10,
            },
        );
        if (formData.type === 'error') {
            this.$message(formData);
        } else {
            const res = await this.$store.dispatch('submitUploadFile', formData);
            if (!res || res.resultCode !== '1000' || !res.data) return;
            this.$emit('input', [
                ...this.value,
                {
                    value: res.data.fileId,
                    url: res.data.fileUrl,
                    name: event.fileName,
                },
            ]);
        }
    }

    hidePopover(idx) {
        this.$refs.popoverList[idx]?.doClose();
    }

    deleteFile(value, idx) {
        this.hidePopover(idx);
        this.$emit('input', this.value.filter((item) => item.value !== value));
    }

    chooseFile() {
        this.$refs.uploadFile?.openAlbum();
    }
}
</script>

<style lang="scss" scoped>
.upload-btn {
    .uploadBtn {
        color: #4B8BEE;
        width: max-content;
        cursor: pointer;
    }
    .delete {
        color: #4B8BEE;
        cursor: pointer;
    }
    .up_load {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: url('~@mice/assets/icon/upLoad.svg') center no-repeat;
        background-size: contain;
        vertical-align: middle;
    }
}
.popover-btn {
    text-align: right;
    margin: 0;
}
</style>