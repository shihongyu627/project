import Vue from 'vue';
import * as Promise from "bluebird";
import "babel-polyfill"
import ViewUI from 'view-design'
import { router } from './router/index';
import { appRouter } from './router/router';
import store from './store';
import App from './app.vue';
import './theme/index.less';

// Vue全局配置
Vue.config.silent = true
Vue.use(ViewUI, {
    transfer: true,
    size: 'default'
});

// 注册全局组件
import './views/components/common';
// 工具
import './utils'
// 表单方法
import './views/components/func/form'

// 自定义权限指令，显示可操作组件
Vue.directive('auth', {
    bind: function(el, binding, vnode) {
        // 用户权限表
        const rules = $utils.data.get('auth', 'auths') || [];
        // console.log('v-auth', binding.value, binding )
        for (let i = 0; i < rules.length; i++) {
            const item = rules[i];
            // 空放行
            if (!binding.value) {
                return true
            }
            if (binding.value && (binding.value == item.url)) {
                // 放行 显示组件
                // console.log('v-auth', binding.value, 'true' )
                return true
            }
        }
        // console.log('v-auth', binding.value, 'remove' )
        // 移除组件
        if (el) {
            el.style.display = "none";
        }
        if (el.parentNode) {
            el.parentNode.removeChild(el)
        }
    }
})

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted() {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        // this.$store.commit('setOpenedList');
        // this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    },
    created() {
        // let tagsList = [];
        // appRouter.map((item) => {
        //     if (item.children.length <= 1) {
        //         tagsList.push(item.children[0]);
        //     } else {
        //         tagsList.push(...item.children);
        //     }
        // });
        // this.$store.commit('setTagsList', tagsList);
    }
});