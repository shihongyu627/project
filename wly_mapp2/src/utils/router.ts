import Taro from '@tarojs/taro';

const dealUrl = (url: string, params?: { [key: string]: any }): string => {
  if (!url.includes('/')) {
    url = `/pages/${url}/index`; // url支持传入文件名
  }
  // 跳转参数以对象形式传入，自动拼接参数
  params &&
    Object.keys(params).forEach((key, index) => {
      if (index === 0 && !url.includes('?')) {
        url += '?';
      }
      let value = params[key];
      if (value instanceof Object) {
        value = JSON.stringify(value);
      }
      const base = `&${key}=${value}`;
      url += base;
    });
  return url;
};

const routerUtil = {
  /**
   * 以文件名和对象形式传参，进行路由跳转
   * @param url 文件夹名
   * @param params object传参
   * @param replace 是否替换当前页面
   * @returns {Promise<boolean>}
   */
  goto: async (
    url: string,
    params?: { [key: string]: any },
    replace?: boolean,
  ) => {
    // 处理参数
    url = dealUrl(url, params);
    try {
      if (replace) {
        await Taro.redirectTo({ url });
      } else {
        await Taro.navigateTo({ url });
      }
      return true;
    } catch (e) {
      console.log('e', e);
      try {
        await Taro.switchTab({ url });
        return true;
      } catch (error) {
        console.log('error', error);
        return false;
      }
    }
  },
  // 返回
  goBack: (delta = 1) => {
    Taro.navigateBack({
      delta,
    });
  },
  // 关闭其余页面前往目标页面
  closeAllTo: async (url: string, params?: any) => {
    url = dealUrl(url, params);
    // 目标页为tab页时调用switchTab
    try {
      await Taro.reLaunch({ url });
      return true;
    } catch (e) {
      try {
        await Taro.switchTab({ url });
        return true;
      } catch (error) {
        console.log('error', error);
        return false;
      }
    }
  },
};

export default routerUtil;
