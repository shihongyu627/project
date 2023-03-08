import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import homeRouter from './modules/home' // 主控台
// import routerManagementRouter from './modules/routerManagement' // 路由管理
// import logAuditRouter from './modules/logAudit' // 日志审计
import deviceManagementRouter from './modules/deviceManagement' // 终端管理
import dataAnalyseRouter from './modules/dataAnalyse' // 数据分析
/**
 * 注意:子菜单只在路由子菜单时出现。长度> = 1
 * hidden: true                   如果设置为true，项目将不会显示在侧栏(默认为false)
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果不设置alwaysShow，当项目有多个子路由时，
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置noRedirect将不会在面包屑中重定向
 * name:'router-name'             名称由<keep-alive>(必须设置!!)
 * meta : {
    roles: ['1','2']              控制页面角色(您可以设置多个角色)
    title: 'title'                名称显示在侧栏和面包屑(推荐设置)
    icon: 'svg-name'              图标显示在侧栏中【自定义图标】
    noCache: true                 如果设置为true，页面将不会被缓存(默认为false)
    affix: true                   如果设置为true，固定在面包屑中
    breadcrumb: false             如果设置为false，则该项将隐藏在breadcrumb中(默认为true)
    activeMenu: '/example/list'   如果设置路径，侧栏将突出显示您设置的路径
  }
 */

/**
  * constantRoutes
  *没有权限要求的基页
  *所有角色都可以访问
*/
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/publics/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/publics/login/index'),
    hidden: false
  },
  {
    path: '/bigscreen',
    component: () => import('@/views/bigscreen/index'),
    hidden: false
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/publics/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/publics/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/publics/error-page/401'),
    hidden: true
  }
]

/**
 * 异步路由
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  /**
   * 自定义路由模块
   * 按照业务划分
   *  ***注意***：菜单显示顺序与文件引入顺序显示一致！！！
   **/
  // homeRouter,
  deviceManagementRouter,
  dataAnalyseRouter
  // OCRIDCardRecognitionRouter,
  // routerManagementRouter,
  // logAuditRouter
  // 404 页面必须放在最后!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // 需要服务支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 细节见: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由器
}

export default router
