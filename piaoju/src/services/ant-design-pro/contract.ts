import requrie from './requrie';
import { urls } from './http';

// b列表
export const pjModel = async (params: any) => {
  const data = {
    ...params,
    pageNo: params.current,
    column: 'createTime',
    order: 'desc',
  };
  try {
    const res = await requrie.onGetload(urls.pjModel, 'GET', data, {
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
export const pjModelData = async (params: any) => {
  const data = {
    id: params,
  };
  try {
    const res = await requrie.onGetload(urls.pjModelData, 'GET', data, {
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
export const pjModeledit = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjModeledit, 'put', data, {
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
export const pjModelDelete = async (id: any) => {
  const data = {
    id: id,
  };
  try {
    const res = await requrie.onGetload(urls.pjModelDelete, 'DELETE', data, {
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
export const pjModeladd = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjModeladd, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//合同无分页
export const pjModelnoPageList = async () => {
  const data = {};
  try {
    const res = await requrie.onGetload(urls.pjModelnoPageList, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 处理商品和工厂合同模板
export const checkModel = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.checkModel, 'POST', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 默认合同模板更改
export const pjModeldefaultStatus = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjModeldefaultStatus, 'get', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 合同模板管理-生效-失效
export const pjModeleditStatus = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjModeleditStatus, 'put', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
