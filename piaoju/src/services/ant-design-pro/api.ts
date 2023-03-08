// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
// import requrie from './requrie';
import { urls } from './http';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  // !默认登录成功
  // console.log(789, key);
  const columnsArr = `${localStorage.getItem('userInfo')}`;
  const datas = JSON.parse(columnsArr);
  // console.log(789, datas);
  return {
    success: true,
    data: datas,
    // data: {
    //   name: 'Serati Ma',
    //   avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    //   id: '00000001',
    //   email: 'antdesign@alipay.com',
    //   signature: '海纳百川，有容乃大',
    //   title: '交互专家',
    //   group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    //   tags: [
    //     { key: '0', label: '很有想法的' },
    //     { key: '1', label: '专注设计' },
    //     { key: '2', label: '辣~' },
    //     { key: '3', label: '大长腿' },
    //     { key: '4', label: '川妹子' },
    //     { key: '5', label: '海纳百川' },
    //   ],
    //   notifyCount: 12,
    //   unreadCount: 11,
    //   country: 'China',
    //   access: 'admin',
    //   geographic: {
    //     province: { label: '浙江省', key: '330000' },
    //     city: { label: '杭州市', key: '330100' },
    //   },
    //   address: '西湖区工专路 77 号',
    //   phone: '0752-268888888',
    // },
  };
  // return request<{
  //   data: API.CurrentUser;
  // }>('/api/currentUser', {
  //   method: 'GET',
  //   ...(options || {}),
  // });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  // !默认退出登录成功
  return request<API.LoginResult>(urls.loginOut, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Tenant-Token': `${localStorage.getItem('token')}`,
    },
    data: {},
    skipErrorHandler: true,
    ...(options || {}),
  });

  // return { data: {}, success: true };
  // return request<Record<string, any>>('/api/login/outLogin', {
  //   method: 'POST',
  //   ...(options || {}),
  // });
}
export async function pjRule(
  params: {
    // query
    /** 当前的页码 */
    // pageNo?: number;
    // /** 页面的容量 */
    // pageSize?: number;
    // /** 订单状态 */
  },

  options?: { [key: string]: any },
) {
  return request<API.RuleList>(urls.pjRule, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Tenant-Token': `${localStorage.getItem('token')}`,
    },
    data: {},
    params: {
      ...params,
    },
    skipErrorHandler: true,
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  // !默认登录成功
  // return { status: 'ok', type: 'account', currentAuthority: 'admin' };
  return request<API.LoginResult>(urls.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    skipErrorHandler: true,
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
// export const login = async (body: API.LoginParams, options?: { [key: string]: any }) => {
//   console.log(login);
//   const data = body;
//   try {
//     const res = await requrie.onPostload('/admin/sys/login', 'POST', data, {
//       toast: true,
//       login: true,
//       options: {},
//     });
//     return res;
//   } catch (error) {
//     console.log(error);
//   }
// };
/** 轮播图无分页列表查询 GET  */
export async function loginlist(
  params: {
    // query
    /** 当前的页码 */
    // pageNo?: number;
    // /** 页面的容量 */
    // pageSize?: number;
    // /** 订单状态 */
  },

  options?: { [key: string]: any },
) {
  return request<API.RuleList>(urls.loginlist, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {},
    params: {
      ...params,
    },
    skipErrorHandler: true,
    ...(options || {}),
  });
}

// 试用客户添加
export async function PjFirmadd(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>(urls.PjFirmadd, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    skipErrorHandler: true,
    ...(options || {}),
  });
}
//腾讯云短信
export async function tencentOcrsms(body: API.LoginParams, options?: { [key: string]: any }) {
  // console.log('body', body);
  return request<API.LoginResult>(urls.tencentOcrsms, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {},
    params: {
      ...body,
    },
    skipErrorHandler: true,
    ...(options || {}),
  });
}
//获取权限
export async function permission(params: {}, options?: { [key: string]: any }) {
  return request<API.RuleList>(urls.permission, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Tenant-Token': `${localStorage.getItem('token')}`,
    },
    data: {},
    params: {
      ...params,
    },
    skipErrorHandler: true,
    ...(options || {}),
  });
}
//以下需要迁移或已迁移

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

// //修改套餐
// export async function pjComboLogedit(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/ticket/pjClient/edit', {
//     method: 'put',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }

// /**套餐记录表-不分页列表查询 GET admin/ticket/pjClient/list */
// export async function pjComboLog(
//   params: {
//     // query
//     /** 当前的页码 */
//     // pageNo?: number;
//     // /** 页面的容量 */
//     // pageSize?: number;
//     // /** 订单状态 */
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   console.log('params', params);
//   return request<API.RuleList>(`/admin/ticket/pjComboLog/noPageList?clientId=${params}`, {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     ...(options || {}),
//   });
// }

// /** 票据客户表-不分页列表查询 GET admin/ticket/pjClient/list */
// export async function pjClientList(options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/ticket/pjClient/noPageList', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     ...(options || {}),
//   });
// }
// /** 票据客服表-不分页列表查询 GET admin/ticket/pjClient/list */
// export async function userNoPageList(options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/user/noPageList', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     ...(options || {}),
//   });
// }
// /** 票据套餐表-无分页列表查询 GET admin/ticket/pjCombo/noPageList */
// export async function pjComboNoPageList() {
//   return request<API.RuleList>('/admin/ticket/pjCombo/noPageList', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//   });
// }

// /** 票据订单表-分页列表查询 GET admin/ticket/pjOrder/list */
// export async function pjOrderList(
//   params: {
//     // query
//     /** 当前的页码 */
//     pageNo?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//     // /** 订单状态 */
//     state?: String;
//     column?: String;
//     order?: String;
//   },

//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/ticket/pjOrder/list', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }
// /** 票据订单表-通过id删除 admin/ticket/pjOrder/delete */
// export async function pjOrderDelete(
//   params: {
//     // query
//     /** 当前的订单id */
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/ticket/pjOrder/delete', {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }
// /** 票据订单表-通过id查询 admin/ticket/pjOrder/queryById */
// export async function pjOrderInfo(
//   params: {
//     // query
//     /** 当前的订单id */
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/ticket/pjOrder/queryById', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }
// /** 订单创建接口 POST /admin/ticket/pjOrder/add */
// export async function pjOrderAdd(body: API.LoginParams, options?: { [key: string]: any }) {
//   // !默认登录成功
//   // return { status: 'ok', type: 'account', currentAuthority: 'admin' };
//   return request<API.LoginResult>('/admin/ticket/pjOrder/add', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: body,
//     ...(options || {}),
//   });
// }
// /** 订单创建接口 POST /admin/ticket/pjOrder/add */
// export async function pjOrderEdit(body: API.LoginParams, options?: { [key: string]: any }) {
//   // !默认登录成功
//   // return { status: 'ok', type: 'account', currentAuthority: 'admin' };
//   return request<API.LoginResult>('/admin/ticket/pjOrder/edit', {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: body,
//     ...(options || {}),
//   });
// }
// /** 获取汇率列表 GET /api/rule */
// export async function PjExchangeRate(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//     mouth?: string;
//     exchange?: string;
//   },

//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/get', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       '[]': {
//         PjExchangeRate: {
//           mouth: params.mouth,
//           exchange: params.exchange,
//         },
//         query: 2,
//         page: params.current - 1,
//         count: params.pageSize,
//         // ...params,
//       },
//       // page: params.current - 1,
//       // count: params.pageSize,
//       'total@': '/[]/total',
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //汇率新增
// export async function PjExchangeRateadd(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//     name?: string;
//   },

//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/post', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjExchangeRate: params,
//       tag: 'PjExchangeRate',
//     },
//     // page: params.current - 1,
//     // count: params.pageSize,
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }

// //汇率详情查询
// export async function PjExchangeRateData(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   console.log(5656, params);
//   return request<API.RuleList>('/admin/get', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjExchangeRate: {
//         id: params,
//       },
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //汇率详情编辑
// export async function PjExchangeRateedit(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   console.log(5656, params);
//   return request<API.RuleList>('/admin/put', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjExchangeRate: params,
//       tag: 'PjExchangeRate',
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// /** 汇率表-通过id删除 */
// export async function PjExchangeRateDelete(
//   params: {
//     // query
//     /** 当前的订单id */
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/delete', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjExchangeRate: params,
//       tag: 'PjExchangeRate',
//     },
//     // params: {},
//     ...(options || {}),
//   });
// }

// /** 试用列表 GET /api/rule */
// export async function PjFirm(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//     name?: string;
//     phone?: string;
//     create_time?: string;
//     state?: number;
//   },

//   options?: { [key: string]: any },
// ) {
//   if (params.state == 0) {
//     delete params.state;
//   }
//   return request<API.RuleList>('/admin/get', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       '[]': {
//         PjFirm: {
//           name: params.name,
//           phone: params.phone,
//           state: params.state,
//           'create_time%': params.create_time,
//         },
//         query: 2,
//         page: params.current - 1,
//         count: params.pageSize,
//         // ...params,
//       },
//       // page: params.current - 1,
//       // count: params.pageSize,
//       'total@': '/[]/total',
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //试用详情查询
// export async function PjFirmData(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   console.log(5656, params);
//   return request<API.RuleList>('/admin/get', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjFirm: {
//         id: params,
//       },
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //试用编辑
// export async function PjFirmedit(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//     name?: string;
//   },

//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/put', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjFirm: params,
//       tag: 'PjFirm',
//     },
//     // page: params.current - 1,
//     // count: params.pageSize,
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// /** 获取客户列表 GET /api/rule */
// export async function PjClient(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//     name?: string;
//     combo?: string;
//     client_type?: string;
//     allot?: any;
//   },

//   options?: { [key: string]: any },
// ) {
//   if (params.allot) {
//     params.allot = '%' + params.allot + '%';
//   }
//   return request<API.RuleList>('/admin/get', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       '[]': {
//         PjClient: {
//           name: params.name,
//           combo: params.combo,
//           client_type: params.client_type,
//           allot$: params.allot,
//         },
//         query: 2,
//         page: params.current - 1,
//         count: params.pageSize,
//         // ...params,
//       },
//       // page: params.current - 1,
//       // count: params.pageSize,
//       'total@': '/[]/total',
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //客户新增
// export async function PjClientadd(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//     name?: string;
//   },

//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/post', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjClient: params,
//       tag: 'PjClient',
//     },
//     // page: params.current - 1,
//     // count: params.pageSize,
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// export async function pjComboLogadd(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//     name?: string;
//   },

//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/post', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjComboLog: params,
//       tag: 'PjComboLog',
//     },
//     // page: params.current - 1,
//     // count: params.pageSize,
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //客户详情查询
// export async function PjClientData(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   console.log(5656, params);
//   return request<API.RuleList>('/admin/get', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjClient: {
//         id: params,
//       },
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //客户详情编辑
// export async function PjClientedit(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   console.log(5656, params);
//   return request<API.RuleList>('/admin/put', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjClient: params,
//       tag: 'PjClient',
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }

// /** 客户表-通过id删除 admin/ticket/pjOrder/delete */
// export async function PjClientDelete(
//   params: {
//     // query
//     /** 当前的订单id */
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/delete', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjClient: params,
//       tag: 'PjClient',
//     },
//     // params: {},
//     ...(options || {}),
//   });
// }
// //banner列表
// export async function PjCarousel(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//     name?: number;
//   },

//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/get', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       '[]': {
//         PjCarousel: {
//           name: params.name,
//         },
//         query: 2,
//         page: params.current - 1,
//         count: params.pageSize,
//         // ...params,
//       },
//       'total@': '/[]/total',
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //banner编辑
// export async function PjCarouseladd(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   console.log(5656, params);
//   return request<API.RuleList>('/admin/post', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjCarousel: params,
//       tag: 'PjCarousel',
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }

// //banner详情查询
// export async function PjCarouselData(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   console.log(5656, params);
//   return request<API.RuleList>('/admin/get', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjCarousel: {
//         id: params,
//       },
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //banner详情编辑
// export async function PjCarouseledit(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   console.log(5656, params);
//   return request<API.RuleList>('/admin/put', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjCarousel: params,
//       tag: 'PjCarousel',
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// /**banner-通过id删除 admin/ticket/pjOrder/delete */
// export async function PjCarouselDelete(
//   params: {
//     // query
//     /** 当前的订单id */
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/delete', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjCarousel: params,
//       tag: 'PjCarousel',
//     },
//     // params: {},
//     ...(options || {}),
//   });
// }

// //套餐列表下拉查询
// export async function PjCombos(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/get', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       '[]': {
//         PjCombo: {},
//         query: 2,
//         page: 0,
//         count: 10,
//       },
//       'total@': '/[]/total',
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //套餐列表查询
// export async function PjCombo(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//     combo_type?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/get', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       '[]': {
//         PjCombo: {
//           combo_type: params.combo_type,
//         },
//         query: 2,
//         page: 0,
//         count: 10,
//       },
//       'total@': '/[]/total',
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }

// //套餐详情查询
// export async function PjComboData(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   console.log(5656, params);
//   return request<API.RuleList>('/admin/get', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjCombo: {
//         id: params,
//       },
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //套餐详情编辑
// export async function PjComboupdate(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   console.log(5656, params);
//   return request<API.RuleList>('/admin/put', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       PjCombo: params,
//       tag: 'PjCombo',
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// /** 部门树列表查询 GET admin/ticket/pjOrder/list */
// export async function sysDepart(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/sysDepart/queryTreeAll', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //全部部门下拉列表
// export async function sysDepartnoPageList(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/sysDepart/noPageList', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //部门新增
// export async function sysDepartadd(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/sysDepart/add', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }
// //部门id查询
// export async function sysDepartData(
//   params: {
//     // query
//     /** 当前的部门id */
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>(`/admin/sys/sysDepart/getById?id=${params}`, {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }

// export async function sysDepartedit(
//   params: {
//     // query
//     /** 当前的部门id */
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>(`/admin/sys/sysDepart/edit`, {
//     method: 'put',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       ...params,
//     },
//     params: {},
//     ...(options || {}),
//   });
// }

// //删除
// export async function sysDepartDelete(
//   params: {
//     // query
//     /** 当前的部门id */
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   console.log(params);
//   return request<API.RuleList>(`/admin/sys/sysDepart/delete?id=${params.id}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //用户无分页下拉
// export async function usernoPageList(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/user/noPageList', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// /** 用户列表查询 GET admin/ticket/pjOrder/list */
// export async function sysUser(
//   params: {
//     departIds?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/admin/sys/user/list', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       departIds: params.departIds,
//     },
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }
// //用户id查询详情
// export async function sysUserData(
//   params: {
//     // query
//     /** 当前的id */
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>(`/admin/sys/user/queryById?id=${params}`, {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// /** 用户按id彻底删除查询 */
// export async function sysUserDelete(
//   params: {
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>(`/admin/sys/user/delete?id=${params.id}`, {
//     method: 'delete',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }

// //客户用户新增
// export async function sysUseraddClient(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/user/addClient', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }
// //用户新增
// export async function sysUseradd(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/user/add', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }
// //用户编辑
// export async function sysUseredit(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/user/edit', {
//     method: 'put',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }
// //重置密码
// export async function changePassword(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/user/changePassword', {
//     method: 'put',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }

// //冻结解冻
// export async function frozenBatch(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     // /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   console.log(5656, params);
//   return request<API.RuleList>('/admin/sys/user/frozenBatch', {
//     method: 'put',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       ...params,
//     },
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //角色无分页下拉
// export async function sysrolenoPageList(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/role/noPageList', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //角色权限列表
// export async function sysRole(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/role/list', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }
// /** 角色按id彻底删除查询 */
// export async function sysRoleDelete(
//   params: {
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>(`/admin/sys/role/delete?id=${params.id}`, {
//     method: 'delete',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //角色权限下拉树
// export async function sysRoleTreeList(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/role/queryTreeList', {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //新增角色
// export async function sysRoleadd(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/role/add', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }
// //角色id查询
// export async function sysRoleData(
//   params: {
//     // query
//     /** 当前的部门id */
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>(`/admin/sys/role/queryById?id=${params}`, {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //角色权限id查询
// export async function sysRoleRolePermission(
//   params: {
//     // query
//     /** 当前的部门id */
//     id?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>(`/admin/sys/permission/queryRolePermission?roleId=${params}`, {
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {},
//     // params: {
//     //   ...params,
//     // },
//     ...(options || {}),
//   });
// }
// //编辑角色
// export async function sysRoleedit(params: {}, options?: { [key: string]: any }) {
//   return request<API.RuleList>('/admin/sys/role/edit', {
//     method: 'put',
//     headers: {
//       'Content-Type': 'application/json',
//       'Tenant-Token': `${localStorage.getItem('token')}`,
//     },
//     data: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }

// /** 新建规则 PUT /api/rule */
// export async function updateRule(options?: { [key: string]: any }) {
//   return request<API.RuleListItem>('/api/rule', {
//     method: 'PUT',
//     ...(options || {}),
//   });
// }

// /** 新建规则 POST /api/rule */
// export async function addRule(options?: { [key: string]: any }) {
//   return request<API.RuleListItem>('/api/rule', {
//     method: 'POST',
//     ...(options || {}),
//   });
// }

// /** 删除规则 DELETE /api/rule */
// export async function removeRule(options?: { [key: string]: any }) {
//   return request<Record<string, any>>('/api/rule', {
//     method: 'DELETE',
//     ...(options || {}),
//   });
// }
