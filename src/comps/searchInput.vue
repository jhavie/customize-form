
<template>
    <el-autocomplete
        v-model="searchText"
        :fetch-suggestions="remoteMethod"
        @select="changeHandle"
        :placeholder="config.props.placeholder"
        :value-key="config.valueKey"
        v-bind="getProps()"
        @blur="blurHandle"
    >
        <template v-if="config.props.showSlot" slot-scope="{ item }">
            <span>{{ item.name }}</span>
            <span class="right">{{ item.value }}</span>
        </template>
    </el-autocomplete>
</template>

<script>
import defaultConfig from '../config';
import _merge from 'lodash/merge';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import _uniqBy from 'lodash/uniqBy';
import _uniq from 'lodash/uniq';
import { delay, isNotDefined } from '../utils/tools/';
import { initMap } from 'Service/mapService';

export default {
    name: 'searchInput',
    props: {
        value: {
            type: [String, Object],
            default: () => '',
        },
        config: {
            type: Object,
            default: () => ({}),
        },
        eventType: {
            type: String,
            default: () => '',
        },
    },
    computed: {},
    methods: {
        blurHandle(event) {
            /*
            if (this.config.searchType === 'location') {
                // 高德地图搜索， 失去焦点值还原
                this.searchText = this.selectItem.value;
            }
            */
            if (this.searchText !== this.value.value) {
                this.$emit('input', { value: this.searchText });
                if (!this.searchText) return;
                const func = _get(this.config, 'props.on.blur');
                if (func && func.constructor === Function) func(this.searchText);
            }
        },
        changeHandle(option) {
            this.selectItem = _cloneDeep(option);
            if (this.config.remoteOptions) {
                this.$emit('input', { ...option, value: option[this.config.valueKey] });
            } else if (this.config.searchType === 'location') {
                // 高德地图
                this.$emit('input', option);
            }
            const func = _get(this.config, 'props.on.click');
            if (func && func.constructor === Function) func(option);
        },
        async remoteMethod(msg, cb) {
            if (this.loading || msg === '' || isNotDefined(msg)) {
                cb([]);
                return;
            }
            if (this.value.value === msg || msg === this.selectItem[this.config.valueKey]) {
                cb(this.options);
                return;
            }
            this.loading = true;
            if (this.config.remoteOptions) {
                await delay(this.config.delayTime || 0.2);
                const searchText = this.searchText;
                if (searchText === '' || isNotDefined(searchText)) {
                    cb([]);
                    this.loading = false;
                    return;
                }
                try {
                    this.options = await this.config.remoteOptions(searchText);
                } catch (err) {
                    this.options = [];
                }
                this.loading = false;
                cb(this.optionsHandle(this.options));
            } else if (this.config.searchType === 'location') {
                this.remoteLocation(cb);
            }
        },
        getProps(props = this.config.props, formType = this.config.formType) {
            // 传入props与默认props合并
            return _merge({}, defaultConfig[formType] || {}, props || {});
        },
        async amapSearch(cb) {
            await delay(this.config.delayTime || 1);
            if (this.searchText === '') {
                cb([]);
                this.loading = false;
                return;
            }
            let self = this.$parent;
            while (!self.customizeRoot) {
                self = self.$parent;
            }
            const idx = self.configs.findIndex((config) => config.keyName === this.config.bindKey);
            const areaData = { ...self.getData()[idx] };
            const city = [..._uniq([areaData.proName || '', areaData.cityName || '']), this.searchText].join(' ');
            this.autoComplete.search(city, (status, result = {}) => {
                // 高德搜索返回
                this.loading = false;
                if (result.tips && result.tips.constructor === Array) {
                    // 过滤详细地址异常值， 过滤无坐标定位值数据， 过滤重复
                    this.options = _uniqBy(
                        result.tips.filter(
                            (tip) => tip.address.constructor === String && tip.location.lat && tip.location.lng,
                        ),
                        'address',
                    ).map((tip) => ({
                        value: tip.address,
                        latitude: tip.location.lat,
                        longitude: tip.location.lng,
                    }));
                    cb(this.optionsHandle(this.options));
                } else {
                    cb(this.optionsHandle([]));
                }
            });
        },
        optionsHandle(options) {
            // if (options.length === 0) this.$message.warning('数据结果为空！');
            return options;
        },
        async remoteLocation(cb) {
            // 高级搜索中间件
            if (this.autoComplete) {
                this.amapSearch(cb);
            } else {
                const AMap = await initMap();
                AMap.plugin('AMap.Autocomplete', () => {
                    this.autoComplete = new AMap.Autocomplete({ city: '全国' });
                    this.amapSearch(cb);
                });
            }
        },
    },
    mounted() {
        // 高德自动搜索对象
        this.autoComplate = null;
        // 缓存搜索结果
        this.options = [];
        // 缓存下拉框选中值
        this.selectItem = this.value || {};
    },
    watch: {
        eventType(newVal, oldVal) {
            // 外部事件驱动
        },
        value(newVal = {}, oldVal) {
            if (newVal.value !== this.searchText) {
                this.searchText = newVal.value;
                this.selectItem = newVal;
            }
        },
    },
    data() {
        return {
            loading: false,
            searchText: this.value.value || '',
        };
    },
};
</script>

<style lang="scss" scoped>
.right {
    float: right;
}
</style>
