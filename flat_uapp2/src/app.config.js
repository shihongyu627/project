export default {
  pages: [
    "pages/tabbar/index/index", //首页
    "pages/auth/index", //微信登录
    "pages/authPhone/index", //手机号登录
    "pages/authSendCode/index", //手机号验证码登录
    "pages/tabbar/user/index", //我的
    "pages/tabbar/news/index", //消息列表
    "pages/homeInfo/index", //房源详情
    "pages/search/index", //搜索
    "pages/kefu/index", //客服
    "pages/ceshi/index", //测试页面
    "pages/richText/index", //富文本页面
    "pages/webView/index", //web页面
    "pages/comment/index", //评论
    "pages/pay/index" //支付订单
    // "pages/device/list/index", //提交预约公共设备记录
    // "pages/clean/record/index", //预约保洁记录
    // "pages/repair/record/index", //预约报修记录
    // "pages/visitor/record/index", //访客记录
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
        text: "首页"
      },
      {
        pagePath: "pages/tabbar/news/index",
        iconPath: "./assets/tabbar/news.png",
        selectedIconPath: "./assets/tabbar/news_active.png",
        text: "消息"
      },
      {
        pagePath: "pages/tabbar/user/index",
        iconPath: "./assets/tabbar/user.png",
        selectedIconPath: "./assets/tabbar/user_acitve.png",
        text: "我的"
      }
    ]
  },
  subpackages: [
    {
      root: "pages/user/",
      pages: [
        "about/index", //关于我们
        "aboutApp/index", //关于应用
        "info/index", //个人资料
        "nickName/index", //修改昵称
        "agreement/list/index", //合同列表
        "agreement/info/index", //合同详情
        "agreement/signAgreement/index", //合同签署详情
        "agreement/testPdf/index", //合同文本详情
        "bill/notice/index", //账单通知
        "bill/history/index", //历史账单
        "admin/index", //联系管家
        "cardInfo/create/index", //身份信息
        "cardInfo/list/index", //身份信息列表
        "wifi/index", //wifi信息
        "doorLock/create/index", // 修改门锁
        "doorLock/list/index", //门锁信息
        "retreatRent/create/index", //我要退租
        "retreatRent/list/index", //退租记录
        "retreatRent/info/index", //记录详情
        "invoice/create/index", //填写发票信息
        "invoice/list/index", //发票管理
        "invoice/info/index", //发票管理详情
        "invoice/success/index", //发票管理
        "lifeCost/create/index", //生活缴费
        "lifeCost/list/index", //生活缴费列表
        "viewRecord/info/index", //预约详情
        "viewRecord/list/index", // 预约记录
        "feedBack/index", //意见反馈
        "dailyAsk/index" //常见问题
      ]
    },
    {
      root: "pages/home/",
      pages: [
        "houseView/create/index", //预约房源
        "houseView/record/index", //预约看房记录
        "houseView/info/index", //预约房源详情
        "houseView/success/index", //预约房源成功页面
        "advList/index", //公告列表
        "clean/list/index", //预约保洁列表
        "clean/info/index", //预约保洁详情
        "clean/create/index", //提交预约保洁
        "repair/create/index", //提交预约报修
        "device/create/index", //提交预约公共设备
        "visitor/create/index" //邀约访客
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
