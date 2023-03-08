/**
 * 全局存储
 */
import Taro from '@tarojs/taro';

export enum CacheKey {
  USER_INFO = 'user_info',
  ROOM_ITEM = 'room_item',
  SEARCH_KEY = 'search_key',
  JSSDK_CONFIG = 'jssdk_config',
  RICH = 'rich',
  TOKEN = 'token',
  LNG_LAT = 'lng_lat',
}

export class Cache {
  static get(key: CacheKey) {
    return Taro.getStorageSync(key);
  }

  static set(key: CacheKey, data: any, isSync = false) {
    if (isSync) {
      Taro.setStorage({ key, data });
    } else {
      Taro.setStorageSync(key, data);
    }
  }

  static remove(key: CacheKey) {
    Taro.removeStorageSync(key);
  }
}
