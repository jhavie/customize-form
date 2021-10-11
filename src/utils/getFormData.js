/**
 * 生成并返回formData
 *
 * @param {Object} file 文件对象
 * @param {Object} obj 上传内容对象，会添加到formData内
 * @param {Object} filter 过滤对象，包含maxSize、nameCheck、typeList
 * @returns {FormData || Object} 返回对象包含type值为error时为提示对象，否则为FormData对象
 */

export default function getFormData (file, obj = {}, filter = {}) {
    const typeList = (filter.typeList || ['jpg', 'png', 'gif']).reduce((ans, key) => {
        ans.push(key);
        ans.push(key.toUpperCase());
        return ans;
    }, []);
    const nameCheck = filter.nameCheck === undefined ? /[`~!@#$%^&*()\<>?:"\/\~！@#%&*（）\？：]/im : filter.nameCheck;
    const typeCheck = typeList.length ? new RegExp(`\.(${typeList.join('|')})+$`) : false;
    const maxSize = filter.maxSize || 5;
    if (maxSize !== false && file.size > 1024 * 1024 * maxSize) {
        return {
            type: 'error',
            message: `文件上传单个大小不能超过${maxSize}M`,
            showClose: true,
        };
    }
    if (nameCheck?.test && nameCheck.test(file.name)) {
        return {
            type: 'error',
            message: '上传的附件名称不能包含特殊字符',
            showClose: true,
        };
    }
    if (typeCheck?.test && !typeCheck.test(file.name)) {
        return {
            type: 'error',
            message: `只能上传${typeList.join('、')}后缀的图片`,
            showClose: true,
        };
    }
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(obj).map(([key, val]) => formData.append(key, val));
    return formData;
}
