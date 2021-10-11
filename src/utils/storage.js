import { isNotDefined } from './tools/';

export default {
    getItem: (key, defaultVal = {}) => {
        const data = localStorage.getItem(key);
        if (isNotDefined(data)) return defaultVal;
        try {
            return JSON.parse(data);
        } catch (err) {
            return data;
        }
    },
    setItem: (key, value) => {
        localStorage.setItem(key, value.constructor !== String ? JSON.stringify(value) : value);
    },
    removeItem: (key) => {
        localStorage.removeItem(key);
    },
    getlength: () => {
        return localStorage.length;
    },
    key: (number) => {
        return localStorage.key(number);
    },
    clear: () => {
        localStorage.clear();
    },
};
