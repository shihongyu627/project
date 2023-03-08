import Taro from '@tarojs/taro';

import {BaseResponse, Http_Result} from '@/interface/base';
import handleRequest from "@/utils/handleRequest";
import {useEffect, useState} from "react";
import {Toast} from "@/utils/toast";
import {Cache, CacheKey} from "@/utils/cache";

export const DEFAULT_TIP_MESSAGE = '请求失败，请刷新重试';

/**
 * 错误处理
 * @param {Object} data 请求返回的信息
 */
export function handleError(data) {
  const message = data.message || DEFAULT_TIP_MESSAGE;
  Toast.info(message);
}

const request = (options) => {
  const {hideError, ...other} = options;
  const token = Cache.get(CacheKey.TOKEN);
  return new Promise<BaseResponse>((resolve, reject) => {
    Taro.request({
      timeout: 5000,
      // mode: 'cors',
      success(res) {
        const { data } = res;
        if (res.statusCode === 200 && data.code == Http_Result.SUCCESS) {
          resolve(data)
        } else {
          !hideError && handleError(data);
        }
      },
      fail(err) {
        // Taro.atMessage({ message: DEFAULT_TIP_MESSAGE, type: 'error' });
        reject(err);
        // for debug
        console.log(err);
      },
      ...other,
      header: {
        ...options.header,
        'content-type': 'application/json', // 默认值
        Authorization: token,
      },
    });
  });
};

export default request;

export const post = <T>(url: string, data?: {[key: string]: any}, loading?: boolean) =>
  handleRequest<T>({request : () => request({url, data, method: 'post'}), loading})

export const get = <T>(url: string, data?: {[key: string]: any}, loading?: boolean, hideError?: boolean) =>
  handleRequest<T>({request : () => request({url, data, method: 'get', hideError}), loading})

export const useRequest = <T>(r: (f?: any) => Promise<T | null>): [T | null, (p: { start: any; end: any }) =>void] => {
  const [data, setData] = useState<T | null>(null)
  const initData = async (f?: any) => {
    const resp = await r(f);
    setData(resp);
  }
  useEffect(() => {
    initData();
  }, [])
  return [data, initData]
}

export const upload = (options) => {
  const token = Cache.get(CacheKey.TOKEN);
  return new Promise<any>((resolve, reject) => {
    Taro.uploadFile({
      name: 'file',
      success(res) {
        resolve(res)
      },
      fail(err) {
        // Taro.atMessage({ message: DEFAULT_TIP_MESSAGE, type: 'error' });
        reject(err);
        // for debug
        console.log(err);
      },
      header: {
        ...options.header,
        // 'content-type': 'application/json', // 默认值
        Authorization: token,
      },
      ...options,
    });
  });
};

export const uploadImage = <T>(url: string, filePath, fileName, loading?: boolean) =>
  handleRequest<T>({request : () => upload({url, filePath, fileName}), loading})

