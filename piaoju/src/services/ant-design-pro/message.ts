import requrie from './requrie';
import { urls } from './http';

// message列表
export const messageList = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.messageList, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 发布
export const editByAnntIdAndUserId = async (params: any) => {
  const data = {
    anntId: params,
  };
  try {
    const res = await requrie.onGetload(urls.editByAnntIdAndUserId, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//消息中心
export const annountCement = async (params: any) => {
  // if (params.name) {
  //   params.name = '%' + params.name + '%';
  // }
  // if (params.name === '') {
  //   delete params.name;
  // }
  const data = {
    ...params,
    pageNo: params.current,
    column: 'createTime',
    order: 'desc',
  };
  try {
    const res = await requrie.onGetload(urls.announcementSend, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
