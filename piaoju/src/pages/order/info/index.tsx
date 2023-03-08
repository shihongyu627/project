import {
  // editState,
  // pjFileDeleteBatch,
  pjFileAdd,
  pjFiledelete,
  pjFileEdit,
  pjOrderEdit,
  pjOrdereditState,
  pjOrderInfo,
} from '@/services/ant-design-pro/order';
import { configuration } from '@/services/ant-design-pro/configuration';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Anchor, BackTop, Button, Col, Popconfirm, Row, Spin, Tabs } from 'antd';
import React, { useState } from 'react';
import { Prompt } from 'umi';
import type { Props as OrderBillProps } from '../info/bill'; //其他信息
import OrderBill from '../info/bill'; //报关单上传
import OrderCustomer from '../info/customer'; //客户信息
import type { Props as OrderGoodsProps } from '../info/goods'; //商品信息
import OrderGoods from '../info/goods'; //商品信息
import type { Props as OrderFactoryGoodsProps } from '../info/factoryGoods'; //工厂商品信息
import OrderFactoryGoods from '../info/factoryGoods'; //工厂商品信息
import OrderHeader from '../info/header'; //订单状态
import type { Props as OrderInvoiceProps } from '../info/invoice'; //出口发票
import OrderInvoice from '../info/invoice'; //发票上传
import type { Props as OrderKeepRecordProps } from '../info/keepRecord'; //备案资料
import OrderKeepRecord from '../info/keepRecord'; //报备资料
import OrderOperationLg from '../info/operationLg'; //操作日志
import type { Props as OrderOtherProps } from '../info/other'; //其他信息
import OrderOther from '../info/other'; //其他信息
import defaultSettings from '../../../../config/defaultSettings';
export type TableListItem = {
  key: number;
  name: string;
  progress: number;
  containers: number;
  callNumber: number;
  creator: string;
  status: string;
  createdAt: number;
  memo: string;
};
// window.onbeforeunload = function (e) {
//   const a = e || window.event;
//   if (a) {
//     a.returnValue = '网站可能不会保存您的修改哦~';
//   }
//   return '网站可能不会保存您的修改哦~';
// };
const OrderInfo: React.FC = (props: any) => {
  // 同步子组件次数，每次同步都+1
  const [syncCount, setSyncCount] = useState(1);
  const [dataInfo, setOrderInfo] = useState({});
  // const [fileIds, setFileIds] = useState([]);
  const [keepRecordUpload, setKeepRecordUpload] = useState([]);
  const [queryId, setQueryId] = useState(null);
  const [putFileId, setPutFileId] = useState(null);
  const [firstLoading, setFirstLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [headerData, setOrderHeader] = useState([{}]);
  const ref_other = React.useRef<OrderOtherProps>();
  const ref_bill = React.useRef<OrderBillProps>();
  const ref_invoice = React.useRef<OrderInvoiceProps>();
  const ref_goods = React.useRef<OrderGoodsProps>();
  const ref_factory = React.useRef<OrderFactoryGoodsProps>();
  const ref_keepRecord = React.useRef<OrderKeepRecordProps>();
  //路由校验及获取
  const columnsArr = `${localStorage.getItem('auths')}`;
  const urlData = JSON.parse(columnsArr);
  const check = (url: any) => {
    if (!urlData) {
      return false;
    }
    return urlData.some((item: any) => item.url == url);
  };
  const userInfo = `${localStorage.getItem('userInfo')}`;
  const datasuserInfo = JSON.parse(userInfo);
  // 获取详情
  const _pjOrderInfo = async (id: any) => {
    const res = await pjOrderInfo({
      id,
    });
    if (res?.code == 200) {
      const result = res?.result || {};
      const one = <ExclamationCircleOutlined style={{ fontSize: 20, color: 'red' }} />;
      const two = <CheckCircleOutlined style={{ fontSize: 20, color: '#00CC33' }} />;
      const dd = [
        {
          src: result?.incomeState == 1 ? two : one,
          text: '进项发票',
          type: '1',
          link: 'order_goods',
        },
        {
          src: result?.authenticationState == 1 ? two : one,
          text: '进项发票认证',
          type: '1',
          link: 'order_goods',
        },
        {
          src: result?.exitState == 1 ? two : one,
          text: '出口发票',
          type: '2',
          link: 'order_invoice',
        },
        {
          src: result?.taxRefundState == 1 ? two : one,
          text: '退税申报',
          type: '2',
        },
        {
          src: result?.filingState == 1 ? two : one,
          text: '备案资料',
          type: '5',
          link: 'order_keeprecord',
        },
        {
          src: result?.arrearageState == 1 ? two : one,
          text: result?.arrearageState == 1 ? '已付款' : '未付款',
          type: '3',
          link: 'order_other',
        },
        {
          src: result?.isDownload == 1 ? two : one,
          text: result?.isDownload == 1 ? '资料已下载' : '资料未下载',
          type: '5',
        },
      ];
      // const newArr = [
      //   {
      //     type: 'declareBill',
      //     name: '报关单',
      //     cut: 'green',
      //   },
      //   {
      //     type: 'PI',
      //     name: '外销合同',
      //     cut: 'black',
      //   },
      //   {
      //     type: 'voucher',
      //     name: '物流凭证',
      //     cut: 'green',
      //   },
      //   {
      //     type: 'declarationInformation',
      //     name: '报关资料',
      //     // maxNum: 1,
      //     cut: 'red',
      //   },
      //   {
      //     type: 'entrustedcustomsdeclarationagreement',
      //     name: '委托报关协议',
      //     cut: 'green',
      //   },
      //   {
      //     type: 'purchaseContract',
      //     name: '采购合同',
      //     cut: 'yellow',
      //   },
      //   {
      //     type: 'materialInvoice',
      //     name: '原材料发票',
      //     cut: 'purple',
      //   },
      //   {
      //     type: 'materialPaymentMemo',
      //     name: '原材料付款水单',
      //     cut: 'purple',
      //   },
      //   {
      //     type: 'inputInvoice',
      //     name: '进项发票',
      //     cut: 'yellow',
      //   },
      //   {
      //     type: 'paymentMemo',
      //     // name: '货款付款水单',
      //     name: '工厂水单',
      //     cut: 'yellow',
      //   },
      //   {
      //     type: 'exportInvoice',
      //     name: '出口发票',
      //     // maxNum: 1,
      //     cut: 'black',
      //   },
      //   {
      //     type: 'dollarMemo',
      //     name: '美金水单',
      //     cut: 'black',
      //   },
      //   {
      //     type: 'passBook',
      //     name: '通关无纸化放行书',
      //     cut: 'green',
      //   },
      //   {
      //     type: 'warehousing',
      //     name: '进仓单/装箱单',
      //     cut: 'green',
      //   },
      //   {
      //     type: 'forwarderBill',
      //     // name: '货代对账单',
      //     name: '货代费用明细',
      //     cut: 'green',
      //   },
      //   {
      //     type: 'forwarderInvoice',
      //     name: '货代发票',
      //     cut: 'green',
      //   },
      //   {
      //     type: 'forwarderPayment',
      //     // name: '货代付款水单',
      //     name: '货代水单',
      //     cut: 'green',
      //   },
      //   {
      //     type: 'agencyCertificate',
      //     name: '一达通代理证',
      //     cut: 'blue',
      //   },
      //   {
      //     type: 'warehousingOrder',
      //     name: '入库单',
      //     cut: 'purple',
      //   },
      //   {
      //     type: 'outboundOrder',
      //     name: '出库单',
      //     cut: 'purple',
      //   },
      //   {
      //     type: 'declarationInformation',
      //     name: '报关资料',
      //     // maxNum: 1,
      //     cut: 'red',
      //   },
      //   {
      //     type: 'declarationInformationOther',
      //     name: '报关其他',
      //     // maxNum: 1,
      //     cut: 'red',
      //   },
      //   {
      //     type: 'customsclearanceOther',
      //     name: '清关其他',
      //     // maxNum: 1,
      //     cut: 'red',
      //   },
      //   {
      //     type: 'drawbackOther',
      //     name: '退税其他',
      //     // maxNum: 1,
      //     cut: 'red',
      //   },
      //   {
      //     type: 'otherBill',
      //     name: '其他',
      //     cut: 'green',
      //   },
      // ];
      if (result.comboType === 'A' && result.clientType === 1) {
        // const params: any = newArr.filter(
        //   (item: any) => item.cut === 'red' || item.cut === 'green' || item.cut === 'blue',
        // );
        const params: any = [
          {
            type: 'declareBill',
            name: '*\xa0报关单',
            cut: 'red',
          },
          {
            type: 'voucher',
            name: '*\xa0物流凭证',
            cut: 'red',
          },
          {
            type: 'declarationInformation',
            name: '报关资料',
            cut: 'green',
          },
          {
            type: 'passBook',
            name: '通关无纸化放行书',
            cut: 'green',
          },
          {
            type: 'warehousing',
            name: '进仓单/装箱单',
            cut: 'green',
          },
          {
            type: 'forwarderBill',
            // name: '货代对账单',
            name: '货代费用明细',
            cut: 'green',
          },
          {
            type: 'forwarderInvoice',
            name: '货代发票',
            cut: 'green',
          },
          {
            type: 'forwarderPayment',
            // name: '货代付款水单',
            name: '货代水单',
            cut: 'green',
          },
          {
            type: 'agencyCertificate',
            name: '一达通代理证',
            cut: 'green',
          },
          {
            type: 'declarationInformationOther',
            name: '报关其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'customsclearanceOther',
            name: '清关其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'otherBill',
            name: '其他',
            cut: 'green',
          },
        ];
        setKeepRecordUpload(params);
        const header = dd.filter(
          (item: any) =>
            (item.type === '3' && datasuserInfo.roleCode != 'client') || item.type === '5',
        );
        setOrderHeader(header);
      }
      if (result.comboType === 'A' && result.clientType === 2) {
        // const params: any = newArr.filter(
        //   (item: any) => item.cut === 'red' || item.cut === 'green',
        // );
        const params: any = [
          {
            type: 'declareBill',
            name: '*\xa0报关单',
            cut: 'red',
          },
          {
            type: 'voucher',
            name: '*\xa0物流凭证',
            cut: 'red',
          },
          {
            type: 'declarationInformation',
            name: '报关资料',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'passBook',
            name: '通关无纸化放行书',
            cut: 'green',
          },
          {
            type: 'warehousing',
            name: '进仓单/装箱单',
            cut: 'green',
          },
          {
            type: 'forwarderBill',
            // name: '货代对账单',
            name: '货代费用明细',
            cut: 'green',
          },
          {
            type: 'forwarderInvoice',
            name: '货代发票',
            cut: 'green',
          },
          {
            type: 'forwarderPayment',
            // name: '货代付款水单',
            name: '货代水单',
            cut: 'green',
          },
          {
            type: 'declarationInformationOther',
            name: '报关其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'customsclearanceOther',
            name: '清关其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'otherBill',
            name: '其他',
            cut: 'green',
          },
        ];
        setKeepRecordUpload(params);
        const header = dd.filter(
          (item: any) =>
            (item.type === '3' && datasuserInfo.roleCode != 'client') || item.type === '5',
        );
        setOrderHeader(header);
      }
      if (result.comboType === 'B' && result.clientType === 1) {
        // const params = newArr.filter(
        //   (item: any) =>
        //     item.cut === 'green' ||
        //     item.cut === 'blue' ||
        //     item.cut === 'black' ||
        //     item.cut === 'yellow',
        // );
        const params: any = [
          {
            type: 'declareBill',
            name: '*\xa0报关单',
            cut: 'red',
          },
          {
            type: 'PI',
            name: '*\xa0外销合同',
            cut: 'red',
          },
          {
            type: 'voucher',
            name: '*\xa0物流凭证',
            cut: 'red',
          },
          {
            type: 'entrustedcustomsdeclarationagreement',
            name: '*\xa0委托报关协议',
            cut: 'red',
          },
          {
            type: 'purchaseContract',
            name: '*\xa0采购合同',
            cut: 'red',
          },
          {
            type: 'inputInvoice',
            name: '进项发票',
            cut: 'green',
          },
          {
            type: 'paymentMemo',
            // name: '货款付款水单',
            name: '工厂水单',
            cut: 'green',
          },
          {
            type: 'exportInvoice',
            name: '出口发票',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'dollarMemo',
            name: '美金水单',
            cut: 'green',
          },
          {
            type: 'forwarderInvoice',
            name: '货代发票',
            cut: 'green',
          },
          {
            type: 'forwarderPayment',
            // name: '货代付款水单',
            name: '货代水单',
            cut: 'green',
          },
          {
            type: 'warehousing',
            name: '进仓单/装箱单',
            cut: 'green',
          },
          {
            type: 'forwarderBill',
            // name: '货代对账单',
            name: '货代费用明细',
            cut: 'green',
          },
          {
            type: 'passBook',
            name: '通关无纸化放行书',
            cut: 'green',
          },
          {
            type: 'agencyCertificate',
            name: '一达通代理证',
            cut: 'green',
          },
          {
            type: 'declarationInformationOther',
            name: '报关其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'customsclearanceOther',
            name: '清关其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'drawbackOther',
            name: '退税其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'otherBill',
            name: '其他',
            cut: 'green',
          },
        ];
        setKeepRecordUpload(params);
        const header = dd.filter(
          (item: any) =>
            item.type === '4' ||
            (item.type === '3' && datasuserInfo.roleCode != 'client') ||
            item.type === '2' ||
            item.type === '1' ||
            item.type === '5',
        );
        setOrderHeader(header);
      }
      if (result.comboType === 'B' && result.clientType === 2) {
        // const params: any = newArr.filter(
        //   (item: any) => item.cut === 'green' || item.cut === 'black' || item.cut === 'purple',
        // );
        const params: any = [
          {
            type: 'declareBill',
            name: '*\xa0报关单',
            cut: 'red',
          },
          {
            type: 'PI',
            name: '*\xa0外销合同',
            cut: 'red',
          },
          {
            type: 'voucher',
            name: '*\xa0物流凭证',
            cut: 'red',
          },
          {
            type: 'entrustedcustomsdeclarationagreement',
            name: '*\xa0委托报关协议',
            cut: 'red',
          },
          {
            type: 'purchaseContract',
            name: '采购合同',
            cut: 'green',
          },
          {
            type: 'materialInvoice',
            name: '原材料发票',
            cut: 'green',
          },
          {
            type: 'materialPaymentMemo',
            name: '原材料付款水单',
            cut: 'green',
          },
          {
            type: 'exportInvoice',
            name: '出口发票',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'dollarMemo',
            name: '美金水单',
            cut: 'green',
          },
          {
            type: 'forwarderInvoice',
            name: '货代发票',
            cut: 'green',
          },
          {
            type: 'forwarderPayment',
            // name: '货代付款水单',
            name: '货代水单',
            cut: 'green',
          },
          {
            type: 'warehousing',
            name: '进仓单/装箱单',
            cut: 'green',
          },
          {
            type: 'forwarderBill',
            // name: '货代对账单',
            name: '货代费用明细',
            cut: 'green',
          },
          {
            type: 'passBook',
            name: '通关无纸化放行书',
            cut: 'green',
          },
          {
            type: 'warehousingOrder',
            name: '入库单',
            cut: 'green',
          },
          {
            type: 'outboundOrder',
            name: '出库单',
            cut: 'green',
          },
          {
            type: 'declarationInformationOther',
            name: '报关其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'customsclearanceOther',
            name: '清关其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'drawbackOther',
            name: '退税其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'otherBill',
            name: '其他',
            cut: 'green',
          },
        ];
        setKeepRecordUpload(params);
        const header = dd.filter(
          (item: any) =>
            item.type === '4' ||
            (item.type === '3' && datasuserInfo.roleCode != 'client') ||
            item.type === '2' ||
            item.type === '5',
        );
        setOrderHeader(header);
      }
      if (result.comboType === 'A+B' && result.clientType === 1) {
        // const params: any = newArr.filter(
        //   (item: any) =>
        //     item.cut === 'red' ||
        //     item.cut === 'green' ||
        //     item.cut === 'blue' ||
        //     item.cut === 'black' ||
        //     item.cut === 'yellow',
        // );
        const params: any = [
          {
            type: 'declareBill',
            name: '*\xa0报关单',
            cut: 'red',
          },
          {
            type: 'PI',
            name: '*\xa0外销合同',
            cut: 'red',
          },
          {
            type: 'voucher',
            name: '*\xa0物流凭证',
            cut: 'red',
          },
          {
            type: 'entrustedcustomsdeclarationagreement',
            name: '*\xa0委托报关协议',
            cut: 'red',
          },
          {
            type: 'purchaseContract',
            name: '*\xa0采购合同',
            cut: 'red',
          },
          {
            type: 'inputInvoice',
            name: '进项发票',
            cut: 'green',
          },
          {
            type: 'paymentMemo',
            // name: '货款付款水单',
            name: '工厂水单',
            cut: 'green',
          },
          {
            type: 'exportInvoice',
            name: '出口发票',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'dollarMemo',
            name: '美金水单',
            cut: 'green',
          },
          {
            type: 'forwarderInvoice',
            name: '货代发票',
            cut: 'green',
          },
          {
            type: 'forwarderPayment',
            // name: '货代付款水单',
            name: '货代水单',
            cut: 'green',
          },
          {
            type: 'warehousing',
            name: '进仓单/装箱单',
            cut: 'green',
          },
          {
            type: 'forwarderBill',
            // name: '货代对账单',
            name: '货代费用明细',
            cut: 'green',
          },
          {
            type: 'passBook',
            name: '通关无纸化放行书',
            cut: 'green',
          },
          {
            type: 'agencyCertificate',
            name: '一达通代理证',
            cut: 'green',
          },
          {
            type: 'declarationInformation',
            name: '报关资料',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'declarationInformationOther',
            name: '报关其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'customsclearanceOther',
            name: '清关其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'drawbackOther',
            name: '退税其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'otherBill',
            name: '其他',
            cut: 'green',
          },
        ];
        setKeepRecordUpload(params);
        const header = dd.filter(
          (item: any) =>
            item.type === '4' ||
            (item.type === '3' && datasuserInfo.roleCode != 'client') ||
            item.type === '2' ||
            item.type === '1' ||
            item.type === '5',
        );
        setOrderHeader(header);
      }
      if (result.comboType === 'A+B' && result.clientType === 2) {
        // const params: any = newArr.filter(
        //   (item: any) =>
        //     item.cut === 'red' ||
        //     item.cut === 'green' ||
        //     item.cut === 'black' ||
        //     item.cut === 'purple',
        // );
        const params: any = [
          {
            type: 'declareBill',
            name: '*\xa0报关单',
            cut: 'red',
          },
          {
            type: 'PI',
            name: '*\xa0外销合同',
            cut: 'red',
          },
          {
            type: 'voucher',
            name: '*\xa0物流凭证',
            cut: 'red',
          },
          {
            type: 'entrustedcustomsdeclarationagreement',
            name: '*\xa0委托报关协议',
            cut: 'red',
          },
          {
            type: 'purchaseContract',
            name: '采购合同',
            cut: 'green',
          },
          {
            type: 'materialInvoice',
            name: '原材料发票',
            cut: 'green',
          },
          {
            type: 'materialPaymentMemo',
            name: '原材料付款水单',
            cut: 'green',
          },
          {
            type: 'exportInvoice',
            name: '出口发票',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'dollarMemo',
            name: '美金水单',
            cut: 'green',
          },
          {
            type: 'forwarderInvoice',
            name: '货代发票',
            cut: 'green',
          },
          {
            type: 'forwarderPayment',
            // name: '货代付款水单',
            name: '货代水单',
            cut: 'green',
          },
          {
            type: 'warehousing',
            name: '进仓单/装箱单',
            cut: 'green',
          },
          {
            type: 'forwarderBill',
            // name: '货代对账单',
            name: '货代费用明细',
            cut: 'green',
          },
          {
            type: 'passBook',
            name: '通关无纸化放行书',
            cut: 'green',
          },
          {
            type: 'warehousingOrder',
            name: '入库单',
            cut: 'green',
          },
          {
            type: 'outboundOrder',
            name: '出库单',
            cut: 'green',
          },
          {
            type: 'declarationInformation',
            name: '报关资料',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'declarationInformationOther',
            name: '报关其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'customsclearanceOther',
            name: '清关其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'drawbackOther',
            name: '退税其他',
            // maxNum: 1,
            cut: 'green',
          },
          {
            type: 'otherBill',
            name: '其他',
            cut: 'green',
          },
        ];
        setKeepRecordUpload(params);
        const header = dd.filter(
          (item: any) =>
            item.type === '4' ||
            (item.type === '3' && datasuserInfo.roleCode != 'client') ||
            item.type === '2' ||
            item.type === '5',
        );
        setOrderHeader(header);
      }
      // setOrderHeader(dd);
      setOrderInfo(result);
      // console.log('_pjOrderInfo setSyncCount', syncCount + 1);
      if (!firstLoading) {
        setSyncCount(syncCount + 1);
      }
    }
    setFirstLoading(false);
  };
  const [maxNum, setmaxNum] = useState('');
  const [minNum, setminNum] = useState('');

  const _threshold = async () => {
    const result: any = await configuration();
    const formresult = result.result;
    setmaxNum(formresult.maxNum);
    setminNum(formresult.minNum);
    // console.log('initForms:', formresult);
  };

  React.useEffect(() => {
    // 首次进入滚到到头部
    window.scrollTo(0, 0);
    // console.log('window.location', window.location);
  }, []);

  React.useEffect(() => {
    // console.log('query', props?.location?.query);
    const query = props?.location?.query;
    if (query.contractNo != null) {
      document.title = '订单详情-' + query.contractNo + '-' + defaultSettings.title;
    }
    if (queryId) {
      if (query?.id != queryId) {
        history.go(0);
      }
    }
    setQueryId(query?.id);
    _pjOrderInfo(query?.id);
    _threshold();
  }, [props?.location?.query]);

  function onChangeDataInfo(value: any) {
    const data = JSON.parse(value);
    // console.log(data, '出口报关单，其他信息，返回的数据');
    setOrderInfo(data);
  }
  const _onTabClick = (v: any) => {
    // console.log(v, ref_factory);
    if (v === 2) {
      ref_factory?.current?.pjGoodsNoPageList?.();
    }
  };

  // 同步订单数据
  const _syncOrderInfo = () => {
    _pjOrderInfo(queryId);
  };

  //出口报关单识别,返回的数据
  const onChangeDataBill = (value: any) => {
    const data = JSON.parse(value);
    // console.log(data, '报关单,返回的数据');
    //需要对发票返回的数据，进行转换
    dataInfo.contractNo = data.ContrNo;
    dataInfo.bizId = data.BizId;
    dataInfo.exportTime = '';
    dataInfo.domesticSite = '';
    dataInfo.soldFor = data.TransModeValue;
    dataInfo.totalPrice = data.total;
    dataInfo.unit = data.InsurCurr;
    dataInfo.entryId = data.EntryId;
    // dataInfo.tradeName = data.TradeName;
    setOrderInfo(dataInfo);
    const newGoodsList = data.goods || [];
    newGoodsList.map((item: any, index: any) => {
      item.sort = index + 9999;
      item.fobMoney = item.declTotal;
      item.numberlabels = [
        { key: 'firstQty', label: item.firstQty },
        { key: 'secondQty', label: item.secondQty },
        { key: 'gqty', label: item.gqty },
      ];
      item.unitlabels = [
        { key: 'firstUnitValue', label: item.firstUnitValue },
        { key: 'secondUnitValue', label: item.secondUnitValue },
        { key: 'gunitValue', label: item.gunitValue },
      ];
    });
    ref_goods?.current?.setFieldsValue({
      table: newGoodsList,
    });
    //对出口发票列表进行数据处理
    // fileList
  };
  const onChangeFileIds = async (id: any) => {
    const dd = {
      id: id,
    };
    await pjFiledelete(dd);
    // fileIds.push(id);
    // setFileIds(fileIds);
  };
  //出口发票,识别返回的数据
  const onChangeDataInvoice = (value: any) => {
    const data = JSON.parse(value);
    console.log(data, '出口发票,返回的数据');
    //需要对发票返回的数据，进行转换
    // dataInfo.exportInvoiceMoney = data?.data?.totalAmount || '';
    ref_other?.current?.setFieldsValue(dataInfo);
  };
  //备案资料文件编辑
  const _pjFileEdit = async () => {
    setLoading(true);
    try {
      const keepRecordList = ref_keepRecord?.current?.getFieldsFormatValue?.() || {};
      const newFileArr: any = [];
      Object.keys(keepRecordList).forEach((key) => {
        const newObj: any = {}; //对应类型的数据
        const keyArr = keepRecordList[key] || []; // keyArr.url = keepRecordList[key].response.result || keepRecordList[key].url || []; //数据处理转化需要的形式
        const fileList: any = []; // console.log('keyArr', keyArr); // console.log('keyArr2', keepRecordList[key]);
        keyArr.map((item: any) => {
          const itemOj: any = {};
          itemOj.name = item.name;
          if (item.response?.result) {
            itemOj.url = item.response?.result; // itemOj.url = item.url;
          }
          if (item.url) {
            // itemOj.url = item.url.split('.com')[1]; // itemOj.url = item.url;
            itemOj.url = item.url; // itemOj.url = item.url;
          }
          fileList.push(itemOj);
        });
        keepRecordUpload.map((item: any) => {
          if (item.type == key) {
            newObj.name = item.name;
          }
        });
        newObj.type = key;
        newObj.fileList = fileList;
        newFileArr.push(newObj);
      });
      const JSONstr = JSON.stringify(newFileArr);
      if (!JSONstr) {
        return;
      }
      const dd = {
        type: 5,
        sourceId: queryId,
        message: JSONstr,
        id: putFileId,
      };
      const result: any = await pjFileEdit({ ...dd });
      if (result.code === 200) {
        setLoading(false);
        _syncOrderInfo();
        return;
      }
    } catch (error) {
      _syncOrderInfo();
      console.log(error);
    }
    setLoading(false);
  };
  const _pjFileAdd = async () => {
    setLoading(true);
    try {
      const keepRecordList = ref_keepRecord?.current?.getFieldsFormatValue?.() || {};

      const newFileArr: any = [];
      Object.keys(keepRecordList).forEach((key) => {
        const newObj: any = {};
        //对应类型的数据
        const keyArr = keepRecordList[key] || [];
        //数据处理转化需要的形式
        const fileList: any = [];
        keyArr.map((item: any) => {
          const itemOj: any = {};
          const img_url = item.response.result || '';
          const url = img_url;
          itemOj.name = item.name;
          itemOj.url = url;
          fileList.push(itemOj);
        });
        keepRecordUpload.map((item: any) => {
          if (item.type == key) {
            newObj.name = item.name;
          }
        });
        newObj.type = key;
        newObj.fileList = fileList;
        newFileArr.push(newObj);
      });
      if (newFileArr.length == 0) {
        return;
      }
      const JSONstr = JSON.stringify(newFileArr);
      // console.log(keepRecordList, '转换JSON数据', JSONstr);
      const dd = {
        type: 5,
        sourceId: queryId,
        message: JSONstr,
      };
      const result: any = await pjFileAdd({ ...dd });
      if (result.code === 200) {
        setLoading(false);
        _syncOrderInfo();
        return;
      }
    } catch (error) {
      _syncOrderInfo();
      console.log(error);
    }
    setLoading(false);
  };
  // const _pjFileDeleteBatch = async () => {
  //   setLoading(true);
  //   try {
  //     const dd = {
  //       ids: fileIds.join(','),
  //     };
  //     console.log('dd', dd);
  //     const result: any = await pjFileDeleteBatch({ ...dd });
  //     if (result.code === 200) {
  //       console.log('login', result);
  //       setLoading(false);
  //       return;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setLoading(false);
  // };
  // const _confimBill = async () => {
  //   const confimBills: any = {};
  //   confimBills.id = dataInfo.id;
  //   confimBills.status = 1;
  //   const result: any = await editState({ ...confimBills });
  //   if (result.code === 200) {
  //     console.log('login', result);
  //     const query = props?.location?.query;
  //     _pjOrderInfo(query?.id);
  //     setLoading(false);
  //     return;
  //   } else {
  //     setLoading(false);
  //   }
  // };
  const _pjOrderEdit = async (type: any) => {
    setLoading(true);
    try {
      const dd = ref_other?.current?.getFieldsFormatValue();
      const cc = ref_invoice?.current?.getRowsData?.();
      const goodsList = ref_goods?.current?.getRowsData?.();
      goodsList.map((item: any) => {
        item.numberlabels.map((item1: any) => {
          if (item1.key == 'firstQty') {
            item.firstQty = item1.label;
          }
          if (item1.key == 'secondQty') {
            item.secondQty = item1.label;
          }
          if (item1.key == 'gqty') {
            item.gqty = item1.label;
          }
        });
        item.unitlabels.map((item2: any) => {
          if (item2.key == 'firstUnitValue') {
            item.firstUnitValue = item2.label;
          }
          if (item2.key == 'secondUnitValue') {
            item.secondUnitValue = item2.label;
          }
          if (item2.key == 'gunitValue') {
            item.gunitValue = item2.label;
          }
        });
      });
      Object.keys(dd).forEach((key) => {
        dataInfo[key] = dd[key];
      });
      // dataInfo.fileList = cc;
      if (dataInfo.fileList) {
        dataInfo.fileList = dataInfo.fileList?.concat(cc);
      } else {
        dataInfo.fileList = cc;
      }
      dataInfo.goodsList = goodsList;
      dataInfo.currency = 'USD';
      if (type == 'confimBill') {
        dataInfo.status = 1;
      }
      const result: any = await pjOrderEdit({ ...dataInfo });
      if (result.code === 200) {
        // if (fileIds.join(',')) {
        //   await _pjFileDeleteBatch();
        // }
        if (!putFileId) {
          await _pjFileAdd();
        } else {
          await _pjFileEdit();
        }
        // if (type == 'confimBill') {
        //   _confimBill();
        // }
        setLoading(false);
        _syncOrderInfo();
        return;
      } else {
        // console.log('result', result);
        dataInfo.status = 0;
        setOrderInfo(dataInfo);
        setLoading(false);
        // _syncOrderInfo();
      }
    } catch (error) {
      setLoading(false);
      console.log('pjOrderEdit', error);
    }
  };

  //保存
  const handleSubmit = async () => {
    //订单保存
    _pjOrderEdit('saveOrder');
  };
  //确认报关单
  const confimBill = () => {
    // console.log('确认报关单', dataInfo);
    _pjOrderEdit('confimBill');
  };
  //是否开票
  const onChangeIsInvoice = (e: any) => {
    // isInvoice
    dataInfo.isInvoice = e;
    setOrderInfo(dataInfo);
  };
  const onChangePjFileEdit = (id: any) => {
    setPutFileId(id);
  };

  //确认状态
  const _pjOrdereditState = async (value: any) => {
    const editStates: any = {};
    editStates.id = dataInfo.id;
    editStates.state = value;
    // console.log('确认报关单', dataInfo);
    const reseditState = await pjOrdereditState(editStates);
    if (reseditState.code === 200) {
      _syncOrderInfo();
    }
  };
  const onChangeBillFiles = (dataFiles: any) => {
    // console.log('dataFiles', dataFiles);
    // dataInfo.isInvoice = e;
    // dataFiles.map((item: any) => {
    //   dataInfo.fileList.push(item);
    // });
    dataInfo.fileList = dataFiles;
    setOrderInfo(dataInfo);
  };
  const { Link } = Anchor;
  const handleClick = (e: any, link: any) => {
    // 阻止点击的默认事件修改路由
    e.preventDefault();
    if (link.href) {
      const ele = document.getElementById(link.href);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ele && ele.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  };
  window.addEventListener('beforeunload', (event) => {
    // console.log(window.location, event);
    if (window.location.pathname.indexOf('/order/info') != -1) {
      // 显示确认对话框
      event.preventDefault();
      // 为了兼容处理，Chrome需要设置returnValue
      event.returnValue = '请确认本页面数据保存成功再离开';
    }
  });
  return (
    <Spin spinning={firstLoading} size={'large'} delay={500}>
      <PageContainer
        header={{
          // onBack: () => window.history.back(),
          extra: [
            <Popconfirm
              key={'confirm'}
              title="确认已上传完所有资料吗？"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() =>
                // !完成请求
                {
                  _pjOrdereditState(2);
                  // const cc = ref_invoice?.current?.getRowsData?.();
                  // const goodsList = ref_goods?.current?.getRowsData?.();
                  // console.log(goodsList, cc);
                }
              }
            >
              <Button
                danger
                style={{
                  display:
                    check('/ticket/order/materialFinish') === false ||
                    dataInfo.state === 2 ||
                    // datasuserInfo.state === 1 ||
                    dataInfo.state === 3
                      ? 'none'
                      : '',
                  marginRight: '15px',
                }}
                key="1"
                type="ghost"
              >
                确认资料完结
              </Button>
            </Popconfirm>,
            <Popconfirm
              key={'confirm2'}
              title="确认完成订单吗？"
              icon={<ExclamationCircleOutlined />}
              onConfirm={() =>
                // !完成请求
                {
                  _pjOrdereditState(3);
                  // const cc = ref_invoice?.current?.getRowsData?.();
                  // const goodsList = ref_goods?.current?.getRowsData?.();
                  // console.log(goodsList, cc);
                }
              }
            >
              <Button
                style={{
                  display:
                    check('/ticket/order/finish') === false ||
                    dataInfo.state === 3 ||
                    dataInfo.state === 1
                      ? // ||
                        // datasuserInfo.state === 1
                        'none'
                      : '',
                  marginRight: '15px',
                }}
                key="button"
                type="primary"
              >
                完成订单
              </Button>
            </Popconfirm>,
            // <Button
            //   key="1"
            //   type="ghost"
            //   danger
            //   onClick={() => {
            //     // const dd = ref_other?.current?.getFieldsFormatValue();
            //     const cc = ref_invoice?.current?.getRowsData?.();
            //     const goodsList = ref_goods?.current?.getRowsData?.();
            //     console.log(goodsList, cc);
            //   }}
            // >
            //   确认资料完结
            // </Button>,
          ],
        }}
      >
        <Row id="OrderHeader">
          <Col span={24}>
            <OrderHeader
              handleSubmit={handleSubmit}
              headerData={headerData}
              dataInfo={dataInfo}
              saveLoading={loading}
            />
          </Col>
        </Row>
        <ProCard
          direction="column"
          ghost
          bordered={false}
          style={{ background: '#f0f2f5', marginTop: 20 }}
        >
          <Row gutter={10} id="OrderCustomer">
            <Col span={datasuserInfo.roleCode === 'client' ? 0 : 6}>
              <OrderCustomer
                onChangeIsInvoice={onChangeIsInvoice}
                dataInfo={dataInfo}
                syncCount={syncCount}
              />
            </Col>
            <Col span={datasuserInfo.roleCode === 'client' ? 24 : 18}>
              <OrderBill
                ref={ref_bill}
                onChangeDataBill={onChangeDataBill}
                onChangeData={onChangeDataInfo}
                dataInfo={dataInfo}
                confimBill={confimBill}
                queryId={props?.location?.query?.id}
                onChangeBillFiles={onChangeBillFiles}
                saveLoading={loading}
                syncCount={syncCount}
              />
            </Col>
          </Row>
          <Tabs defaultActiveKey="1" id="OrderGoods" onTabClick={_onTabClick}>
            <Tabs.TabPane tab="商品信息" key="1">
              <Col span={24}>
                <OrderGoods
                  ref={ref_goods}
                  headerData={headerData}
                  queryId={props?.location?.query?.id}
                  status={dataInfo.status}
                  dataInfo={dataInfo}
                  syncCount={syncCount}
                  pjOrderEdit={_syncOrderInfo}
                  maxNum={maxNum}
                  minNum={minNum}
                />
              </Col>
            </Tabs.TabPane>
            {dataInfo?.clientType === 2 || dataInfo?.comboType === 'A' ? null : (
              <Tabs.TabPane tab="工厂信息" key="2">
                <Col span={24}>
                  <OrderFactoryGoods
                    ref={ref_factory}
                    headerData={headerData}
                    queryId={props?.location?.query?.id}
                    status={dataInfo.status}
                    dataInfo={dataInfo}
                    syncCount={syncCount}
                    pjOrderEdit={_syncOrderInfo}
                  />
                </Col>
              </Tabs.TabPane>
            )}
          </Tabs>
          <Row id="OrderOther">
            <Col span={24}>
              <OrderOther
                ref={ref_other}
                onChangeData={onChangeDataInfo}
                dataInfo={dataInfo}
                syncCount={syncCount}
              />
            </Col>
          </Row>
          <Row id="OrderInvoice" style={{ display: dataInfo.comboType === 'A' ? 'none' : '' }}>
            <Col span={24}>
              <OrderInvoice
                queryId={props?.location?.query?.id}
                ref={ref_invoice}
                onChangeData={onChangeDataInvoice}
                dataInfo={dataInfo}
                onChangeFileIds={onChangeFileIds}
                syncCount={syncCount}
              />
            </Col>
          </Row>
        </ProCard>
        <Row id="OrderKeepRecord">
          <OrderKeepRecord
            ref={ref_keepRecord}
            keepRecordUpload={keepRecordUpload}
            headerData={headerData}
            dataInfo={dataInfo}
            queryId={props?.location?.query?.id}
            onChangePjFileEdit={onChangePjFileEdit}
            syncCount={syncCount}
            pjOrderEdit={_syncOrderInfo}
          />
        </Row>
        <Row id="OrderOperationLg">
          <OrderOperationLg
            queryId={props?.location?.query?.id}
            headerData={headerData}
            syncCount={syncCount}
          />
        </Row>
        <BackTop />
        <Anchor
          offsetTop={140}
          onClick={handleClick}
          // targetOffset={60}
          style={{
            position: 'fixed',
            top: '20vh',
            cursor: 'pointer',
            right: '0vw',
          }}
        >
          <Link href="#OrderHeader" title="客户信息">
            {/* <Link href="#OrderCustomer" title="客户信息" /> */}
            {/* <Link href="#OrderCustomer" title="出口报关单" /> */}
          </Link>
          <Link href="#OrderGoods" title="商品信息" />
          <Link href="#OrderOther" title="其他信息" />
          {dataInfo?.comboType === 'A' ? null : <Link href="#OrderInvoice" title="出口发票" />}
          <Link href="#OrderKeepRecord" title="备案资料" />
          <Link href="#OrderOperationLg" title="操作日志" />
        </Anchor>
      </PageContainer>
      <Prompt
        when={true}
        message={(location) => {
          // console.log(window.location, location);
          if (location.pathname === '/order/info') {
            return;
          }
          return window.confirm(`请确认本页面数据保存成功再离开?`);
        }}
      />
    </Spin>
  );
};

export default OrderInfo;
