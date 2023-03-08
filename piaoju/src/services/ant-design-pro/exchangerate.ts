import { urls } from './http';
import requrie from './requrie';

// 汇率列表
export const PjExchangeRate = async (params: any) => {
  const data = {
    ...params,
    pageNo: params.current,
    column: 'mouth',
    order: 'desc',
  };
  try {
    const res = await requrie.onGetload(urls.PjExchangeRate, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 详情查看
export const PjExchangeRateData = async (params: any) => {
  const data = {
    id: params,
  };
  try {
    const res = await requrie.onGetload(urls.PjExchangeRateData, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 编辑
export const PjExchangeRateedit = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.PjExchangeRateedit, 'put', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//删除
export const PjExchangeRateDelete = async (id: any) => {
  const data = {
    id: id,
  };
  try {
    const res = await requrie.onGetload(urls.PjExchangeRateDelete, 'DELETE', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 新增
export const PjExchangeRateadd = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.PjExchangeRateadd, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
