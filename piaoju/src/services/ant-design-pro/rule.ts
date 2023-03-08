import requrie from './requrie';
import { urls } from './http';

// 角色列表
export const sysRole = async (params: any) => {
  const data = {
    ...params,
    pageNo: params.current,
  };
  try {
    const res = await requrie.onGetload(urls.sysRoleList, 'get', data, {
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
export const sysRoleData = async (params: any) => {
  const data = {
    id: params,
  };
  try {
    const res = await requrie.onGetload(urls.sysRoleData, 'get', data, {
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
export const sysRoleRolePermission = async (params: any) => {
  const data = {
    roleId: params,
  };
  try {
    const res = await requrie.onGetload(urls.sysRoleRolePermission, 'get', data, {
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
export const sysRoleedit = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.sysRoleedit, 'put', data, {
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
export const sysRoleDelete = async (id: any) => {
  const data = {
    id: id,
  };
  try {
    const res = await requrie.onGetload(urls.sysRoleDelete, 'DELETE', data, {
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
export const sysRoleadd = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.sysRoleadd, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 权限不分页
export const sysRoleTreeList = async () => {
  const data = {};
  try {
    const res = await requrie.onPostload(urls.sysRoleTreeList, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
