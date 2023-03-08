export default {
  pages: [
    "pages/tabbar/index/index", //首页
    "pages/loading/index", //加载页面
    "pages/richText/index", //富文本
    "pages/about/index", //关于我们
    "pages/aboutApp/index", //关于应用
    "pages/auth/index", //微信登录
    // "pages/property/home/index", //物业首页
    "pages/tabbar/news/index" //消息列表
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  tabBar: {
    color: "#D9D9D8",
    selectedColor: "#C99E56",
    backgroundColor: "#ffffff",
    borderStyle: "white",
    list: [
      {
        pagePath: "pages/tabbar/index/index",
        iconPath: "./assets/tabbar/home.png",
        selectedIconPath: "./assets/tabbar/home_active.png",
        text: "我的"
      },
      {
        pagePath: "pages/tabbar/news/index",
        iconPath: "./assets/tabbar/news.png",
        selectedIconPath: "./assets/tabbar/news_active.png",
        text: "消息"
      }
    ]
  },
  subpackages: [
    {
      root: "pages/butler/home/",
      pages: [
        "customer/index", //我的客户
        "agreement/order/index", //合同订单状态整合一个页面
        "agreement/list/index", //合同列表
        "agreement/info/index", //合同详情
        "template/list/index", //合同模板
        "template/info/index", //合同模板详情
        "takeLook/index", //预约带看
        "takeLook/info/index", //预约带看详情
        "InitiateSign/index", //发起签约
        "house/index", //选择房源
        "userList/index", //选择用户
        "trade/index", //交易流水
        "InvoiceInfo/index", //发票详情
        "rentInfo/index", //退租详情
        "view/record/index", //预约记录
        "view/info/index" //预约详情
      ]
    },
    {
      root: "pages/butler/news/",
      pages: [
        "info/index" //报修详情
      ]
    },
    {
      root: "pages/property/",
      pages: [
        "rentInfo/index", //退租详情
        "home/index", //物业首页
        "list/index", //预约记录
        "info/index", //物业详情
        "create/index" //处理结果
      ]
    }
  ],
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于小程序位置接口的效果展示" // 高速公路行驶持续后台定位
    }
  },
  rn: {
    screenOptions: {
      // 设置页面的options，参考https://reactnavigation.org/docs/stack-navigator/#options
      shadowOffset: { width: 0, height: 0 },
      borderWidth: 0,
      elevation: 0,
      shadowOpacity: 1,
      borderBottomWidth: 0,
      cardStyle: { elevation: 1 },
      gestureEnabled: true,
      animationEnabled: true,
      detachPreviousScreen: false
    }
  }
};
