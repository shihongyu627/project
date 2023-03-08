// 加载url
import { router } from '../router/index';
import ViewUI from 'view-design'
// url == router
var url = {
    // 加载
    push: function(config) {
        console.log(config);

        router.app.$router.push(config) //config获取name: "spot_add"以及query中的action
    },
    // 弹出框加载
    modal: function(config) {
        // // router.app.$router.push(config)
        // ViewUI.Modal.confirm({
        //     render: (h) => {
        //         return h('div', {}, [
        //             h('router-link', {
        //                 props: config
        //             }),
        //             // h('router-view', {
        //             //     props: {
        //             //         name: 'modal'
        //             //     }
        //             // }),
        //         ])
        //     }
        // })
    },
    // 替换
    replace: function(config) {
        router.app.$router.replace(config);
    },
    // 打开
    open: function(name) {
        $utils.view.openNewPage(router.app, name);
        router.app.$router.push({
            name: name
        });
    },
    // 跳转
    go: function(n) {
        router.app.$router.go(n)
    },
    // 参数
    query: function() {
        return router.app.$route.query
    }
}

export default url