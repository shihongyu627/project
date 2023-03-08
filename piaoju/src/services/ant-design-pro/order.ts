import { urls } from './http';
import requrie from './requrie';

// 订单列表
export const pjOrderList = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjOrderList, 'get', data, {
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
// 订单删除
export const pjOrderDelete = async (id: any) => {
  const data = {
    ...id,
  };
  try {
    const res = await requrie.onGetload(urls.pjOrderDelete, 'DELETE', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 订单详情
export const pjOrderInfo = async (id: any) => {
  const data = {
    ...id,
  };
  try {
    const res = await requrie.onGetload(urls.pjOrderInfo, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 订单创建
export const pjOrderAdd = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjOrderAdd, 'POST', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 订单编辑
export const pjOrderEdit = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjOrderEdit, 'PUT', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 票据客户表
export const pjClientList = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjClientList, 'get', data, {
      toast: true,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 票据客服表
export const userNoPageList = async (params: any) => {
  const data = {
    ...params,
    state: '3',
  };
  try {
    const res = await requrie.onGetload(urls.userNoPageList, 'get', data, {
      toast: true,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 订单操作日志不分页
export const pjOrderLogList = async (params: any) => {
  const data = {
    column: 'createTime',
    order: 'desc',
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjOrderLogList, 'get', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 订单商品列表
export const pjGoodsList = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjGoodsList, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 订单商品列表 不分页
export const pjGoodsNoPageList = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjGoodsNoPageList, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 订单商品编辑
export const pjGoodsEdit = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjGoodsEdit, 'PUT', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 订单导出出口
export const pjOrderExportXls = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onupload(urls.pjOrderExportXls, 'get', data, {
      toast: false,
      login: true,
      options: {
        responseType: 'blob',
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 订单导出出口
export const pjOrderExportDrawback = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onupload(urls.pjOrderExportDrawback, 'get', data, {
      toast: false,
      login: true,
      options: {
        responseType: 'blob',
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 订单导出备案
export const pjOrderkeepRecord = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onupload(urls.pjOrderkeepRecord, 'get', data, {
      toast: false,
      login: true,
      options: {
        responseType: 'blob',
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 订单导出成本转结单
export const pjcostTransferOrder = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onupload(urls.pjcostTransferOrder, 'get', data, {
      toast: false,
      login: true,
      options: {
        responseType: 'blob',
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

// 批量设置日期
export const pjOrderEditDate = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjOrderEditDate, 'POST', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 票据文件
export const pjFileNoPageList = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjFileNoPageList, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 票据文件添加
export const pjFileAdd = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjFileAdd, 'POST', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 票据文件编辑
export const pjFileEdit = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjFileEdit, 'PUT', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 票据文件删除
export const pjFileDeleteBatch = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjFileDeleteBatch, 'DELETE', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//报关单确认
export const editState = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.editState, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//商品分配发票
export const pjBillingAddBatch = async (params: any) => {
  try {
    const res = await requrie.onArrload(urls.pjBillingAddBatch, 'post', params, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 订单商品发票列表 不分页
export const pjBillingNoPageList = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjBillingNoPageList, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 订单工厂发票列表 不分页
export const pjBillingnoPageFactoryList = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjBillingnoPageFactoryList, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 票据文件表-批量添加(进项发票)
export const pjFileAddBatch = async (params: any) => {
  try {
    const res = await requrie.onArrload(urls.pjFileAddBatch, 'post', params, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 文件详情
export const pjFileQueryById = async (id: any) => {
  const data = {
    ...id,
  };
  try {
    const res = await requrie.onGetload(urls.pjFileQueryById, 'get', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//出口发票校验
export const pjOrderCheckExport = async (params: any) => {
  try {
    const res = await requrie.onArrload(urls.pjOrderCheckExport, 'post', params, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

//出口发票批量校验
export const pjOrdercheckExportBatch = async (params: any) => {
  try {
    const res = await requrie.onArrload(urls.pjOrdercheckExportBatch, 'post', params, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//进项发票批量校验
export const pjOrdercheckBatch = async (params: any) => {
  try {
    const res = await requrie.onArrload(urls.pjOrdercheckBatch, 'post', params, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//进项发票批量校验
export const pjOrdercheckBatchtow = async (params: any) => {
  try {
    const res = await requrie.onArrload(urls.pjOrdercheckBatchtow, 'post', params, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

//开票信息删除

export const pjBillingDelete = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjBillingDelete, 'DELETE', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const pjFiledelete = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjFiledelete, 'DELETE', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

//文件上传
export const upload = async (data: any) => {
  // const data = {
  //   ...params,
  // };
  try {
    const res = await requrie.upload(urls.upload, 'post', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//数据统计
export const pjOrderstatistics = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjOrderstatistics, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//工作台
export const pjOrderworkbench = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjOrderworkbench, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//获取客户信息
export const getClientData = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.getClientData, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//kaipaio
export const noPageGkList = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.noPageGkList, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//kaipaio2
export const noPageOrderFactoryList = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.noPageOrderFactoryList, 'get', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 进项发票文件
export const invoiceCheckList = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.invoiceCheckList, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//订单状态处理
export const pjOrdereditState = async (params: any) => {
  try {
    const res = await requrie.onArrload(urls.pjOrdereditState, 'post', params, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//工厂联想
export const pjMiddlenoPageList = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjMiddlenoPageList, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 工厂删除
export const factoryDelete = async (id: any) => {
  const data = {
    ...id,
  };
  try {
    const res = await requrie.onGetload(urls.factoryDelete, 'DELETE', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//商品开票编辑
export const pjBillingedit = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjBillingedit, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//商品开票详情
export const pjBillinginfo = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjBillinginfo, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//商品开票编辑
export const pjBillingcheckBatch = async (params: any) => {
  const data = params;
  try {
    const res = await requrie.onArrPost(urls.pjBillingcheckBatch, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//一键下载
export const pjBillingoneKeyGenerate = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.pjBillingoneKeyGenerate, 'post', data, {
      toast: false,
      login: false,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//品类下拉
export const pjCategory = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjCategory, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//获取通知、合同all开票信息
export const getBillAll = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.getBillAll, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
//工厂开票编辑
export const pjBillingcheckFactory = async (params: any) => {
  const data = params;
  try {
    const res = await requrie.onArrPost(urls.pjBillingcheckFactory, 'post', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

//外商下拉
export const pjForeign = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onGetload(urls.pjForeign, 'GET', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
