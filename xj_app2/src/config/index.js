// 全局常量配置 //https://weixiu.kafukeji.com 测试
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

// 基准url
global.base_host = "https://xunjian.kafukeji.com";

global.app_host = global.base_host + "";
global.api_host = global.base_host + "";
global.img_host = "https://xunjian.kafukeji.com";
global.wap_base = global.base_host + "/wap/index/app/#";
global.wap_host = global.base_host + "/wap/index/wap/#";
// global.wap_base = global.base_host1 + '#'
// global.wap_host = global.base_host1 + '#'
global.download_url = "https://www.pgyer.com/WB4V";
// 隐私政策
global.privacy_url = global.base_host + "/api/login/registerAgreementHtml";
// 代理须知
global.daili_url = global.base_host + "/api/home/aboutDailiHtml";
// 招商政策
global.zhaoshang_url = global.base_host + "/api/home/aboutZhaoshangHtml";
// 关于我们
global.we_url = global.base_host + "/api/home/aboutWeHtml";
// 关于品牌
global.brand_url = global.base_host + "/api/home/aboutBrandHtml";
// 授权书
global.authbook_url = global.base_host + "/api/home/authBookHtml";

// 参数
global.company = "";
global.vip_company = "";
global.company_title = "";

// 微信配置
// global.wechat_key = ''
global.wechat_appid = appConfig.modules?.wechat?.config?.appid || "";
global.wechat_universalLink =
  appConfig.modules?.wechat?.config?.universallink || "";
global.wechat_gh = appConfig.modules?.wechat?.config?.gh || "";

// 热更新配置
global.codepush_key_ios = appConfig.modules?.codepush?.config?.ios?.key || "";
global.codepush_key_android =
  appConfig.modules?.codepush?.config?.android?.key || "";

// 极光推送
global.jpush_appkey = appConfig.modules?.jpush?.config?.appkey || "";
global.jpush_channel = appConfig.modules?.jpush?.config?.channel || "";

// 图标素材
// global.iconLogo = require('../assets/img/logo.png')
// global.iconLogoLine = require('../assets/img/logo_line.png')
export default global;
