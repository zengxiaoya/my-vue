import Dep from "./Dep";
const dep = new Dep(); // 初始化依赖收集器
/**
 * @description 实现响应式的类
 * @author （zengya）
 * @date 23/08/2021
 * @export
 * @class Observer
 */
export default class Observer {
    /**
     * Creates an instance of Observer.
     * @description 构造函数将接收Vue实例并本地化，方便
     * @author （zengya）
     * @date 23/08/2021
     * @param {*} vm
     * @memberof Observer
     */
    constructor(vm) { 
        this.vm = vm;
    }
    observeData() { // 调用响应式方法
        const data = this.vm.$data;
        for (const key in data) {
            data[key] = this.ref(data[key]);
        }
    }
    
    /**
     * @description 将数据转化为响应式
     * @author （zengya）
     * @date 23/08/2021
     * @param {*} data
     * @return {*}  
     * @memberof Observer
     */
    reactive(data) {
        //? 如果对象里还有对象，递归实现响应式
        for (const key in data) {
            if (typeof data[key] === "object") {
                data[key] = this.reactive(data[key]); // 递归调用
            }
        }
        return new Proxy(data, { // 劫持数据
            /**
             * @description 重写get方法
             * @author （zengya）
             * @date 23/08/2021
             * @param {*} target
             * @param {*} key
             * @return {*}  
             */
            get(target, key) {
                window.target && dep.add(window.target); // 
                window.target = null; //? 将watch实例保存后删除
                return Reflect.get(target, key);
            },
            /**
             * @description 重写set方法，并在修改对象属性之后发布通知，修改Vnode
             * @author （zengya）
             * @date 23/08/2021
             * @param {*} target
             * @param {*} key
             * @param {*} value
             * @return {*}  
             */
            set(target, key, value) {
                target._isref
                    ? Reflect.set(target, "value", value)
                    : Reflect.set(target, key, value);

                dep.notify();
                return true;
            },
        });
    }
    /**
     * @description 
     * @author （zengya）
     * @date 23/08/2021
     * @param {*} data
     * @return {*}  
     * @memberof Observer
     */
    ref(data) {
        if (typeof data != "object") { // 如果是基础的类型会被包装成对象，再进行代理
            data = {
                value: data,
                _isref: true,
                toSting() {
                    return this.value;
                },
            };
        }
        return this.reactive(data);
    }
}
