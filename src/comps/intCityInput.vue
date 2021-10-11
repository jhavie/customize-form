<template>
    <div class="int-city-input">
        <el-popover
            ref="popover"
            :disabled="popoverDisabledFlag"
            popper-class="init-city-select-popover"
            placement="top-start"
            effect="light"
            trigger="hover"
            :visible-arrow="false"
            :popper-options="popperOptions"
        >
            <div class="int-city-select-popover-content">
                <el-tag
                    v-for="(tag, tagIndex) in viewTags"
                    :key="tag.value"
                    closable
                    type="info"
                    size="small"
                    effect="light"
                    @close="handleDeleteTag(tagIndex)"
                >
                    {{ tag.label }}
                </el-tag>
            </div>
            <!-- slot="reference" -->
            <div popper-class="int-city-select-popper" slot="reference">
                <el-select
                    :size="size"
                    class="city-select"
                    remote
                    filterable
                    collapse-tags
                    default-first-option
                    value-key="value"
                    loading-text="正在搜索..."
                    :loading="isLoading"
                    :value="selectedOptions"
                    :reserve-keyword="isNeedAirport"
                    :remote-method="remoteMethod"
                    :placeholder="placeholder"
                    multiple
                    :multiple-limit="isMultiple ? 0 : 1"
                    @change="onDataChange"
                >
                    <el-option
                        v-for="(item, itemIndex) in options"
                        :key="item ? item.value : itemIndex"
                        :label="item.label"
                        :value="item"
                    >
                        <div class="city-option-panel">
                            <el-checkbox
                                :size="size"
                                class="city-checkbox"
                                :value="getCheckboxStatus(item.value)"
                            ></el-checkbox>
                            <span class="city-name">{{ item.label }}</span>
                        </div>
                    </el-option>
                </el-select>
            </div>
        </el-popover>
        <div class="remark-content">
            <remark-input
                v-model="remark"
                placeholder="未找到可在此填写备注"
                @blur="onExpandInputBlur"
            ></remark-input>
        </div>
    </div>
</template>

<script>
import { Popover, Select, Tag } from 'element-ui';
import { mapState } from 'vuex';
import { validateJSON, deepClone, getStore } from 'Utils';
import remarkInput from '@mice/common/components/remarkInput';

export default {
    components: {
        Popover,
        Select,
        Tag,
        remarkInput
    },
    props: {
        itemId: String,
        value: String,
        needAirport: String,
        placeholder: {
            default: '请输入城市名检索'
        },
        size: {
            default: 'mini'
        },
        popperClass: String
    },
    data() {
        return {
            isLoading: false,
            isMultiple: true,
            options: [],
            selectedOptions: [],
            remark: null, // 备注说明
            popoverId: 0,
            citySelectWidth: 0,
            popoverDisabled: false,
            popperOptions: {
                boundariesElement: 'body',
                gpuAcceleration: false,
                modifiers: [
                    'shift',
                    'offset',
                    'preventOverflow',
                    'keepTogether',
                    'arrow',
                    'flip',
                    this.popperModifier,
                    'applyStyle'
                ]
            }
        };
    },
    created() {
        console.log('创建完成：', this.value, this.needAirport);
        this.parseModelValue(this.value).then(() => {});
    },
    mounted() {
        const popoverRef = this.$refs.popover;
        const citySelect = document.querySelector('.city-select');
        this.popoverId = popoverRef && popoverRef.tooltipId;
        this.citySelectWidth = citySelect && citySelect.offsetWidth;
        this.initSelectMultipleCfg();
        // const cascaderPopperMenu = document.querySelector('.int-city-select-popper .el-select');
        // cascaderPopperMenu.style.maxWidth = this.citySelectWidth + 'px';
    },
    methods: {
        initSelectMultipleCfg() {
            const reqType = getStore({ name: 'reqTypeArrAddress' });
            const roleCode = getStore({ name: 'roleCode' });
            const isSupplier = roleCode === 'supplier';
            // 符合企业侧、会议类型、是基本信息里的目的地三个条件就单选
            if (!isSupplier && reqType === 'meeting' && this.itemId === 'common_base_arrAddress') {
                this.isMultiple = false;
            }
        },
        getCheckboxStatus(value) {
            return this.selectedOptions.some((el) => el.value === value);
        },
        visibleChange(flag) {
            this.popoverDisabled = flag;
        },
        async remoteMethod(query) {
            if (query) {
                this.isLoading = true;
                const data = await this.$store.dispatch('dictionary/queryCityByName', {
                    isNeedAirport: this.needAirport,
                    queryStr: query
                });
                console.log('模糊查询结果', data);
                if (data && data.length) {
                    this.options = [].concat(this.filterRepeatOption(data));
                } else {
                    this.options = [];
                }
                this.isLoading = false;
            } else {
                this.options = [].concat(this.selectedOptions);
            }
        },
        // 搜索出来的数据中剔除已选择的数据
        filterRepeatOption(data) {
            const list = deepClone(data);
            const res = list.filter((item) => {
                const value = item.value;
                const index = this.selectedOptions.findIndex((el) => el.value === value);
                return index < 0;
            });
            return res;
        },
        onExpandInputBlur() {
            this.onDataChange(deepClone(this.selectedOptions));
        },
        onDataChange(data = []) {
            console.log('目前选择的值：', data);
            this.$nextTick(() => {
                const list = [];
                if (data.length) {
                    const labelMapKey = { 0: 'countryName', 1: 'cityName', 2: 'airportName' };
                    const valueMapKey = { 0: 'countryCode', 1: 'cityCode', 2: 'airportCode' };
                    data.forEach((item) => {
                        const { label, value } = item;
                        if (label && value) {
                            const labelList = label.split('/');
                            const valueList = value.split('/');
                            const len = valueList.length;
                            const tmp = {};
                            for (let index = 0; index < len; index++) {
                                tmp[labelMapKey[index]] = labelList[index];
                                tmp[valueMapKey[index]] = valueList[index];
                                tmp.label = label;
                                tmp.value = value;
                            }
                            list.push(tmp);
                        }
                    });
                } else {
                    this.$set(this, 'selectedOptions', []);
                }
                console.log('要抛出的数据:', list);
                const emitData = { list, remark: this.remark };
                // this.selectedOptions = deepClone(list);
                // 将二维数组转化成服务项需要的JSON字符串
                this.$emit('input', JSON.stringify(emitData));
            });
        },
        handleDeleteTag(tagIndex) {
            this.selectedOptions.splice(tagIndex, 1);
            this.options = [].concat(this.selectedOptions);
        },
        popperModifier(data) {
            const popperOffsets = data.offsets.popper;
            // 修改popper距离refrence的高度
            if (data.placement.indexOf('top') > -1) {
                data.offsets.popper.top = popperOffsets.top + 10;
            } else {
                data.offsets.popper.top = popperOffsets.top - 10;
            }
            // 修改popper的宽度
            data.instance._popper.style.minWidth = this.citySelectWidth + 'px';
            return data;
        },
        // 将后台返回的JSON字符串格式化成联级需要的二维数组[['cn', 'shenzhen', 'baoanjichang]]
        parseModelValue(data = '') {
            const parseData = validateJSON(data);
            if (parseData.isJSON) {
                const result = []; // 已选择的数据
                const { list, remark } = parseData.data;
                this.remark = remark;
                if (!list || !list.length) {
                    return Promise.resolve();
                }
                this.checkedTagList = list ? [].concat(list) : [];
                for (let index = 0; index < list.length; index++) {
                    const item = list[index];
                    const {
                        countryCode,
                        countryName,
                        cityCode,
                        cityName,
                        airportCode,
                        airportName
                    } = item;
                    console.log(
                        'countryName,cityName,airportName:',
                        countryName,
                        cityName,
                        airportName
                    );
                    if (countryCode) {
                        let value = `${countryCode}`;
                        let label = `${countryName}`;
                        if (cityCode) {
                            value = `${countryCode}/${cityCode}`;
                            label = `${countryName}/${cityName}`;
                            if (airportCode && this.isNeedAirport) {
                                // 有机场码且需要显示机场
                                value = `${countryCode}/${cityCode}/${airportCode}`;
                                label = `${countryName}/${cityName}/${airportName}`;
                            }
                        }
                        // label = label.replace(/[\(大陆|香港|台湾|澳门\)]/g, '');
                        result.push({ label, value }); // 已选择的列表
                    }
                }
                this.selectedOptions = [].concat(result);
                if (!this.options.length) {
                    this.options = [].concat(result);
                }
                return Promise.resolve();
            }
            return Promise.resolve();
        }
    },
    computed: {
        ...mapState('dictionary', ['countryCityMap', 'airportMap']),
        viewTags() {
            const tags = [];
            this.selectedOptions.forEach((item) => {
                const { label, value } = item;
                // const reg = new RegExp('.*,\\s*(.*)');
                // const tagNames = label.match(reg);
                // const tagCodes = value.match(reg);
                // const tagName = tagNames[1] || '';
                // const tagCode = tagCodes[1] || '';
                tags.push({ label, value }); // 悬浮显示的标签列表
            });
            return tags;
        },
        isNeedAirport() {
            return this.needAirport === 'Y';
        },
        popoverDisabledFlag() {
            return this.selectedOptions.length < 2;
        }
    },
    watch: {
        value(val) {
            this.parseModelValue(val);
        }
    }
};
</script>

<style lang="scss">
.init-city-select-popover {
    display: flex;
    overflow: hidden;
    max-width: 360px;
    background: #fff;
    border: none !important;
    margin-bottom: -20px;
    box-shadow: 0 2px 10px 0 rgba(206, 206, 206, 0.5);
    .el-select__tags {
        .el-tag {
            max-width: 110px;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 5px;
        }
    }

    .el-tag + .el-tag {
        margin-top: 5px;
        margin-left: 5px;
    }
}
.city-option-panel {
    display: flex;
    position: relative;
    .city-checkbox {
        position: absolute;
    }
    .city-name {
        z-index: 1;
        padding-left: 20px;
    }
}
/deep/ .int-city-select-popper {
    min-width: 246px;
}
</style>
