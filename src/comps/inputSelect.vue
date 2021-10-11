<template>
    <el-autocomplete
        v-model="searchText"
        @select="changeHandle"
        :fetch-suggestions="querySearch"
        placeholder="请输入"
        :value-key="config.valueKey"
        v-bind="getProps()"
        @input="inputHandle"
    >
        <template slot-scope="{ item }">
            <div class="name">{{ item.label }}</div>
        </template>
    </el-autocomplete>
</template>

<script>
import defaultConfig from '../config';
import _merge from 'lodash/merge';
import _get from 'lodash/get';

export default {
    name: 'inputSelect',
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
        options: {
            type: Array,
            default: () => []
        }
    },
    computed: {},
    methods: {
        querySearch(queryString, cb) {
            const options = this.options;
            const results = queryString ? options.filter(this.createFilter(queryString)) : options;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (options) => {
                return (options.label.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        inputHandle(e) {
            const o = this.options.find(item => item.label === e);
            this.searchText = o ? o.value : e;
            this.$emit('input', this.searchText );
        },
        changeHandle(option) {
            this.searchText = option.label;
            this.$emit('input', option.value );
            const func = _get(this.config, 'props.on.click');
            if (func && func.constructor === Function) func(option);
        },
        getProps(props = this.config.props, formType = this.config.formType) {
            // 传入props与默认props合并
            return _merge({}, defaultConfig[formType] || {}, props || {});
        },
    },
    mounted() {
        // 缓存下拉框选中值
        const o = this.options.find(item => item.value === this.value);
        this.searchText = o ? o.label : this.value;
    },
    watch: {
        value(newVal, oldVal) {
            const o = this.options.find(item => item.value === newVal);
            this.searchText = o ? o.label : newVal;
        },
    },
    data() {
        return {
            searchText: ''
        };
    },
};
</script>

<style lang="scss" scoped>
</style>
