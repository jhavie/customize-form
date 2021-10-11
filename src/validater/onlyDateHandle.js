import dayjs from 'dayjs';

export default function onlyDateHandle(dataList) {
    // 日期保证唯一校验
    const dataObj = {};
    for (let i = 0; i < dataList.length; i++) {
        const data = dataList[i];
        let start = dayjs(data[0]);
        const end = dayjs(data[1]);
        while (end.diff(start, 'day') > -1) {
            const key = start.valueOf();
            if (dataObj[key]) {
                return {
                    notOk: true,
                    message: start.format('在YYYY年MM月DD日存在多个价格，请更正！')
                };
            } 
            dataObj[key] = true;
            
            start = start.add(1, 'day');
        }
    }
    return false;
}