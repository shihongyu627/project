
const ci = require("miniprogram-ci");
const pinfo = require("./project.config.json");

(async () => {
  const project = new ci.Project({
    appid: pinfo.appid,
    type: "miniProgram",
    projectPath: pinfo.miniprogramRoot,
    privateKeyPath: "the/path/to/privatekey",
    ignores: ["node_modules/**/*"]
  });
  const previewResult = await ci.preview({
    project,
    desc: "CI机器人自动生成", // 此备注将显示在“小程序助手”开发版列表中
    setting: {
      es6: true
    },
    qrcodeFormat: "image", // 返回二维码文件的格式 "image" 或 "base64"， 默认值 "terminal" 供调试用
    qrcodeOutputDest: "./weapppreqrcode.jpg",
    onProgressUpdate: console.log
    // pagePath: 'pages/index/index', // 预览页面
    // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
  });
  console.log(previewResult);
})();
