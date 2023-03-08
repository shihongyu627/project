import requrie from './requrie';
import { urls } from './http';

// 套餐列表
export const pjForeign = async (params: any) => {
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
    const res = await requrie.onGetload(urls.pjForeignlist, 'get', data, {
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
export const pjForeignData = async (params: any) => {
  const data = {
    id: params,
  };
  try {
    const res = await requrie.onGetload(urls.pjForeignqueryById, 'get', data, {
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
export const pjForeignupdate = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjForeignedit, 'put', data, {
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
export const pjForeignDelete = async (id: any) => {
  const data = {
    id: id,
  };
  try {
    const res = await requrie.onGetload(urls.pjForeignDelete, 'DELETE', data, {
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
export const pjForeignadd = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjForeignadd, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
