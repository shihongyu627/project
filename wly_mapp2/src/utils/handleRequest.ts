import {BaseResponse} from '@/interface/base';
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';

// 处理moonPower生成的请求
interface handleRequestProps {
  // moonPower生成的请求
  request: () => Promise<BaseResponse>;
  // 是否loading
  loading?: boolean;
  // 是否处理错误
  handleError?: (error) => void;
  // 返回值KEY默认为data
  respKey?: any;
}

/**
 * loading栈
 */
const loadingList: boolean[] = [];

/**
 * 处理
 * @param params
 */
const handleRequest = async <T>(
  params: handleRequestProps,
): Promise<T | null> => {
  const { loading = true, request, respKey } = params;
  if (loading) {
    !loadingList.length &&
      Taro.showLoading({
        title: 'loading',
        mask: true,
      });
    loadingList.push(loading);
  }
  try {
    const resp = await request();
    return resp[respKey] || resp.data;
  } catch (error) {
    return null;
  } finally {
    loadingList.pop();
    if (!loadingList.length) {
      Taro.hideLoading();
    }
  }
};

/**
 * 页面加载数据初始获取 state data
 * @param params
 */
export const useHandleRequest = <T>(params: handleRequestProps) => {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    initData();
  }, []);
  const initData = async () => {
    const resp = await handleRequest<T>(params);
    setData(resp);
  };
  return { data, initData };
};

export default handleRequest;
