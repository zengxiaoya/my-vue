import Vue from './Vue3/Vue';
// import './example/index' Vue3对比Vue2的响应式
const options =  {
    data() {
        return {
            count: 0
        }
    },
    beforeCreate() {
        console.log('[beforeCreate] ==>', this);
    },
    onMounted() {
        console.log('[onMounted] ==>', this);
    },
    methods: {
        add () {
            this.count++;
        }
    },
}
Vue.createApp(options).mount('#app');