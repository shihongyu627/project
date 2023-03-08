/*
 * @Author: lvlongfei
 * @Date: 2021-05-13 14:23:52
 * @Description: 日志审计模块router.js
 */

import Layout from '@/layout'
import ForRouter from '@/layout/ForRouter.vue'

const orderTest = {
  path: '/logAudit',
  name: '/logAudit',
  redirect: 'faceChannelManagement',
  component: Layout,
  meta: {
    title: '日志审计',
    icon: 'menu'
  },
  children: [
    {
      path: '/logQueryP',
      name: 'logQueryP',
      meta: { title: '日志查询', icon: 'menuSon' },
      component: ForRouter,
      children: [
        {
          path: '/logQuery',
          component: () => import('@/views/business/logAudit/logQuery'),
          name: 'logQuery',
          meta: { title: '日志查询', icon: 'menuSon' }
        }
      ]
    }
  ]
}

export default orderTest
