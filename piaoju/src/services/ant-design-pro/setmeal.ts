import requrie from './requrie';
import { urls } from './http';

// 套餐列表
export const PjCombo = async (params: any) => {
  // if (params.combo_type === '') {
  //   delete params.combo_type;
  // }
  const data = {
    ...params,
    pageNo: params.current,
    column: 'createTime',
    order: 'desc',
  };
  try {
    const res = await requrie.onGetload(urls.pjCombolist, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 套餐不分页
export const pjComboNoPageList = async () => {
  const data = {};
  try {
    const res = await requrie.onPostload(urls.pjComboNoPageList, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 套餐详情查看
export const PjComboData = async (params: any) => {
  const data = {
    id: params,
  };
  try {
    const res = await requrie.onGetload(urls.pjComboqueryById, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 套餐编辑
export const PjComboupdate = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjComboedit, 'put', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
