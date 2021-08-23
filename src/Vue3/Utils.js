export function nextTick(cb, ...arg) { // 将函数调用转化为Promise
    Promise.resolve().then(() => {
        cb(...arg);
    });
}
export function getByPath(obj, path) {getByPath
    const pathArr = path.split(".");
    return pathArr.reduce((result, curr) => {
        return result[curr];
    }, obj);
}
export function getEl(el) { // 获取挂载的元素DOM对象
    if (!(el instanceof Element)) {
        try {
            return document.querySelector(el);
        } catch {
            throw "没有选中挂载元素";
        }
    } else return el;
}
