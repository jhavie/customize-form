import { controller } from '../config/';
import { datetimeConfig } from '../config/datetime';
import dayjs from 'dayjs';

const now = dayjs();
export default function setValue(config = {}, showType, { value, type } = {}) {
    if (controller.autoFill !== 'Y' || config.value) return;
    switch (showType) {
        case 'number':
            config.value = value || 10;
            break;
        case 'rangeNumber':
            config.value = value || [10, 20];
            break;
        case 'text':
            config.value = value || config.label;
            break;
        case 'date':
            config.value = value || now.format(datetimeConfig(type).format);
            break;
        case 'rangeDate':
            config.value = value || [now.format(datetimeConfig(type).format), now.format(datetimeConfig(type).format)];
            break;
        default:
            if (value) {
                config.value = value;
            }
            break;
    }
}
