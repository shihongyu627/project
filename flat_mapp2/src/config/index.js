// 全局常量配置 //https://weixiu.kafukeji.com 测试
//第一套https://www.huakangmed.com
//第二套https://jingzhongxin.huakangmed.com
// 基准url
// global.base_host = "https://jingzhongxin.huakangmed.com";
// global.img_host = "https://jingzhongxin.huakangmed.com";
// global.api_host = global.base_host + "";
// global.href_url = "https://jingzhongxin.huakangmed.com/mapp";
// 应用配置
import AppJson from "../../app.json";

const appConfig = AppJson.config || {};
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
    break;
}
// 参数
global.company = "江苏恒诺科技服务有限公司";
global.vip_company = "江苏恒诺科技服务有限公司";
global.company_title = "象寓管家";
global.seo_description = "象寓，是一家为青年人才提供长租服务和休闲空间的品牌公寓，同时也是集青年公寓和青创中心为一体的现代青年人才发展社区。";
// 热更新配置
global.codepush_key_ios = appConfig.modules?.codepush?.config?.ios?.key || "";
global.codepush_key_android =
  appConfig.modules?.codepush?.config?.android?.key || "";

// 极光推送
global.jpush_appkey = appConfig.modules?.jpush?.config?.appkey || "";
global.jpush_channel = appConfig.modules?.jpush?.config?.channel || "";
export default global;
