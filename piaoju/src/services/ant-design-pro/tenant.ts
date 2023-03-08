import requrie from './requrie';
import { urls } from './http';

// banner列表
export const pjTenant = async (params: any) => {
  const data = {
    ...params,
    pageNo: params.current,
    column: 'createTime',
    order: 'desc',
  };
  try {
    const res = await requrie.onGetload(urls.pjTenant, 'GET', data, {
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
export const pjTenantqueryById = async (params: any) => {
  const data = {
    id: params,
  };
  try {
    const res = await requrie.onGetload(urls.pjTenantqueryById, 'GET', data, {
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
export const pjTenantedit = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjTenantedit, 'post', data, {
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
export const pjTenantdelete = async (id: any) => {
  const data = {
    id: id,
  };
  try {
    const res = await requrie.onGetload(urls.pjTenantdelete, 'DELETE', data, {
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
export const pjTenantadd = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjTenantadd, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 充值
export const pjTenantcheckNum = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjTenantcheckNum, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 充值记录无分页
export const pjRechargeLognoPagelist = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjRechargeLognoPagelist, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//租户用户新增
export const useraddTenant = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.useraddTenant, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

// 用户详情查看
export const selectDetails = async (id: any) => {
  const data = {
    tenantId: id,
  };
  try {
    const res = await requrie.onGetload(urls.UserselectDetails, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
