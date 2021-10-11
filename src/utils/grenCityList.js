const citysInter = require('Components/city-input/city-international');

const keyMaps = [
    ['PROVINCES', 'PROVINCES'],
    ['CITY', 'CITY'],
    ['AREA', 'AREA'],
];

function getAreaData(level = 0, parent_code = '') {
    // 将城市列表数据结构转换为elementUI使用的数据结构
    // 递归的栈指针存在极限及性能消耗， 如果量级较大应改为迭代方式生成
    if (!keyMaps[level]) return [];
    return [
        ...(window.CITY_DATA[keyMaps[level][0]] || []),
        ...(citysInter[keyMaps[level][1]] || []),
    ].filter(item => item.parent_code === parent_code).map(item => {
        const res = {
            value: `${item.value}|${item.text}`,
            label: item.text,
        };
        res.children = getAreaData(level + 1, item.value);
        if (res.children.length === 0) delete res.children;
        return res;
    });
}

export default getAreaData;
