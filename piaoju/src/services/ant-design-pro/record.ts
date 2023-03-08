import requrie from './requrie';
import { urls } from './http';

// 识别记录列表
export const pjScanLog = async (params: any) => {
  const data = {
    ...params,
    pageNo: params.current,
    column: 'scanTime',
    order: 'desc',
  };
  try {
    const res = await requrie.onGetload(urls.pjScanLog, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 充值列表
export const pjRechargeLog = async (params: any) => {
  const data = {
    ...params,
    pageNo: params.current,
    column: 'rechargeTime',
    order: 'desc',
  };
  try {
    const res = await requrie.onGetload(urls.pjRechargeLog, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
