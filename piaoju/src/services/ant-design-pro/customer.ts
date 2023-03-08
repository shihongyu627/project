import { urls } from './http';
import requrie from './requrie';

// 客户管理列表分页
export const pjClientlist = async (params: any) => {
  const data = {
    ...params,
    pageNo: params.current,
    column: 'createTime',
    order: 'desc',
  };
  try {
    const res = await requrie.onGetload(urls.pjClientlist, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

// 客户详情查看2
export const selectDetails = async () => {
  const data = {};
  try {
    const res = await requrie.onGetload(urls.selectDetails, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 客户详情查看2
export const adminSelectDetails = async (id: any) => {
  const data = {
    tenantId: id,
  };
  try {
    const res = await requrie.onGetload(urls.adminSelectDetails, 'get', data, {
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
// 客服不分页
export const pjUserNoPageList = async () => {
  const data = {
    state: '3',
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
// 客户删除
export const PjClientDelete = async (id: any) => {
  const data = {
    id: id,
  };
  try {
    const res = await requrie.onGetload(urls.PjClientDelete, 'DELETE', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 客户新增
export const PjClientadd = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjClientadd, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 客户套餐记录新增
export const pjComboLogadd = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjComboLogadd, 'post', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 客户详情查看
export const PjClientData = async (params: any) => {
  const data = {
    id: params,
  };
  try {
    const res = await requrie.onGetload(urls.pjClientqueryById, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 客户编辑
export const PjClientedit = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjClientedit, 'put', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

/**套餐记录表-不分页列表查询  */
export const pjComboLogNoPageList = async (id: any) => {
  const data = {
    clientId: id,
  };
  try {
    const res = await requrie.onGetload(urls.pjComboLogNoPageList, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

// 套餐记录新增
//修改套餐
export const pjComboLogedit = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjComboLogedit, 'put', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//客户用户新增
export const sysUseraddClient = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.sysUseraddClient, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 客户不分页
export const pjClientNoPageList = async () => {
  const data = {};
  try {
    const res = await requrie.onGetload(urls.pjClientNoPageList, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 客服不分页
export const noPageClient = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.noPageClient, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 客户不分页
export const noPageClientList = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.noPageClientList, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 更换客服
export const changeAllot = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.changeAllot, 'get', data, {
      toast: true,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 通过名称校验是否重复
export const checkIsName = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.checkIsName, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    // console.log(error);
  }
};
// 通过id和名称校验是否重复
export const checkIdName = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.checkIdName, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    // console.log(error);
  }
};
