const obj1 = {name: '曾亚', age: 18};
const obj2 = {name: '罗光武', age: 20};
// vue3数据劫持
const handler = {
    get: function (obj, prop) {
        console.log(`正在对${prop}执行取值操作！`);
        return obj[prop];
    },
    set: function (obj, prop, value) {
        console.log('Proxy', obj, prop, value);
        console.log(`正在对${prop}执行赋值操作！` );
        obj[prop] = value;
        return true;
    }  
}
const person1 = new Proxy (obj2, handler);
person1.name = '徐林飞';
console.log(person1.name);



// Vue数据劫持
const Observer = function(data) {
// 循环修改为每个属性添加get set
    for (let key in data) {
        defineReactive(data, key, data[key]);
    }
}
const defineReactive = (obj, key, value) => { 
    // 重新定义对象上的属性，并添加get，set 读写拦截。
    Object.defineProperty(obj, key, {
        get() { // 在get调用收集器，用收集当前熟悉和watcher中的关系
            console.log(`正在对${key}执行取值操作！`);
            return val;
        },
        set(newVal) { // 在set中，数据发生变更后，通知依赖收集器， 然后更新需要更新的watcher
            console.log(`正在对${key}执行赋值操作！` );
            value = newVal;
        }
    });
}
const person2 = obj1;
Observer(person2);
person2.age = 25;