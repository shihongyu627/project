/*
 * @Author: your name
 * @Date: 2019-12-13 18:41:27
 * @LastEditTime: 2021-04-22 10:18:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /SunSea-Github/src/router/modules/home.js
 */
/**
 * 首页
 */
import Layout from '@/layout'

const home = {
  path: '',
  component: Layout,
  redirect: 'home',
  children: [
    {
      path: 'home',
      component: () => import('@/views/business/home/index'),
      name: 'Home',
      meta: { title: '监控预警', icon: 'menu', affix: true }
    }
  ]
}

export default home
