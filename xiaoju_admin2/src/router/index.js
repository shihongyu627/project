import Vue from 'vue'
import VueRouter from 'vue-router'
import $data from '../utils/data'
import Cookies from 'js-cookie'
import config from '../../build/config'
import { routers, otherRouter, appRouter } from './router'

Vue.use(VueRouter)

// 路由配置
//判断生产环境
let basepath = '/'
if (config.env === 'production') {
  basepath = '/admin/'
}
const RouterConfig = {
  // mode: 'history',
  base: basepath,
  routes: routers,
}

export const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  $utils.loading.start()
  $utils.view.title(to.meta.title)
  console.log('router.beforeEach', to, from, next)
  if (Cookies.get('locking') === '1' && to.name !== 'locking') {
    // 判断当前是否是锁定状态
    next({
      replace: true,
      name: 'locking',
    })
  } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
    next(false)
  } else {
    if (!$utils.data.get('auth', 'suid') && to.name !== 'login') {
      // 判断是否已经登录且前往的页面不是登录页
      next({
        name: 'login',
      })
      // } else if ($data.get('auth', 'uname') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
      //     $utils.view.title();
      //     next({
      //         name: 'index_index'
      //     });
    } else if (to.name !== 'error-404' && to.name !== 'index_index' && to.path === '/') {
      // 判断是否存在此路由，name='xxx',path='/'
      next({
        name: 'error-404',
      })
    } else {
      const curRouterObj = $utils.view.getRouterObjByName([otherRouter, ...appRouter], to.name)
      if (curRouterObj && curRouterObj.access !== undefined) {
        // 需要判断权限的路由
        if (curRouterObj.access === parseInt(Cookies.get('access'))) {
          $utils.view.toDefaultPage([otherRouter, ...appRouter], to.name, router, next) // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
        } else {
          next({
            replace: true,
            name: 'error-403',
          })
        }
      } else {
        // 没有配置权限的路由, 直接通过
        $utils.view.toDefaultPage([...routers], to.name, router, next)
      }
    }
  }
})

router.afterEach((to) => {
  console.log('router.afterEach', to)
  // $utils.view.openNewPage(router.app, to.name, to.params, to.query);
  $utils.loading.finish()
  window.scrollTo(0, 0)
  window.document.title = '小驹游乐平台-' + ((to.meta && to.meta.title) || '')
})
