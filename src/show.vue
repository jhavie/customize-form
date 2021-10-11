<template>
    <div class="customize-form-show">
        <upload-image-show v-if="config.formType === 'uploadImage'" :value="value" />
        <checkbox-all-show v-else-if="config.formType === 'checkboxAll'" :value="value" :config="config" />
        <show-tag v-else-if="config.showType === 'tag'" :value="value" :config="config" />
        <cti-price-calendar
            v-else-if="config.formType === 'price-calendar'"
            :value="value"
            :config="config"
            :isEdit="false"
            text="价格明细"
            @input="change"
        />
        <textarea-show
            v-else-if="config.formType === 'input' && config.props.type === 'textarea'"
            :value="value"
            :config="config"
        />
        <template v-else-if="config.formType === 'order'">
            <div
                v-for="(each, eachIdx) in value"
                :key="eachIdx"
                class="customize-form-show__item"
                :title="getText(each)"
            >
                {{ getText(each) }}
            </div>
        </template>
        <div v-else class="customize-form-show__item" :title="getText(value)">
            {{ getText(value) }}
        </div>
        <template v-if="config.itemProps.label === '开户行支行：'">
            <el-popover placement="top-start" width="386" trigger="hover" class="rule-image">
                <span>签约接单完成后，将以当前最新的收款账户为供应商创建平安财智云收款账户</span>
                <span slot="reference" class="icon-notice">
                    <i class="el-icon-question" slot="reference" /> 开户说明
                </span>
            </el-popover>
        </template>
        <cti-tip v-if="config.tipText" :value="value" :config="config" />
    </div>
</template>

<script>
import uploadImageShow from './comps/uploadImageShow';
import checkboxAllShow from './comps/checkboxAllShow';
import showTag from './comps/showTag';
import ctiPriceCalendar from './comps/ctiPriceCalendar';
import defaultConfig from './config';
import textareaShow from './comps/textareaShow';
import ctiTip from './comps/tip';

export default {
    name: 'customizeShow',
    props: {
        value: [String, Array, Number, Date, Object, Boolean],
        config: {
            type: Object,
            default: () => ({}),
        },
        prop: {
            type: String,
            required: true,
        },
    },
    components: {
        ctiTip,
        textareaShow,
        uploadImageShow,
        checkboxAllShow,
        showTag,
        ctiPriceCalendar,
    },
    created() {},
    data() {
        return {
            checkList: Object.freeze(['select']),
        };
    },
    computed: {},
    methods: {
        change(data) {
            this.$emit('input', data);
        },
        getText(data) {
            //  返回普通表单的数据文本
            let func = () => '';
            const formType = this.config.formType;
            if (this.config.getText) {
                func = this.config.getText;
            } else if (defaultConfig[formType] && defaultConfig[formType].getText) {
                func = defaultConfig[formType].getText;
            }
            let text;
            try {
                text = func(data, this.config);
            } catch (err) {
                // console.log('cti-form::getText', this.config.formType, data, err);
                text = '';
            }
            return text;
        },
    },
};
</script>

<style lang="scss" scoped>
@import './varible.scss';

.customize-form-show {
    color: #333;
    font-family: 'PingFangSC-Regular';
    max-width: 100%;
    flex: 1;
    @include getflex();
    &__item {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .icon-notice {
        color: #4b8bee;
        margin-left: 10px;
        .el-icon-question {
            font-size: 17px;
        }
    }
}
</style>