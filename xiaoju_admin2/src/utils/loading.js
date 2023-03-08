import ViewUI from 'view-design'
import store from '../store';
// 加载
var loading = {
    // 显示
    show: function (text = '加载中') {
        ViewUI.Spin.show({
            render: (h) => {
                return h('div', [
                    h('Icon', {
                        'class': 'demo-spin-icon-load',
                        props: {
                            type: 'load-c',
                            size: 18
                        }
                    }),
                    h('div', text)
                ])
            }
        });
        setTimeout(() => {
            ViewUI.Spin.hide();
        }, 60000);
        // store.dispatch('setLoadingStatus', { state: true, text: text })
    },
    // 隐藏
    hide: function () {
        ViewUI.Spin.hide();
        // store.dispatch('setLoadingStatus', false)
    },
    // loadingBar开始
    start: function () {
        ViewUI.LoadingBar.start();
        // store.dispatch('setLoadingStatus', { state: true, text: text })
    },
    // loadingBar结束
    finish: function () {
        ViewUI.LoadingBar.finish();
        // store.dispatch('setLoadingStatus', false)
    },
    // 右边card显示loading
    cardshow: function () {
        store.commit('setCardLoading', true)
    },
    // 右边card隐藏loading
    cardhide: function () {
        store.commit('setCardLoading', false)
    },

}

export default loading
