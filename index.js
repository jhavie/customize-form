import customizeForm from './src/customize.vue';
import customizeFormBox from './src/customize-box.vue';
import customizeFormSearch from './src/customize-search.vue';

export default {
    install(Vue) {
        let vueInstance = Vue;
        if (typeof window !== 'undefined' && window.Vue) {
            vueInstance = window.Vue;
        }
        vueInstance.component('cti-form', customizeForm);
        vueInstance.component('cti-form-box', customizeFormBox);
        vueInstance.component('customize-form-search', customizeFormSearch);
    }
};
