import requrie from './requrie';
import { urls } from './http';

// 部门列表
export const sysDepart = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.sysDepartList, 'get', data, {
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
export const sysDepartData = async (params: any) => {
  const data = {
    id: params,
  };
  try {
    const res = await requrie.onGetload(urls.sysDepartData, 'get', data, {
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
export const sysDepartedit = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.sysDepartedit, 'put', data, {
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
export const sysDepartDelete = async (id: any) => {
  const data = {
    id: id,
  };
  try {
    const res = await requrie.onGetload(urls.sysDepartDelete, 'DELETE', data, {
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
export const sysDepartadd = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.sysDepartadd, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 负责人不分页
export const pjUserNoPageList = async () => {
  const data = {
    state: '0,3',
  };
  try {
    const res = await requrie.onGetload(urls.userNoPageList, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 部门不分页
export const sysDepartnoPageList = async () => {
  const data = {};
  try {
    const res = await requrie.onPostload(urls.sysDepartnoPageList, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
