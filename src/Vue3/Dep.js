import { nextTick } from "./Utils";

/**
 * @description 收集data数据模型的依赖依赖，即收集观察data数据的集合，一旦数据改变则通知观察者。
 * @author （zengya）
 * @date 23/08/2021
 * @export
 * @class Dep
 */
export default class Dep {
    constructor() {
        this.watchers = [];
        this.lock = true;
    }
    add(watcher) { // 添加观察者
        this.watchers.push(watcher);
    }
    notify() {
        //? 放入微任务队列，只要触发一次notify就不再触发，在微任务里更新视图，这样所有数据都更新后再触发更新
        if (this.lock) {
            this.lock = false;
            nextTick(() => {
                this.watchers.forEach((watcher) => {
                    watcher.update(); //? 用watcher实例的update更新视图
                });
            });
            nextTick(() => {
                this.lock = true;
            });
        }
    }
}
