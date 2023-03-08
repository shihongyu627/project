const path = require("path");

const config = {
  projectName: "taro3_react",
  date: "2020-8-10",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 1 / 2
  },
  sourceRoot: "src",
  outputRoot: `dist`,
  plugins: [],
  defineConstants: {},
  alias: {
    "@styles": path.resolve(__dirname, "..", "src/styles"),
    "@assets": path.resolve(__dirname, "..", "src/assets"),
    "@component": path.resolve(__dirname, "..", "src/component"),
    "@utils": path.resolve(__dirname, "..", "src/utils"),
  },
  copy: {
    patterns: [],
    options: {}
  },
  framework: "react",
  terser: {
    enable: true
  },
  mini: {
    imageUrlLoaderOption: {
      limit: 5000,
      name: "static/images/[name].[hash].[ext]"
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      }
    }
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    esnextModules: ["@antmjs/vantui"],
    router: {
      mode: "hash",
      customRoutes: {
        "/pages/index/index": "/"
      }
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      }
    }
  },
  rn: {
    appName: "rnshell",
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      // url: {
      //   enable: true,
      //   config: {
      //     limit: 1024 // 设定转换尺寸上限
      //   }
      // },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      }
    },
    // output: {
    //   ios: 'dist/ios/bundle/main.jsbundle',
    //   iosAssetsDest: 'dist/ios/bundle',
    //   iosSourcemapOutput:'',
    //   android: 'dist/android/bundle/index.android.bundle',
    //   androidAssetsDest: 'dist/android/bundle',
    //   androidSourcemapOutput: ''
    // },
    // rn打包配置
    output: {
      ios: "app/ios/main.jsbundle",
      iosAssetsDest: "app/ios",
      iosSourcemapOutput: "",
      android: "app/android/app/src/main/assets/index.android.bundle",
      androidAssetsDest: "app/android/app/src/main/res",
      androidSourcemapOutput: ""
    }
  }
};

module.exports = function(merge) {
  console.log("NODE_ENV", process.env.NODE_ENV);
  if (process.env.MY_ENV === "online") {
    return merge({}, config, require("./online"));
  }
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  if (process.env.NODE_ENV == "codepush") {
    return merge({}, config, require("./codepush"));
  }
  return merge({}, config, require("./prod"));
};
