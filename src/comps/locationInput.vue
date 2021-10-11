
<template>
    <el-cascader
        :value="getValue"
        :options="options"
        filterable
        @change="changeHandle"
        v-bind="getProps(config.props, config.formType)"
        clearable
    />
</template>

<script>
import _merge from 'lodash/merge';
import cityList from '../utils/grenCityList';
import defaultConfig from '../config';
import { areaNameMap } from '../config/nameMap';

export default {
    name: 'areaInput',
    props: {
        value: {
            type: Object,
            default: () => [],
        },
        config: {
            type: Object,
            default: () => ({}),
        },
    },
    methods: {
        changeHandle(value) {
            const data = value.reduce((ans, item, idx) => {
                item.split('|').forEach((val, subIdx) => {
                    ans[areaNameMap[idx][subIdx]] = val;
                });
                return ans;
            }, {});
            this.$emit('input', data);
        },
        getProps(props = this.config.props, formType = this.config.formType) {
            // 传入props与默认props合并
            return _merge({}, defaultConfig[formType] || {}, props || {});
        },
    },
    created() {},
    computed: {
        getValue() {
            return areaNameMap.reduce((ans, item, idx) => {
                const data = item.map((key) => this.value[key]).join('|');
                data !== '|' && ans.push(data);
                return ans;
            }, []);
        },
    },
    data() {
        return {
            options: Object.freeze(cityList()),
        };
    },
};
</script>

<style lang="scss" scoped>
</style>
