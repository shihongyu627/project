export default {
  pages: [
    "pages/tabbar/index/index", //首页
    "pages/auth/index", //登录
    "pages/webView/index", //webView
    "pages/forgetPassword/index", //忘记密码
    "pages/tabbar/phonebook/index", //商学院
    "pages/richText/index", //公共页面富文本
    "pages/tabbar/user/index", //我的
    "pages/tabbar/statistics/index", //统计
    "pages/tabbar/news/index" //消息
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  tabBar: {
    color: "#999999",
    selectedColor: "#0A75E8",
    backgroundColor: "#F5F5F5",
    borderStyle: "white",
    list: [
      {
        pagePath: "pages/tabbar/index/index",
        iconPath: "./assets/tabbar/home.png",
        selectedIconPath: "./assets/tabbar/home_active.png",
        text: "首页"
      },
      {
        pagePath: "pages/tabbar/phonebook/index",
        iconPath: "./assets/tabbar/phonebook.png",
        selectedIconPath: "./assets/tabbar/phonebook_active.png",
        text: "通讯录"
      },
      {
        pagePath: "pages/tabbar/statistics/index",
        iconPath: "./assets/tabbar/statistics.png",
        selectedIconPath: "./assets/tabbar/statistics_active.png",
        text: "统计"
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
        selectedIconPath: "./assets/tabbar/user_active.png",
        text: "我的"
      }
    ]
  },
  subpackages: [
    {
      root: "pages/user/",
      pages: [
        "project/index", //我的项目以及街道
        "feedBack/index", //意见反馈
        "about/index", //关于我们
        "aboutApp/index", //关于应用
        "logout/index", //账户注销
        "info/index" //个人资料
      ]
    },
    {
      root: "pages/project/",
      pages: [
        "info/index", //项目详情
        "grade/list/index", //评分明细
        "grade/monthList/index", //评分月份明细
        "grade/info/index", //评分明细
        "create/index", //隐患录用
        "record/index", //隐患记录
        "category/index" //隐患分类
      ]
    },
    {
      root: "pages/record/",
      pages: [
        "list/index", //我的记录
        "create/index", //审核
        "info/index" //隐患记录详情
      ]
    },
    {
      root: "pages/news/",
      pages: [
        "index" //我的消息
      ]
    },
    {
      root: "pages/sign/",
      pages: [
        "index" //签字
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
      detachPreviousScreen: false,
      headerRight: () => null
    }
  }
};
