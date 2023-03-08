/*
 * @Author: your name
 * @Date: 2021-04-20 14:43:52
 * @LastEditTime: 2021-04-27 18:12:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /gitee-ai-platform/src/permission.js
 */
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, setToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false })
const whiteList = ['/login', '/auth-redirect']
var roles = []
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          roles = ['admin']
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      roles = []
      setToken('Admin-token')
      next({ ...to, replace: true })
      NProgress.done()
      // next(`/home?redirect=${to.path}`)
      // NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
