import parseObj from './parseService';
import parseItem from './parseServiceData';
import grenResultData from './grenResultData';
import grenResultItemData from './grenResultItemData';
import service2json from './service2json';

export default {
    ...parseObj,
    parseItem,
    grenResultData,
    grenResultItemData,
    service2json,
};
