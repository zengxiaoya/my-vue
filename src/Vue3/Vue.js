import Observer from "./Observer";
import render from "./Render";
import emit from './Event'
import { nextTick, getEl } from "./Utils";
import Watcher from './Watcher'
/**
 * @description  Vue类
 * @author （zengya）
 * @date 23/08/2021
 * @export
 * @class Vue
 */
export default class Vue {
    constructor () {
        this.$el = 'document';
        this.$data = Object.create(null); // 创建纯对象，使用Object.create(null)创建的对象，将不会拥有Object.prototype的属性
        this.$methods = Object.create(null);
        this.$onMounted = Object.create(null); // 创建纯对象
        this.$emit = emit; // 自定义事件
        this.$nextTick = nextTick; // 基于微事务的函数执行器
        this.$options = Object.create(null);
        this.$watch = function (key, cb) {
            new Watcher(this, key, cb);
        };
    }

    static createApp (options) {
        // Proxy作用于为目标对象提供代理服务，可以设置对目标对象getter, setter的重写，起到劫持对象属性的作用，并返回代理后的目标对象
        const vm = new Proxy(new Vue(), {
            /**
             * @description 劫持Vue实例数据
             * @author （zengya）
             * @date 23/08/2021
             * @param {*} target
             * @param {*} p
             */
            get(target, p) {
                if (Reflect.get(target, p)) { // 用Reflect(映射) API去获取目标值，判断目标值是否存在。
                    return Reflect.get(target, p);
                } else {
                    return target.$data[p]._isref ? target.$data[p].value : target.$data[p]; // 判断是否是基础值
                }
            },
            set(target, p, value) {
                if (target[p]) {
                    Reflect.set(target, p, value);
                } else if (target.$data[p]?._isref) {
                    Reflect.set(target.$data[p], "value", value);
                } else {
                    Reflect.set(target.$data, p, value);
                }
                return true;
            }
        });
        options.beforeCreate?.call(vm);  // 调用beforeCreate生命周期钩子，因为在静态方法里调用，所以需要绑定beforeCreate的this为vm(Vue实例)
        vm.$data = options.data.call(vm); // 将 data挂到实例中
        new Observer(vm).observeData(); // 将data的数据转为响应式
        for (const key in options.methods) { // 绑定methods并修改Methods函数的this的指向为Vue实例
            vm.$methods[key] = options.methods[key].bind(vm);
        }
        options.onCreated?.call(vm); // 调用onCreated生命周期，并改变this的指向为Vue实例
        vm.$onMounted = options.onMounted;
        return vm;
    }
    /**
     * @description  挂载DOM到节点上
     * @author （zengya）
     * @date 23/08/2021
     * @param {*} elment
     * @return {*}  
     * @memberof Vue
     */
    mount(el) { //
        this.$el = getEl(el);
        //todo 渲染数据
        render(this.$el, this); // 调用渲染函数
        this.$onMounted();
        return this; // 返回Vue实例
    }
}