import { BasePage } from '@/components/base';
import {
  pjClientList,
  pjComboNoPageList,
  pjOrderDelete,
  pjOrderExportXls,
  pjOrderExportDrawback,
  pjOrderkeepRecord,
  pjcostTransferOrder,
  pjOrderList,
  userNoPageList,
  pjOrderAdd,
} from '@/services/ant-design-pro/order';
import openModal from '@/utils/page';
import {
  ExclamationCircleOutlined,
  // ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { FooterToolbar } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, Select, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, history } from 'umi';
import CreateOrder from '../order/create';
import DatePicker from './components/DatePicker';
import OrderStatus from './components/OrderStatus';
export type RuleListItem = {};
const TableList: React.FC = (props) => {
  // console.log('props', props);
  const actionRef = useRef<ActionType>();
  // const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [rowHoverIndex, setRowHoverIndex] = useState<number | undefined>(undefined); // 鼠标悬停行
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); // 选中的数据id
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [datasource, setDatasource] = useState([]);
  const [newExpandedKeys, setDefaultExpanded] = useState([]);
  const [pjComboList, setPjComboList] = useState({});
  //选择tabbar 状态
  const [activeKey, setActiveKey] = useState<React.Key>('');
  const reloadAndRest = () => {
    actionRef.current?.reloadAndRest?.();
    setSelectedRows([]);
  };
  // 获取订单列表
  const _pjOrderList = async (params: any) => {
    if (props?.location.query.clientId) {
      params.clientId = props?.location.query.clientId;
    }
    // console.log('params', params);
    // if (params.exitTimeData) {
    //   params.exitTime = params.exitTimeData[0];
    //   params.exitTimeEnd = params.exitTimeData[1];
    //   delete params.exitTimeData;
    // }
    if (params.exitTime) {
      params.exportTime = params.exitTime[0];
      params.exportTimeEnd = params.exitTime[1];
      delete params.exitTime;
    }
    if (params.incomeTimeData) {
      params.incomeTime = params.incomeTimeData[0];
      params.incomeTimeEnd = params.incomeTimeData[1];
      delete params.incomeTimeData;
    }
    if (params.authenticationTimeData) {
      params.authenticationTime = params.authenticationTimeData[0];
      params.authenticationTimeEnd = params.authenticationTimeData[1];
      delete params.authenticationTimeData;
    }
    if (params.taxRefundTimeData) {
      params.taxRefundTime = params.taxRefundTimeData[0];
      params.taxRefundTimeEnd = params.taxRefundTimeData[1];
      delete params.taxRefundTimeData;
    }
    const res = await pjOrderList({
      ...params,
    });
    if (res?.code == 200) {
      const columnsArr: any = [];
      const totalList = res?.result?.total || 0;
      // const cc: any = [];
      res?.result?.records.map((item: any) => {
        const dd = item;
        dd.current = res.result.current;
        dd.size = res.result.size;
        dd.index = item.index;
        dd.total = res.result.total;
        columnsArr.push(dd);
      });
      return {
        data: columnsArr,
        // success 请返回 true，
        // 不然 table 会停止解析数据，即使有数据
        success: true,
        // 不传会使用 data 的长度，如果是分页一定要传
        total: totalList,
      };
    }
  };
  // 获取套餐列表
  const _pjComboNoPageList = async () => {
    const res = await pjComboNoPageList();
    if (res?.code == 200) {
      const dd = res?.result || [];
      const pjComboData = {};
      dd.map((item: any) => {
        const obj: any = {};
        obj.text = item.name;
        obj.comboType = item.comboType;
        pjComboData[item.comboType] = obj;
      });
      setPjComboList(pjComboData);
    }
  };
  // 删除列表
  const _pjOrderDelete = async (id: any) => {
    const res = await pjOrderDelete({
      id,
    });
    if (res.code == 200) {
      setTimeout(() => {
        reloadAndRest();
      }, 500);
    }
  };
  useEffect(() => {
    _pjComboNoPageList();
  }, []);
  //路由校验及获取
  const urlDatas = `${localStorage.getItem('auths')}`;
  const urlData = JSON.parse(urlDatas);
  const check = (url: any) => {
    if (!urlData) {
      return false;
    }
    return urlData.some((item: any) => item.url == url);
  };
  const userInfo = `${localStorage.getItem('userInfo')}`;
  const datasuserInfo = JSON.parse(userInfo);
  // console.log('datas', datasuserInfo);
  // 导出出口列表
  const _pjOrderExportXls = async (id: any, clientNameStr: any) => {
    const res = await pjOrderExportXls({
      ids: id,
    });
    const url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1;
    const date = nowDate.getDate();
    link.setAttribute(
      'download',
      clientNameStr +
        '出口明细' +
        year +
        (month > 9 ? month : '0' + month) +
        (date > 9 ? date : '0' + date) +
        '.xlsx',
    );
    // document.body.appendChild(link);
    link.click();
    // document.body.removeChild(link); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
  };
  // 导出退税列表
  const _pjOrderExportDrawback = async (id: any, clientNameStr: any) => {
    const res = await pjOrderExportDrawback({
      ids: id,
    });
    const url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1;
    const date = nowDate.getDate();
    link.setAttribute(
      'download',
      clientNameStr +
        '退税明细' +
        year +
        (month > 9 ? month : '0' + month) +
        (date > 9 ? date : '0' + date) +
        '.xlsx',
    );
    // document.body.appendChild(link);
    link.click();
    // document.body.removeChild(link); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
  };
  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      search: false,
      width: 60,
      align: 'center',
      render(text: any, record: any, index: any) {
        // console.log('record', text, record, index);
        return (
          <span style={{ fontSize: 14 }}>
            {record.total - record.size * (record.current - 1) - index}
          </span>
        );
      },
    },
    {
      title: '客户名称',
      dataIndex: 'clientId',
      hideInTable: true,
      width: 120,
      align: 'center',
      valueType: 'select',
      search: datasuserInfo.roleCode === 'client' ? false : true,
      fieldProps: {
        showSearch: true,
      },
      request: async () => {
        const result: any = await pjClientList();
        const columnsArr: any[] = result.result || [];
        const res: any = [];
        columnsArr.map((item) => {
          const temp: any = {};
          temp.label = item.name;
          temp.value = item.id.toString();
          res.push(temp);
        });
        return res;
      },
    },
    {
      title: '客户名称',
      dataIndex: 'clientName',
      hideInTable: datasuserInfo.roleCode === 'client' ? true : false,
      width: 120,
      search: false,
      align: 'center',
    },
    // {
    //   title: '外商名称',
    //   dataIndex: 'foreignName',
    //   hideInTable: datasuserInfo.roleCode === 'client' ? false : true,
    //   width: 120,
    //   search: false,
    //   align: 'center',
    // },
    {
      title: '订单标签',
      key: 'tag',
      search: datasuserInfo.roleCode === 'client' ? false : true,
      hideInTable: true,
      dataIndex: 'tag',
      valueType: 'select',
      align: 'center',
      // request: async () => [
      //   {
      //     label: '进项发票未开',
      //     value: 'incomeState_0',
      //   },
      //   {
      //     label: '进项发票已开',
      //     value: 'incomeState_1',
      //   },
      //   {
      //     label: '进项发票未认证',
      //     value: 'authenticationState_0',
      //   },
      //   {
      //     label: '进项发票已认证',
      //     value: 'authenticationState_1',
      //   },
      //   {
      //     label: '出口发票未开',
      //     value: 'exitState_0',
      //   },
      //   {
      //     label: '出口发票已开',
      //     value: 'exitState_1',
      //   },
      //   {
      //     label: '退税未申报',
      //     value: 'taxRefundState_0',
      //   },
      //   {
      //     label: '退税已申报',
      //     value: 'taxRefundState_1',
      //   },
      //   {
      //     label: '备案资料未传',
      //     value: 'filingState_0',
      //   },
      //   {
      //     label: '备案资料上传',
      //     value: 'filingState_1',
      //   },
      //   {
      //     label: '未付款',
      //     value: 'arrearageState_0',
      //   },
      //   {
      //     label: '已付款',
      //     value: 'arrearageState_1',
      //   },
      //   {
      //     label: '资料未下载',
      //     value: 'isDownload_0',
      //   },
      //   {
      //     label: '资料已下载',
      //     value: 'isDownload_1',
      //   },
      // ],
      renderFormItem: () => {
        const options = [
          {
            label: '进项发票未开',
            value: 'incomeState_0',
          },
          {
            label: '进项发票已开',
            value: 'incomeState_1',
          },
          {
            label: '进项发票未认证',
            value: 'authenticationState_0',
          },
          {
            label: '进项发票已认证',
            value: 'authenticationState_1',
          },
          {
            label: '出口发票未开',
            value: 'exitState_0',
          },
          {
            label: '出口发票已开',
            value: 'exitState_1',
          },
          {
            label: '退税未申报',
            value: 'taxRefundState_0',
          },
          {
            label: '退税已申报',
            value: 'taxRefundState_1',
          },
          {
            label: '备案资料未传',
            value: 'filingState_0',
          },
          {
            label: '备案资料上传',
            value: 'filingState_1',
          },
          {
            label: '未付款',
            value: 'arrearageState_0',
          },
          {
            label: '已付款',
            value: 'arrearageState_1',
          },
          {
            label: '资料未下载',
            value: 'isDownload_0',
          },
          {
            label: '资料已下载',
            value: 'isDownload_1',
          },
        ];
        return <Select mode="multiple" showSearch placeholder="选择订单标签" options={options} />;
      },
    },
    {
      title: '订单标签',
      key: 'tag',
      search: datasuserInfo.roleCode === 'client' ? true : false,
      hideInTable: true,
      dataIndex: 'tag',
      valueType: 'select',
      align: 'center',
      // request: async () => [
      //   {
      //     label: '进项发票未开',
      //     value: 'incomeState_0',
      //   },
      //   {
      //     label: '进项发票已开',
      //     value: 'incomeState_1',
      //   },
      //   {
      //     label: '进项发票未认证',
      //     value: 'authenticationState_0',
      //   },
      //   {
      //     label: '进项发票已认证',
      //     value: 'authenticationState_1',
      //   },
      //   {
      //     label: '出口发票未开',
      //     value: 'exitState_0',
      //   },
      //   {
      //     label: '出口发票已开',
      //     value: 'exitState_1',
      //   },
      //   {
      //     label: '退税未申报',
      //     value: 'taxRefundState_0',
      //   },
      //   {
      //     label: '退税已申报',
      //     value: 'taxRefundState_1',
      //   },
      //   {
      //     label: '备案资料未传',
      //     value: 'filingState_0',
      //   },
      //   {
      //     label: '备案资料上传',
      //     value: 'filingState_1',
      //   },
      //   {
      //     label: '资料未下载',
      //     value: 'isDownload_0',
      //   },
      //   {
      //     label: '资料已下载',
      //     value: 'isDownload_1',
      //   },
      //   // {
      //   //   label: '未付款',
      //   //   value: 'arrearageState_0',
      //   // },
      //   // {
      //   //   label: '已付款',
      //   //   value: 'arrearageState_1',
      //   // },
      // ],
      renderFormItem: () => {
        const options = [
          {
            label: '进项发票未开',
            value: 'incomeState_0',
          },
          {
            label: '进项发票已开',
            value: 'incomeState_1',
          },
          {
            label: '进项发票未认证',
            value: 'authenticationState_0',
          },
          {
            label: '进项发票已认证',
            value: 'authenticationState_1',
          },
          {
            label: '出口发票未开',
            value: 'exitState_0',
          },
          {
            label: '出口发票已开',
            value: 'exitState_1',
          },
          {
            label: '退税未申报',
            value: 'taxRefundState_0',
          },
          {
            label: '退税已申报',
            value: 'taxRefundState_1',
          },
          {
            label: '备案资料未传',
            value: 'filingState_0',
          },
          {
            label: '备案资料上传',
            value: 'filingState_1',
          },
          // {
          //   label: '未付款',
          //   value: 'arrearageState_0',
          // },
          // {
          //   label: '已付款',
          //   value: 'arrearageState_1',
          // },
          {
            label: '资料未下载',
            value: 'isDownload_0',
          },
          {
            label: '资料已下载',
            value: 'isDownload_1',
          },
        ];
        return <Select mode="multiple" showSearch placeholder="选择订单标签" options={options} />;
      },
    },
    {
      title: '合同协议号',
      dataIndex: 'contractNo',
      width: 100,
      search: false,
      align: 'center',
    },
    {
      title: '合同协议号',
      dataIndex: 'contractNo',
      hideInTable: true,
      align: 'center',
    },
    {
      title: '客户类型',
      key: 'clientType',
      search: datasuserInfo.roleCode === 'client' ? false : true,
      hideInTable: true,
      dataIndex: 'clientType',
      valueType: 'select',
      align: 'center',
      valueEnum: {
        1: {
          text: '贸易型企业',
        },
        2: {
          text: '生产型企业',
        },
      },
      // request: async () => [
      //   {
      //     label: '贸易型企业',
      //     value: 1,
      //   },
      //   {
      //     label: '生产型企业',
      //     value: 2,
      //   },
      // ],
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 80,
      initialValue: 'all',
      align: 'center',
      search: false,
      render: (h, row: any) => {
        // const text = row?.state == 1 ? '待完成' : row?.state == 2 ? '待下载' : '已完成';
        const text = row?.state == 3 ? '已完成' : '待完成';
        return <span style={{ fontSize: 14 }}>{text}</span>;
      },
    },
    {
      title: '出口日期',
      dataIndex: 'exitTime',
      width: 100,
      hideInTable: true,
      valueType: 'dateRange',
      align: 'center',
    },
    {
      title: '出口日期',
      dataIndex: 'exportTime',
      width: 100,
      search: false,
      align: 'center',
    },
    {
      title: '进项发票日期',
      dataIndex: 'incomeTimeData',
      hideInTable: true,
      valueType: 'dateRange',
      align: 'center',
    },
    {
      title: '认证日期',
      dataIndex: 'authenticationTimeData',
      hideInTable: true,
      valueType: 'dateRange',
      align: 'center',
    },
    {
      title: '退税申报日期',
      dataIndex: 'taxRefundTimeData',
      hideInTable: true,
      valueType: 'dateRange',
      align: 'center',
    },
    {
      title: '套餐类型',
      key: 'comboType',
      hideInTable: true,
      search: datasuserInfo.roleCode === 'client' ? false : true,
      dataIndex: 'comboType',
      valueType: 'select',
      align: 'center',
      valueEnum: pjComboList,
    },
    {
      title: '客服名称',
      dataIndex: 'allot',
      hideInTable: true,
      align: 'center',
      valueType: 'select',
      search: datasuserInfo.roleCode === 'client' ? false : true,
      fieldProps: {
        showSearch: true,
      },
      request: async () => {
        const result: any = await userNoPageList();
        const columnsArr: any[] = result.result || [];
        const res: any = [];
        columnsArr.map((item) => {
          const temp: any = {};
          temp.label = item.realname;
          temp.value = item.id;
          res.push(temp);
        });
        return res;
      },
    },
    {
      title: '进项发票逾期',
      key: 'overdueState',
      hideInTable: true,
      dataIndex: 'overdueState',
      valueType: 'select',
      align: 'center',
      request: async () => [
        {
          label: '未逾期',
          value: '0',
        },
        {
          label: '逾期',
          value: '1',
        },
      ],
    },
    {
      title: '总价/币值',
      dataIndex: 'sumPrice',
      width: 100,
      search: false,
      align: 'center',
      render: (h, row: any) => {
        return (
          <span style={{ fontSize: 14 }}>
            {row.sumPrice}/{row.unit}
          </span>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 100,
      search: false,
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 100,
      search: false,
      align: 'center',
    },
    {
      title: '所属客服',
      dataIndex: 'allotName',
      // hideInTable: datasuserInfo.roleCode === 'client' ? true : false,
      width: 80,
      search: false,
      align: 'center',
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      render: (text, row: any) => [
        <a
          key="edit"
          target="_blank"
          // style={{ display: check('/ticket/order/edit') === true ? '' : 'none' }}
          href={
            row.contractNo != null
              ? window.location.protocol +
                '//' +
                window.location.host +
                '/order/info?action=edit&id=' +
                row.id +
                '&contractNo=' +
                row.contractNo
              : window.location.protocol +
                '//' +
                window.location.host +
                '/order/info?action=edit&id=' +
                row.id
          }
          rel="noreferrer"
          // onClick={() => {
          // }}
        >
          {check('/ticket/order/edit') === false || row.state === 3 ? '查看' : '编辑'}
        </a>,
        // <a
        //   key="edit"
        //   onClick={() => {
        //     history.push(`/order/info?action=edit&id=${row.id}`);
        //   }}
        // >
        //   {check('/ticket/order/edit') === false || row.state === 3 ? '查看' : '编辑'}
        // </a>,
        <Popconfirm
          key={'delete'}
          title="确认要删除该数据吗？"
          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => {
            // console.log(row, text);
            _pjOrderDelete(row?.id);
          }}
        >
          <a
            type="link"
            style={{
              color: '#ff4d4f',
              display: check('/ticket/order/delete') === true ? '' : 'none',
            }}
          >
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];
  // 导出成本结转单
  const _pjcostTransferOrder = async (id: any, clientNameStr: any) => {
    const res = await pjcostTransferOrder({
      ids: id,
    });
    const url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1;
    const date = nowDate.getDate();
    link.setAttribute(
      'download',
      clientNameStr +
        '成本转结单' +
        year +
        (month > 9 ? month : '0' + month) +
        (date > 9 ? date : '0' + date) +
        '.xlsx',
    );
    // document.body.appendChild(link);
    link.click();
    // document.body.removeChild(link); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
  };
  // 导出备案资料状态
  const _pjOrderkeepRecord = async (id: any, clientNameStr: any) => {
    const res = await pjOrderkeepRecord({
      ids: id,
    });
    const url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1;
    const date = nowDate.getDate();
    link.setAttribute(
      'download',
      clientNameStr +
        '备案资料' +
        year +
        (month > 9 ? month : '0' + month) +
        (date > 9 ? date : '0' + date) +
        '.xlsx',
    );
    // document.body.appendChild(link);
    link.click();
    // document.body.removeChild(link); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
  };

  // 手动选择/取消选择某行
  const tableSelect = (record: any, selected: any) => {
    //如果选中某一行，把选中的这行数据及id分别存到selectedRowsState、selectedRowKeys中
    if (selected) {
      const arr = selectedRowsState.map((item: any) => {
        return item.id;
      });
      setSelectedRowKeys([...arr, record.id]);
      // console.log('xx', selectedRowsState);
      setSelectedRows([...selectedRowsState, record]);
      //取消选中，则在selectedRowsState、selectedRowKeys中过滤掉这条数据
    } else {
      const newData = selectedRowsState.filter((item: any) => item.id !== record.id);
      // console.log('xx', newData);
      setSelectedRows(newData);
      const arr = newData.map((item: any) => {
        return item.id;
      });
      setSelectedRowKeys([...arr]);
    }
  };
  // 表格全选/取消全选
  const tableSelectAll = (selected: any, selectedRows: any, changeRows: any) => {
    //selected返回的是booler，true为全选，false为取消全选
    //changeRows是操作中发生了改变的数据
    //取消全选，把取消的数据过滤掉，
    // console.log('changeRows', selected, changeRows);
    if (!selected) {
      // console.log('changeRows2', changeRows);
      // changeRows.forEach((row: any) => {
      //   const newData = selectedRowsState.filter((item: any) => item.id !== row.id);
      //   setSelectedRows(newData);
      // });
      // const arr = changeRows.map((item: any) => item.id);
      // const newArr = selectedRowKeys.filter((item: any) => !arr.some((ele: any) => ele === item));
      // setSelectedRowKeys([...newArr]);
      setSelectedRowKeys([]);
      setSelectedRows([]);
    }
    //全选，把
    else {
      // console.log('xx', selectedRowsState);
      const arr = changeRows.map((item: any) => item.id);
      setSelectedRows([...selectedRowsState, ...changeRows]);
      setSelectedRowKeys([...selectedRowKeys, ...arr]);
    }
  };
  const onCleanSelected = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  return (
    <BasePage>
      <ProTable<API.RuleListItem, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        // request={rule}
        // bordered
        cardBordered
        columns={columns}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values: any, type) => {
            console.log('syncToUrl', type, values, history.location.query);
            if (type === 'get') {
              const data = { ...values, ...history.location.query };
              return data;
            } else {
              return values;
            }
          },
        }}
        request={async (params: {}, sort, filter) => {
          console.log(params, sort, filter);
          const dd: any = params;
          //标签筛选数据处理
          (dd.tag || []).map((item: any) => {
            const tagStr = item || '';
            const tagArr = tagStr.split('_');
            const tagKey = tagArr[0];
            const tagValue = tagArr[1].toString();
            if (dd[tagKey]) {
              dd[tagKey] = `${dd[tagKey]}` + ',' + `${tagValue}`;
            } else {
              dd[tagKey] = tagValue;
            }
          });
          // const tagStr = dd.tag || '';
          // const tagArr = tagStr.split('_');
          // const tagKey = tagArr[0];
          // const tagValue = tagArr[1];
          // dd[tagKey] = tagValue;
          dd.state = activeKey;
          dd.column = 'createTime';
          dd.order = 'desc';
          dd.pageNo = params.current;
          const res: any = await _pjOrderList(dd);
          // console.log(res, 99888);
          return res;
          // const totalList = msg?.result?.total || 0;
          // setListTotal(totalList);
        }}
        dataSource={datasource}
        postData={(data: any[]) => {
          const arr: any = [];
          data.map((item: any) => {
            arr.push(item.id);
          });
          setDatasource(data);
          setDefaultExpanded(arr);
        }}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: activeKey,
            items: [
              {
                key: ' ',
                label: <span>全部</span>,
              },
              {
                key: '1',
                label: <span>待完成</span>,
              },
              // {
              //   key: '2',
              //   label: <span>待下载</span>,
              // },
              {
                key: '3',
                label: <span>已完成</span>,
              },
            ],
            onChange: (key) => {
              // console.log(key);
              setActiveKey(key as string);
              reloadAndRest();
              // params.state = key as string;
              // _pjOrderList(params);
            },
          },
          actions: [
            <Button
              key="primary"
              icon={<PlusOutlined />}
              style={{ display: check('/ticket/order/add') === true ? '' : 'none' }}
              onClick={async () => {
                if (datasuserInfo.roleCode === 'client') {
                  const result: any = await pjOrderAdd();
                  if (result.code === 200) {
                    openModal.closeModal();
                    setTimeout(() => {
                      const data =
                        window.location.protocol +
                        '//' +
                        window.location.host +
                        '/order/info?action=edit&id=' +
                        result.result;
                      window.open(data);
                      // history.push(`/order/info?action=add&id=${result.result}`);
                    }, 500);
                    return;
                  }
                } else {
                  openModal.showModal(<CreateOrder />, {
                    title: '新建订单',
                    footer: null,
                  });
                }
              }}
              type="primary"
            >
              新建订单
            </Button>,
          ],
        }}
        expandable={{
          expandedRowRender: (record: any) => {
            return <OrderStatus record={record} />;
          },
          expandedRowClassName: (record, index) => {
            // console.log('call expandedRowClassName', record, index, indent);
            if (index % 2 == 0) {
              // 如果是悬浮行，白色则需要设置成灰色
              if (index === rowHoverIndex) {
                return 'expanded-row-class-name-hover';
              }
              // 偶数行白色
              return 'expanded-row-class-name';
            } else {
              // 奇数行灰色
              return 'expanded-row-class-name-hover';
            }
          },
          // defaultExpandAllRows: true,
          showExpandColumn: false,
          expandedRowKeys: [...newExpandedKeys],
        }}
        rowClassName={(record, index) => {
          if (index % 2 == 0) {
            // 偶数行白色
            return 'table-row-ff';
          } else {
            // 奇数行灰色
            return 'table-row-fa';
          }
        }}
        onRow={(record: any, index: number | undefined) => {
          return {
            // 鼠标移入行
            onMouseEnter: () => {
              setRowHoverIndex(index);
            },
            // 鼠标移出行
            onMouseLeave: () => {
              setRowHoverIndex(undefined);
            },
          };
        }}
        pagination={{
          pageSize: 10,
          size: 'default',
          simple: false,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 100, 200, 1000, 2000],
        }}
        rowSelection={{
          // onChange: (selectedRowKeys, selectedRows) => {
          //   console.log('xx', selectedRowsState);
          //   console.log('xx2', selectedRowKeys);
          //   selectedRows.map((item: any) => {
          //     selectedRowsState.push(item);
          //   });
          //   setSelectedRows(selectedRowsState);
          //   console.log('xx', selectedRows);
          // },
          selectedRowKeys: selectedRowKeys, //展示选中的数据
          onSelect: tableSelect, //单条数据取消/选中的回调
          onSelectAll: tableSelectAll, //全选/取消全选的回调
        }}
        tableAlertRender={({}) => (
          <Space size={24}>
            <span>已选 {selectedRowsState.length} 项</span>
          </Space>
        )}
        tableAlertOptionRender={({}) => (
          <Space size={24}>
            <Button
              type="primary"
              style={{ display: check('/ticket/order/authenticationTime') === true ? '' : 'none' }}
              onClick={() => {
                const targetId = 'abc1';
                openModal.showModal(
                  <DatePicker
                    mode={'modal'}
                    type={1}
                    selectedRows={selectedRowsState}
                    action={'add'}
                    submitTarget={targetId}
                    reloadAndRest={reloadAndRest}
                  />,
                  {
                    title: '批量认证时间',
                    footer: <div id={targetId} />,
                  },
                );
              }}
            >
              批量认证时间
            </Button>
            <Button
              type="primary"
              style={{ display: check('/ticket/order/taxRefundTime') === true ? '' : 'none' }}
              onClick={() => {
                const targetId = 'abc1';
                openModal.showModal(
                  <DatePicker
                    mode={'modal'}
                    type={2}
                    selectedRows={selectedRowsState}
                    action={'add'}
                    submitTarget={targetId}
                    reloadAndRest={reloadAndRest}
                  />,
                  {
                    title: '批量申报时间',
                    footer: <div id={targetId} />,
                  },
                );
              }}
            >
              批量申报时间
            </Button>
            <Button
              type="primary"
              style={{ display: check('/ticket/order/drawbackTime') === true ? '' : 'none' }}
              onClick={() => {
                const targetId = 'abc1';
                openModal.showModal(
                  <DatePicker
                    mode={'modal'}
                    type={3}
                    selectedRows={selectedRowsState}
                    action={'add'}
                    submitTarget={targetId}
                    reloadAndRest={reloadAndRest}
                  />,
                  {
                    title: '批量退税时间',
                    footer: <div id={targetId} />,
                  },
                );
              }}
            >
              批量退税时间
            </Button>
            <Button
              type="primary"
              style={{ display: check('/ticket/order/arrearageTime') === true ? '' : 'none' }}
              onClick={() => {
                const targetId = 'abc1';
                openModal.showModal(
                  <DatePicker
                    mode={'modal'}
                    type={4}
                    selectedRows={selectedRowsState}
                    action={'add'}
                    submitTarget={targetId}
                    reloadAndRest={reloadAndRest}
                  />,
                  {
                    title: '批量付款时间',
                    footer: <div id={targetId} />,
                  },
                );
              }}
            >
              批量付款时间
            </Button>
            <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
              取消选择
            </a>
          </Space>
        )}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              // handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        options={{
          fullScreen: true,
          reload: true,
          setting: true,
          density: true,
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <Space size={24}>
                <span>已选 {selectedRowsState.length} 项</span>
                <span>{`进项发票金额合计： ${selectedRowsState.reduce(
                  (pre: any, item: any) =>
                    (parseFloat(pre) + parseFloat(item.inputInvoiceMoney || 0)).toFixed(2),
                  // console.log(item)
                  0,
                )} `}</span>
                <span>{`退税金额合计： ${selectedRowsState.reduce(
                  (pre: any, item: any) =>
                    (parseFloat(pre) + parseFloat(item.drawbackMoney || 0)).toFixed(2),
                  0,
                )} `}</span>
                <span
                  style={{
                    display: datasuserInfo.roleCode === 'client' ? 'none' : '',
                  }}
                >{`服务费合计： ${selectedRowsState.reduce(
                  (pre: any, item: any) =>
                    (parseFloat(pre) + parseFloat(item.serviceCharge || 0)).toFixed(2),
                  0,
                )} `}</span>
              </Space>
            </div>
          }
        >
          <Button
            type="primary"
            style={{ display: check('/ticket/order/excel') === true ? '' : 'none' }}
            onClick={async () => {
              const idArr: any = [];
              selectedRowsState.map((item: any) => {
                idArr.push(item.id);
              });
              const sortedList: any = selectedRowsState.sort(function (a: any, b: any) {
                return b.createTime < a.createTime ? 1 : -1;
              });
              // console.log('selectedRowsState', sortedList);
              const clientNameStr = sortedList[0].clientName;
              const idStr = idArr.join(',');
              _pjOrderExportXls(idStr, clientNameStr);
              // await handleRemove(selectedRowsState);
              // setSelectedRows([]);
              // actionRef.current?.reloadAndRest?.();
            }}
          >
            导出出口明细表
          </Button>
          <Button
            type="primary"
            style={{ display: check('/ticket/order/exportDrawback') === true ? '' : 'none' }}
            onClick={async () => {
              const idArr: any = [];
              selectedRowsState.map((item: any) => {
                idArr.push(item.id);
              });
              const sortedList: any = selectedRowsState.sort(function (a: any, b: any) {
                return b.createTime < a.createTime ? 1 : -1;
              });
              // console.log('selectedRowsState', sortedList);
              const clientNameStr = sortedList[0].clientName;
              const idStr = idArr.join(',');
              _pjOrderExportDrawback(idStr, clientNameStr);
              // await handleRemove(selectedRowsState);
              // setSelectedRows([]);
              // actionRef.current?.reloadAndRest?.();
            }}
          >
            导出退税明细表
          </Button>
          <Button
            type="primary"
            style={{ display: check('/ticket/order/reference/export') === true ? '' : 'none' }}
            onClick={async () => {
              const idArr: any = [];
              selectedRowsState.map((item: any) => {
                idArr.push(item.id);
              });
              const sortedList: any = selectedRowsState.sort(function (a: any, b: any) {
                return b.createTime < a.createTime ? 1 : -1;
              });
              // console.log('selectedRowsState', sortedList);
              const clientNameStr = sortedList[0].clientName;
              const idStr = idArr.join(',');
              _pjOrderkeepRecord(idStr, clientNameStr);
              // await handleRemove(selectedRowsState);
              // setSelectedRows([]);
              // actionRef.current?.reloadAndRest?.();
            }}
          >
            导出备案完成状态
          </Button>
          <Button
            type="primary"
            style={{ display: check('/ticket/order/costTransferOrder') === true ? '' : 'none' }}
            onClick={async () => {
              const idArr: any = [];
              selectedRowsState.map((item: any) => {
                idArr.push(item.id);
              });
              const sortedList: any = selectedRowsState.sort(function (a: any, b: any) {
                return b.createTime < a.createTime ? 1 : -1;
              });
              const clientNameStr = sortedList[0].clientName;
              const idStr = idArr.join(',');
              _pjcostTransferOrder(idStr, clientNameStr);
            }}
          >
            导出成本结转单
          </Button>
        </FooterToolbar>
      )}
    </BasePage>
  );
};

export default TableList;
