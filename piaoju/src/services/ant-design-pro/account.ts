import requrie from './requrie';
import { urls } from './http';

// 用户账号列表
export const sysUser = async (params: any) => {
  console.log(sysUser);
  const data = {
    ...params,
    pageNo: params.current,
  };
  try {
    const res = await requrie.onGetload(urls.sysUserList, 'get', data, {
      toast: false,
      login: true,
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
    const res = await requrie.onPostload(urls.sysDepartList, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 角色不分页
export const sysrolenoPageList = async () => {
  const data = {};
  try {
    const res = await requrie.onPostload(urls.sysrolenoPageList, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 冻结解冻
export const frozenBatch = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.frozenBatch, 'put', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 详情查看
export const sysUserData = async (params: any) => {
  const data = {
    id: params,
  };
  try {
    const res = await requrie.onGetload(urls.sysUserData, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 新增
export const sysUseradd = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.sysUseradd, 'post', data, {
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
export const sysUserDelete = async (id: any) => {
  const data = {
    id: id,
  };
  try {
    const res = await requrie.onGetload(urls.sysUserDelete, 'DELETE', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 编辑
export const sysUseredit = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.sysUseredit, 'put', data, {
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
// 修改密码
export const changePassword = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.changePassword, 'put', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 重置密码
export const updatePassword = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.updatePassword, 'put', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 租户不分页
export const pjTenantnoPageList = async () => {
  const data = {};
  try {
    const res = await requrie.onPostload(urls.pjTenantnoPageList, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 租户不分页
export const usercheckTenant = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.usercheckTenant, 'post', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
