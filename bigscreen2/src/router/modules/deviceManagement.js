/*
 * @Author: lvlongfei
 * @Date: 2021-09-08 15:58:32
 * @Description: 终端管理模块router.js
 */

import Layout from '@/layout'
import ForRouter from '@/layout/ForRouter.vue'

const deviceManagement = {
  // path: '/deviceManagement',
  path: '',
  name: '/deviceManagement',
  redirect: 'deviceMonitor',
  component: Layout,
  meta: {
    title: '终端管理',
    icon: 'menu'
  },
  children: [
    {
      path: '/deviceMonitorP',
      name: 'deviceMonitorP',
      meta: { title: '终端监控', icon: 'menuSon' },
      component: ForRouter,
      children: [
        {
          path: '/deviceMonitor',
          component: () => import('@/views/business/deviceManagement/deviceMonitor'),
          name: 'deviceMonitor',
          meta: { title: '终端监控', icon: 'menuSon' }
        },
        {
          path: '/deviceMonitorDetail',
          component: () => import('@/views/business/deviceManagement/deviceMonitor/details'),
          name: 'deviceMonitorDetails',
          hidden: true,
          meta: { title: '终端监控详情', icon: 'menuSon' }
        }
      ]
    }
  ]
}

export default deviceManagement
