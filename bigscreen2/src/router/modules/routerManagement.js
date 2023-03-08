/*
 * @Author: lvlongfei
 * @Date: 2021-05-10 14:43:52
 * @Description: 路由管理模块router.js
 */

import Layout from '@/layout'
import ForRouter from '@/layout/ForRouter.vue'

const orderTest = {
  path: '/routerManagement',
  name: '/routerManagement',
  redirect: 'faceChannelManagement',
  component: Layout,
  meta: {
    title: '路由管理',
    icon: 'menu'
  },
  children: [
    {
      path: '/faceChannelManagementP',
      name: 'faceChannelManagementp',
      meta: { title: '人脸渠道管理', icon: 'menuSon' },
      component: ForRouter,
      children: [
        {
          path: '/faceChannelManagement',
          component: () => import('@/views/business/routerManagement/faceChannelManagement'),
          name: 'faceChannelManagement',
          meta: { title: '人脸渠道管理', icon: 'menuSon' }
        },
        {
          path: '/faceChannelDetail',
          component: () => import('@/views/business/routerManagement/faceChannelManagement/details'),
          name: 'faceChannelDetails',
          hidden: true,
          meta: { title: '人脸渠道信息', icon: 'menuSon' }
        }
      ]
    },
    {
      path: '/deviceModelManagementP',
      name: 'deviceModelManagementP',
      meta: { title: '设备型号管理', icon: 'menuSon' },
      component: ForRouter,
      children: [
        {
          path: '/deviceModelManagement',
          component: () => import('@/views/business/routerManagement/deviceModelManagement'),
          name: 'deviceModelManagement',
          meta: { title: '设备型号管理', icon: 'menuSon' }
        },
        {
          path: '/deviceModelDetail',
          component: () => import('@/views/business/routerManagement/deviceModelManagement/details'),
          name: 'deviceModelDetails',
          hidden: true,
          meta: { title: '设备型号信息', icon: 'menuSon' }
        }
      ]
    },
    {
      path: '/routerConfigP',
      name: 'routerConfigP',
      meta: { title: '路由配置', icon: 'menuSon' },
      component: ForRouter,
      children: [
        {
          path: '/routerConfig',
          component: () => import('@/views/business/routerManagement/routerConfig'),
          name: 'routerConfig',
          meta: { title: '路由配置', icon: 'menuSon' }
        },
        {
          path: '/routerConfigDetail',
          component: () => import('@/views/business/routerManagement/routerConfig/details'),
          name: 'routerConfigDetail',
          hidden: true,
          meta: { title: '路由配置信息', icon: 'menuSon' }
        }
      ]
    }
  ]
}

export default orderTest
