// 全局常量配置 //https://flat.kafukeji.com 测试
//第一套https://www.huakangmed.com
//第二套https://jingzhongxin.huakangmed.com
// 基准url
// global.base_host = "https://jingzhongxin.huakangmed.com";
// global.img_host = "https://jingzhongxin.huakangmed.com";
// global.api_host = global.base_host + "";
// global.href_url = "https://jingzhongxin.huakangmed.com/mapp";
// 应用配置
import appJson from "../../app.json";

const appConfig = appJson.config || {};

let env = "";
if (process.env.NODE_ENV === "development") {
  env = "production";
}
if (process.env.NODE_ENV === "production") {
  env = "production";
}
switch (env) {
  case "production":
    global.base_host = "https://app.hnxiangyu.net"; //测试  https://flat.kafukeji.com
    global.img_host = "https://app.hnxiangyu.net"; //测试
    global.api_host = global.base_host + "";
    global.href_url = "https://app.hnxiangyu.net/mapp";
    global.download_url = "https://www.pgyer.com/WU6u";
    break;
}
// 参数
global.company = '江苏恒诺科技服务有限公司'
global.vip_company = '江苏恒诺科技服务有限公司'
global.company_title = '象寓'

// 热更新配置
global.codepush_key_ios = appConfig.modules?.codepush?.config?.ios?.key || "";
global.codepush_key_android =
  appConfig.modules?.codepush?.config?.android?.key || "";

//微信配置
global.wechat_appid = appConfig.modules?.wechat?.config?.appid || "";
global.wechat_universalLink = appConfig.modules?.wechat?.config?.universallink  || "";
global.wechat_gh = appConfig.modules?.wechat?.config?.gh  || "";

// 极光推送
global.jpush_appkey = appConfig.modules?.jpush?.config?.appkey || "";
global.jpush_channel = appConfig.modules?.jpush?.config?.channel || "";

export default global;
