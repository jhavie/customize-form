
<template>
    <div class="image-box">
        <ul class="image-box-list">
            <li v-for="(item, idx) in value" @click="showImg(item, idx)" :key="idx">
                <img :src="item.url" :alt="item.name" />
            </li>
        </ul>
        <el-dialog
            class="el-dialog--large image-box-dialog"
            :title="`图片预览(${currentIdx + 1}/${value.length})`"
            :visible.sync="dialogVisible"
            width="70%"
        >
            <img width="100%" :src="dialogImg.url" :alt="dialogImg.name" />
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            dialogVisible: false,
            currentIdx: 0,
            dialogImg: {},
        };
    },
    methods: {
        showImg(config, idx) {
            this.dialogImg = config;
            this.dialogVisible = true;
            this.currentIdx = idx;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../varible.scss';
.image-box {
    &-list {
        @include getflex();
        li {
            background-color: #000;
            overflow: hidden;
            margin-right: 8px;
            position: relative;
            @include getflex(center, center);
            @include getfull(70px, 70px);
            img {
                width: 100%;
            }
        }
    }
}
.image-box-dialog {
    /deep/ .el-dialog {
        margin-top: 50px !important;
        .el-dialog__body {
            padding: 0 20px;
        }
    }
}
</style>
