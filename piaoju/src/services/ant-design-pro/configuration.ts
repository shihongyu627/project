import requrie from './requrie';
import { urls } from './http';

export const configuration = async () => {
  const data = {};
  try {
    const res = await requrie.onGetload(urls.configuration, 'GET', data, {
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
export const configurationedit = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.configurationedit, 'GET', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
