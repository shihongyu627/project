/*
 * @Author: lvlongfei
 * @Date: 2021-09-08 15:33:52
 * @Description: 数据分析模块router.js
 */

import Layout from "@/layout";
import ForRouter from "@/layout/ForRouter.vue";

const dataAnalyse = {
  path: "/dataAnalyse",
  name: "/dataAnalyse",
  redirect: "deployData",
  component: Layout,
  meta: {
    title: "数据分析",
    icon: "menu"
  },
  children: [
    {
      path: "/deployDataP",
      name: "deployDataP",
      meta: { title: "部署数据分析", icon: "menuSon" },
      component: ForRouter,
      children: [
        {
          path: "/deployData",
          component: () => import("@/views/business/dataAnalyse/deployData"),
          name: "deployData",
          meta: { title: "部署数据分析", icon: "menuSon" }
        },
        {
          path: "/deployDataDetail",
          component: () =>
            import("@/views/business/dataAnalyse/deployData/details/index"),
          name: "deployDataDetails",
          // hidden: true,
          meta: { title: "部署排行药店入口", icon: "menuSon" }
        },
        {
          path: "/deployDataDetail1",
          component: () =>
            import("@/views/business/dataAnalyse/deployData/details/index1"),
          name: "deployDataDetails",
          // hidden: true,
          meta: { title: "部署排行", icon: "menuSon" }
        }
      ]
    },
    {
      path: "/serviceDataP",
      name: "serviceDataP",
      meta: { title: "服务数据分析", icon: "menuSon" },
      component: ForRouter,
      children: [
        {
          path: "/serviceData",
          component: () => import("@/views/business/dataAnalyse/serviceData"),
          name: "serviceData",
          meta: { title: "服务数据分析", icon: "menuSon" }
        },
        {
          path: "/serviceDataDetail",
          component: () =>
            import("@/views/business/dataAnalyse/serviceData/details"),
          name: "serviceDataDetails",
          hidden: true,
          meta: { title: "服务数据分析详情", icon: "menuSon" }
        }
      ]
    },
    {
      path: "/activeDataP",
      name: "activeDataP",
      meta: { title: "激活数据分析", icon: "menuSon" },
      component: ForRouter,
      children: [
        {
          path: "/activeData",
          component: () => import("@/views/business/dataAnalyse/activeData"),
          name: "activeData",
          meta: { title: "激活数据分析", icon: "menuSon" }
        },
        {
          path: "/activeDataDetail",
          component: () =>
            import("@/views/business/dataAnalyse/activeData/details"),
          name: "activeDataDetails",
          hidden: true,
          meta: { title: "激活数据分析详情", icon: "menuSon" }
        }
      ]
    },
    {
      path: "/dealDataP",
      name: "dealDataP",
      meta: { title: "交易数据分析", icon: "menuSon" },
      component: ForRouter,
      children: [
        {
          path: "/dealData",
          component: () => import("@/views/business/dataAnalyse/dealData"),
          name: "dealData",
          meta: { title: "交易数据分析", icon: "menuSon" }
        },
        {
          path: "/dealDataDetail",
          component: () =>
            import("@/views/business/dataAnalyse/dealData/details"),
          name: "dealDataDetails",
          hidden: true,
          meta: { title: "交易数据分析详情", icon: "menuSon" }
        }
      ]
    },
    {
      path: "/promotionDataP",
      name: "promotionDataP",
      meta: { title: "活动运营数据分析", icon: "menuSon" },
      component: ForRouter,
      children: [
        {
          path: "/promotionData",
          component: () => import("@/views/business/dataAnalyse/promotionData"),
          name: "promotionData",
          meta: { title: "活动运营数据分析", icon: "menuSon" }
        },
        {
          path: "/promotionDataDetail",
          component: () =>
            import("@/views/business/dataAnalyse/promotionData/details"),
          name: "promotionDataDetails",
          hidden: true,
          meta: { title: "活动运营数据分析详情", icon: "menuSon" }
        }
      ]
    }
  ]
};

export default dataAnalyse;
