
import { eventBinder } from "./Event";
import { getByPath } from "./Utils";

export default function render($el, vm) {
    const nodes = $el.children;
    Array.prototype.forEach.call(nodes, (el) => {
        if (el.children.length > 0) {
            render(el, vm); //? 递归渲染子节点
        } else {
            renderTemplate(vm, el);
        }
    });
}

function renderTemplate(vm, el) {
    renderData(vm, el); // 绑定数据
    renderEvent(vm, el); // 绑定事件
    renderVModel(vm, el); // 渲染DOM
}

//? 将{{}}里的数据渲染
function renderData(vm, el) {
    const nodeText = el.textContent;
    const regexp = /\{\{(\s*)(?<data>.+?)(\s*)\}\}/g;
    if (regexp.test(nodeText)) {
        return nodeText.replace(regexp, (...arg) => {
            const groups = JSON.parse(JSON.stringify(arg.pop()));
            //! 将这个数据相对于vm的位置储存进dep，每次dep收到更新时触发回调
            vm.$watch(groups.data, (newValue) => {
                el.textContent = newValue;
            });
            el.textContent = getByPath(vm, groups.data);
        });
    }
}

//? 放入原生事件，用字典储存
const OrangeEvents = { click: Symbol() };
function renderEvent(vm, el) {
    const regexp = /(?<eName>(?<=@|(v-on:))\S+?)(=")(?<event>\S+?(?="))/g;

    for (const result of el.outerHTML.matchAll(regexp)) {
        const groups = result.groups;
        if (OrangeEvents[groups.eName]) {
            el.addEventListener(groups.eName, vm.$methods[groups.event]);
        } else {
            eventBinder.on(groups.eName, vm.$methods[groups.event]);
        }
    }
}

//? 解析v-model
function renderVModel(vm, el) {
    const regexp = /(?<=v-model=")(.+?)(?=")/g;
    let result;
    if ((result = el.outerHTML.match(regexp))) {
        el.value = getByPath(vm, result[0]);
        vm.$watch(result[0], (newValue) => {
            el.value = newValue;
        });
        el.addEventListener("input", (e) => { // 实现双向绑定
            vm[result[0]] = e.target.value;
        });
    }
}
