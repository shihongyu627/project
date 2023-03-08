import { PageContainer } from '@ant-design/pro-layout';
import {
  BackTop,
  Button,
  Col,
  Collapse,
  List,
  //  message,
  // Popconfirm,
  Row,
  Statistic,
} from 'antd';
import React, {
  useEffect,
  //  useRef,
  useState,
} from 'react';
// import { useIntl } from 'umi';
// import styles from './Welcome.less';
import {
  // pjClientList,
  // pjComboNoPageList,
  // pjOrderDelete,
  // pjOrderList,
  pjOrderworkbench,
  // userNoPageList,
  pjOrderAdd,
} from '@/services/ant-design-pro/order';
import { page } from '@/utils';
import openModal from '@/utils/page';
// import {
//   // CloseCircleOutlined,
//   ExclamationCircleOutlined,
// } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
// import type { ActionType, ProColumns } from '@ant-design/pro-table';
// import ProTable from '@ant-design/pro-table';
import { history } from 'umi';
// import OrderStatus from './order/components/OrderStatus';
import CreateOrder from './order/create';
import CreateAccount from './system/account/edit';
import CreateDepartment from './system/department/edit';
import { pjIssue, pjGuide } from '@/services/ant-design-pro/issue';
import { Input } from 'antd';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];
const { Search } = Input;
// type GithubIssueItem = {
//   id: number;
//   number: number;
//   title: string;
//   labels: {
//     name: string;
//     color: string;
//   }[];
//   state: string;
//   comments: number;
//   created_at: string;
//   updated_at: string;
// };
const { Panel } = Collapse;
const Welcome: React.FC = () => {
  // const actionRef = useRef<ActionType>();
  //表单加载
  //获取订单列表
  // const [rowHoverIndex, setRowHoverIndex] = useState<number | undefined>(undefined); // 鼠标悬停行
  // const [datasource, setDatasource] = useState([]);
  const [allData, setAllData] = useState<object>({});
  // const [pjComboList, setPjComboList] = useState({});
  // const [newExpandedKeys, setDefaultExpanded] = useState([]);
  // const reloadAndRest = () => {
  //   actionRef.current?.reloadAndRest?.();
  // };
  // 获取订单列表
  // const _pjOrderList = async (params: any) => {
  //   // if (params.exitTimeData) {
  //   //   params.exitTime = params.exitTimeData[0];
  //   //   params.exitTimeEnd = params.exitTimeData[1];
  //   //   delete params.exitTimeData;
  //   // }
  //   if (params.exitTime) {
  //     params.exportTime = params.exitTime[0];
  //     params.exportTimeEnd = params.exitTime[1];
  //     delete params.exitTime;
  //   }
  //   if (params.incomeTimeData) {
  //     params.incomeTime = params.incomeTimeData[0];
  //     params.incomeTimeEnd = params.incomeTimeData[1];
  //     delete params.incomeTimeData;
  //   }
  //   if (params.authenticationTimeData) {
  //     params.authenticationTime = params.authenticationTimeData[0];
  //     params.authenticationTimeEnd = params.authenticationTimeData[1];
  //     delete params.authenticationTimeData;
  //   }
  //   if (params.taxRefundTimeData) {
  //     params.taxRefundTime = params.taxRefundTimeData[0];
  //     params.taxRefundTimeEnd = params.taxRefundTimeData[1];
  //     delete params.taxRefundTimeData;
  //   }
  //   const res = await pjOrderList({
  //     ...params,
  //   });
  //   if (res?.code == 200) {
  //     const columnsArr: any = [];
  //     const totalList = res?.result?.total || 0;
  //     res?.result?.records.map((item: any) => {
  //       const dd = item;
  //       dd.current = res.result.current;
  //       dd.size = res.result.size;
  //       dd.index = item.index;
  //       dd.total = res.result.total;
  //       columnsArr.push(dd);
  //     });
  //     return {
  //       data: columnsArr,
  //       // success 请返回 true，
  //       // 不然 table 会停止解析数据，即使有数据
  //       success: true,
  //       // 不传会使用 data 的长度，如果是分页一定要传
  //       total: totalList,
  //     };
  //   }
  // };
  // 删除列表
  // const _pjOrderDelete = async (id: any) => {
  //   try {
  //     const res = await pjOrderDelete({
  //       id,
  //     });
  //     message.success(res.message);
  //     if (res.code == 200) {
  //       setTimeout(() => {
  //         reloadAndRest();
  //       }, 500);
  //     }
  //   } catch (error) {
  //     message.error('请求错误');
  //   }
  // };
  const _pjOrderworkbench = async () => {
    const res = await pjOrderworkbench({});
    setAllData(res.result || {});
  };
  // 获取套餐列表
  // const _pjComboNoPageList = async () => {
  //   const res = await pjComboNoPageList();
  //   if (res?.code == 200) {
  //     const dd = res?.result || [];
  //     const pjComboData = {};
  //     dd.map((item: any) => {
  //       const obj: any = {};
  //       obj.text = item.name;
  //       obj.comboType = item.comboType;
  //       pjComboData[item.comboType] = obj;
  //     });
  //     setPjComboList(pjComboData);
  //   }
  // };

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
  // const columns: ProColumns<GithubIssueItem>[] = [
  //   {
  //     title: '序号',
  //     dataIndex: 'id',
  //     search: false,
  //     width: 60,
  //     align: 'center',
  //     render(text: any, record: any, index: any) {
  //       // console.log('record', text, record, index);
  //       return (
  //         <span style={{ fontSize: 14 }}>
  //           {record.total - record.size * (record.current - 1) - index}
  //         </span>
  //       );
  //     },
  //   },
  //   {
  //     title: '客户名称',
  //     dataIndex: 'clientId',
  //     hideInTable: true,
  //     width: 120,
  //     align: 'center',
  //     valueType: 'select',
  //     search: datasuserInfo.roleCode === 'client' ? false : true,
  //     fieldProps: {
  //       showSearch: true,
  //     },
  //     request: async () => {
  //       const result: any = await pjClientList();
  //       const columnsArr: any[] = result.result || [];
  //       const res: any = [];
  //       columnsArr.map((item) => {
  //         const temp = {};
  //         temp.label = item.name;
  //         temp.value = item.id.toString();
  //         res.push(temp);
  //       });
  //       return res;
  //     },
  //   },
  //   {
  //     title: '客户名称',
  //     dataIndex: 'clientName',
  //     hideInTable: datasuserInfo.roleCode === 'client' ? true : false,
  //     width: 120,
  //     search: false,
  //     align: 'center',
  //   },
  //   {
  //     title: '外商名称',
  //     dataIndex: 'foreignName',
  //     hideInTable: datasuserInfo.roleCode === 'client' ? false : true,
  //     width: 120,
  //     search: false,
  //     align: 'center',
  //   },
  //   {
  //     title: '订单标签',
  //     key: 'tag',
  //     search: datasuserInfo.roleCode === 'client' ? false : true,
  //     hideInTable: true,
  //     dataIndex: 'tag',
  //     valueType: 'select',
  //     align: 'center',
  //     request: async () => [
  //       {
  //         label: '进项发票未开',
  //         value: 'incomeState_0',
  //       },
  //       {
  //         label: '进项发票已开',
  //         value: 'incomeState_1',
  //       },
  //       {
  //         label: '进项发票未认证',
  //         value: 'authenticationState_0',
  //       },
  //       {
  //         label: '进项发票已认证',
  //         value: 'authenticationState_1',
  //       },
  //       {
  //         label: '出口发票未开',
  //         value: 'exitState_0',
  //       },
  //       {
  //         label: '出口发票已开',
  //         value: 'exitState_1',
  //       },
  //       {
  //         label: '退税未申报',
  //         value: 'taxRefundState_0',
  //       },
  //       {
  //         label: '退税已申报',
  //         value: 'taxRefundState_1',
  //       },
  //       {
  //         label: '备案资料未传',
  //         value: 'filingState_0',
  //       },
  //       {
  //         label: '备案资料上传',
  //         value: 'filingState_1',
  //       },
  //       {
  //         label: '未付款',
  //         value: 'arrearageState_0',
  //       },
  //       {
  //         label: '已付款',
  //         value: 'arrearageState_1',
  //       },
  //       {
  //         label: '资料未下载',
  //         value: 'isDownload_0',
  //       },
  //       {
  //         label: '资料已下载',
  //         value: 'isDownload_1',
  //       },
  //     ],
  //   },
  //   {
  //     title: '订单标签',
  //     key: 'tag',
  //     search: datasuserInfo.roleCode === 'client' ? true : false,
  //     hideInTable: true,
  //     dataIndex: 'tag',
  //     valueType: 'select',
  //     align: 'center',
  //     request: async () => [
  //       {
  //         label: '进项发票未开',
  //         value: 'incomeState_0',
  //       },
  //       {
  //         label: '进项发票已开',
  //         value: 'incomeState_1',
  //       },
  //       {
  //         label: '进项发票未认证',
  //         value: 'authenticationState_0',
  //       },
  //       {
  //         label: '进项发票已认证',
  //         value: 'authenticationState_1',
  //       },
  //       {
  //         label: '出口发票未开',
  //         value: 'exitState_0',
  //       },
  //       {
  //         label: '出口发票已开',
  //         value: 'exitState_1',
  //       },
  //       {
  //         label: '退税未申报',
  //         value: 'taxRefundState_0',
  //       },
  //       {
  //         label: '退税已申报',
  //         value: 'taxRefundState_1',
  //       },
  //       {
  //         label: '备案资料未传',
  //         value: 'filingState_0',
  //       },
  //       {
  //         label: '备案资料上传',
  //         value: 'filingState_1',
  //       },
  //       {
  //         label: '资料未下载',
  //         value: 'isDownload_0',
  //       },
  //       {
  //         label: '资料已下载',
  //         value: 'isDownload_1',
  //       },
  //       // {
  //       //   label: '未付款',
  //       //   value: 'arrearageState_0',
  //       // },
  //       // {
  //       //   label: '已付款',
  //       //   value: 'arrearageState_1',
  //       // },
  //     ],
  //   },
  //   {
  //     title: '合同协议号',
  //     dataIndex: 'contractNo',
  //     width: 100,
  //     search: false,
  //     align: 'center',
  //   },
  //   {
  //     title: '套餐类型',
  //     key: 'comboType',
  //     hideInTable: true,
  //     search: datasuserInfo.roleCode === 'client' ? false : true,
  //     dataIndex: 'comboType',
  //     valueType: 'select',
  //     align: 'center',
  //     valueEnum: pjComboList,
  //   },
  //   {
  //     title: '客户类型',
  //     key: 'clientType',
  //     search: datasuserInfo.roleCode === 'client' ? false : true,
  //     hideInTable: true,
  //     dataIndex: 'clientType',
  //     valueType: 'select',
  //     align: 'center',
  //     valueEnum: {
  //       1: {
  //         text: '贸易型企业',
  //       },
  //       2: {
  //         text: '生产型企业',
  //       },
  //     },
  //     // request: async () => [
  //     //   {
  //     //     label: '贸易型企业',
  //     //     value: 1,
  //     //   },
  //     //   {
  //     //     label: '生产型企业',
  //     //     value: 2,
  //     //   },
  //     // ],
  //   },

  //   {
  //     title: '状态',
  //     dataIndex: 'state',
  //     width: 100,
  //     initialValue: 'all',
  //     align: 'center',
  //     search: false,
  //     render: (h, row) => {
  //       // const text =
  //       //   parseInt(row.state) == 1 ? '待完成' : parseInt(row.state) == 2 ? '待下载' : '已完成';
  //       const text = parseInt(row.state) == 3 ? '已完成' : '待完成';
  //       return <span style={{ fontSize: 14 }}>{text}</span>;
  //     },
  //   },
  //   {
  //     title: '出口日期',
  //     dataIndex: 'exitTime',
  //     width: 100,
  //     hideInTable: true,
  //     valueType: 'dateRange',
  //     align: 'center',
  //   },
  //   {
  //     title: '出口日期',
  //     dataIndex: 'exportTime',
  //     width: 100,
  //     search: false,
  //     align: 'center',
  //   },
  //   {
  //     title: '进项发票日期',
  //     dataIndex: 'incomeTimeData',
  //     hideInTable: true,
  //     valueType: 'dateRange',
  //     align: 'center',
  //   },
  //   {
  //     title: '认证日期',
  //     dataIndex: 'authenticationTimeData',
  //     hideInTable: true,
  //     valueType: 'dateRange',
  //     align: 'center',
  //   },
  //   {
  //     title: '退税申报日期',
  //     dataIndex: 'taxRefundTimeData',
  //     hideInTable: true,
  //     valueType: 'dateRange',
  //     align: 'center',
  //   },
  //   {
  //     title: '合同协议号',
  //     dataIndex: 'contractNo',
  //     hideInTable: true,
  //     align: 'center',
  //   },
  //   {
  //     title: '客服名称',
  //     dataIndex: 'allot',
  //     hideInTable: true,
  //     align: 'center',
  //     valueType: 'select',
  //     search: datasuserInfo.roleCode === 'client' ? false : true,
  //     fieldProps: {
  //       showSearch: true,
  //     },
  //     request: async () => {
  //       const result: any = await userNoPageList();
  //       const columnsArr: any[] = result.result || [];
  //       const res: any = [];
  //       columnsArr.map((item) => {
  //         const temp = {};
  //         temp.label = item.realname;
  //         temp.value = item.id;
  //         res.push(temp);
  //       });
  //       return res;
  //     },
  //   },
  //   {
  //     title: '进项发票逾期',
  //     key: 'overdueState',
  //     hideInTable: true,
  //     dataIndex: 'overdueState',
  //     valueType: 'select',
  //     align: 'center',
  //     request: async () => [
  //       {
  //         label: '未逾期',
  //         value: '0',
  //       },
  //       {
  //         label: '逾期',
  //         value: '1',
  //       },
  //     ],
  //   },
  //   {
  //     title: '总价/币值',
  //     dataIndex: 'totalPrice',
  //     width: 100,
  //     search: false,
  //     align: 'center',
  //     render: (h, row: any) => {
  //       return (
  //         <span style={{ fontSize: 14 }}>
  //           {row.totalPrice}/{row.currency}
  //         </span>
  //       );
  //     },
  //   },
  //   {
  //     title: '创建时间',
  //     width: 100,
  //     dataIndex: 'createTime',
  //     search: false,
  //     align: 'center',
  //   },
  //   {
  //     title: '更新时间',
  //     dataIndex: 'updateTime',
  //     width: 100,
  //     search: false,
  //     align: 'center',
  //   },
  //   {
  //     title: '所属客服',
  //     dataIndex: 'allotName',
  //     hideInTable: datasuserInfo.roleCode === 'client' ? true : false,
  //     width: 100,
  //     search: false,
  //     align: 'center',
  //   },
  //   {
  //     title: '操作',
  //     key: 'option',
  //     width: 120,
  //     valueType: 'option',
  //     fixed: 'right',
  //     align: 'center',
  //     render: (text, row: any) => [
  //       <a
  //         key="edit"
  //         target="_blank"
  //         href={
  //           window.location.protocol +
  //           '//' +
  //           window.location.host +
  //           '/order/info?action=edit&id=' +
  //           row.id +
  //           '&contractNo=' +
  //           row.contractNo
  //         }
  //         rel="noreferrer"
  //       >
  //         {check('/ticket/order/edit') === false || row.state === 3 ? '查看' : '编辑'}
  //       </a>,
  //       // <a
  //       //   key="edit"
  //       //   onClick={() => {
  //       //     history.push(`/order/info?action=edit&id=${row.id}`);
  //       //   }}
  //       // >
  //       //   {check('/ticket/order/edit') === false || row.state === 3 ? '查看' : '编辑'}
  //       // </a>,
  //       <Popconfirm
  //         key={'delete'}
  //         title="确认要删除该数据吗？"
  //         icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
  //         onConfirm={() => {
  //           // console.log(row, text);
  //           _pjOrderDelete(row?.id);
  //         }}
  //       >
  //         <a
  //           type="link"
  //           style={{
  //             color: '#ff4d4f',
  //             display: check('/ticket/order/delete') === true ? '' : 'none',
  //           }}
  //         >
  //           删除
  //         </a>
  //       </Popconfirm>,
  //     ],
  //   },
  // ];
  const [data, setData] = useState<any[]>([]); //常见问题列表
  const [guide, setpjGuide] = useState<any[]>([]); //新手指导列表
  const [guidedata, setpjGuidedata] = useState<any[]>([]); //新手指导列表
  const [content, setcontent] = useState<any>(''); //新手指导列表
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

  const onClick: MenuProps['onClick'] = (e) => {
    // console.log('click ', e);
    setcontent(guidedata[e.key]?.content);
  };
  //获取数据
  const _data = async (value: any) => {
    const params: any = {};
    params.issue = value;
    const result: any = await pjIssue(params);
    setData(result.result);
  };
  const _pjGuide = async () => {
    const result: any = await pjGuide({});
    // setpjGuide(result.result);
    setpjGuidedata(result?.result);
    setcontent(result?.result[0].content);
    const items: MenuProps['items'] = [
      // getItem(
      //   'Navigation Two',
      //   'sub2',
      //   <AppstoreOutlined />,
      //   //  [
      //   //   // getItem('Option 5', '5'),
      //   //   // getItem('Option 6', '6'),
      //   //   // getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
      //   // ]
      // ),
      // getItem('Navigation Three', 'sub4', <SettingOutlined />),
      // getItem('Navigation Three', 'sub5', <SettingOutlined />),
    ];
    result.result.map((item: any, index: any) => {
      items.push(getItem(item.type, index));
    });
    // console.log('items', items);
    setpjGuide(items);
  };
  const onSearch = (value: string) => {
    // console.log(value);
    _data(value);
  };
  useEffect(() => {
    _pjOrderworkbench();
    _data('');
    _pjGuide();
    // _pjComboNoPageList();
  }, []);

  return (
    <PageContainer>
      <ProCard style={{ marginTop: 8 }} gutter={8}>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12} md={12} lg={12} xl={8} xxl={8}>
            <ProCard
              headerBordered={true}
              title={<span style={{ fontWeight: 'bold' }}>快捷入口</span>}
              bordered
            >
              <Row gutter={[6, 2]}>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={8}
                  xxl={8}
                  style={{ display: check('/ticket/order/add') === true ? '' : 'none' }}
                >
                  <Button
                    type="primary"
                    size="middle"
                    onClick={async () => {
                      if (datasuserInfo.roleCode === 'client') {
                        const result: any = await pjOrderAdd();
                        if (result.code === 200) {
                          openModal.closeModal();
                          setTimeout(() => {
                            history.push(`/order/info?action=add&id=${result.result}`);
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
                  >
                    新建订单
                  </Button>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={8}
                  xxl={8}
                  style={{ display: check('/ticket/order') === true ? '' : 'none' }}
                >
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => {
                      history.push(`/order`);
                    }}
                  >
                    订单管理
                  </Button>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={8}
                  xxl={8}
                  style={{ display: check('/statistics') === true ? '' : 'none' }}
                >
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => {
                      history?.push(`/statistics`);
                    }}
                  >
                    数据统计
                  </Button>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={8}
                  xxl={8}
                  style={{ display: check('/ticket/client/add') === true ? '' : 'none' }}
                >
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => {
                      history?.push('/customer/edit?action=add');
                    }}
                  >
                    新建客户
                  </Button>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={8}
                  xxl={8}
                  style={{ display: check('/isystem/depart/add') === true ? '' : 'none' }}
                >
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => {
                      const targetId = 'abc1';
                      openModal.showModal(
                        <CreateDepartment mode={'modal'} action={'add'} submitTarget={targetId} />,
                        {
                          title: '新增',
                          footer: <div id={targetId} />,
                        },
                      );
                    }}
                  >
                    添加部门
                  </Button>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={8}
                  xxl={8}
                  style={{ display: check('/isystem/user/add') === true ? '' : 'none' }}
                >
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => {
                      const targetId = 'abc1';
                      page.showModal(
                        <CreateAccount mode={'modal'} action={'add'} submitTarget={targetId} />,
                        {
                          title: '新增',
                          footer: <div id={targetId} />,
                        },
                      );
                    }}
                  >
                    添加账号
                  </Button>
                </Col>
              </Row>
            </ProCard>
          </Col>
          <Col
            xs={check('/ticket/workbench/scan') === false ? 24 : 24}
            sm={check('/ticket/workbench/scan') === false ? 12 : 6}
            md={check('/ticket/workbench/scan') === false ? 12 : 6}
            lg={check('/ticket/workbench/scan') === false ? 12 : 6}
            xl={check('/ticket/workbench/scan') === false ? 8 : 4}
            xxl={check('/ticket/workbench/scan') === false ? 8 : 4}
            style={{ display: check('/ticket/workbench/warning') === true ? '' : 'none' }}
          >
            <ProCard
              headerBordered={true}
              title={<span style={{ fontWeight: 'bold' }}>预警</span>}
              bordered
            >
              <Row gutter={[6, 4]}>
                <Col>
                  <div style={{ marginBottom: '4px', color: 'rgba(0,0,0,.45)', fontSize: '14px' }}>
                    进项发票逾期（超90天）
                  </div>
                  <div
                    style={{ color: 'red', fontSize: '24px', cursor: 'pointer' }}
                    onClick={() => {
                      history?.push('/order?overdueState=1');
                    }}
                  >
                    {allData?.bill || 0}
                  </div>
                  {/* <Statistic
                    title="进项发票逾期（超90天）"
                    value={allData?.bill}
                    onClick={() => {
                      history?.push('/customer/edit?overdueState=1');
                    }}
                  /> */}
                </Col>
              </Row>
            </ProCard>
          </Col>
          <Col
            xs={24}
            sm={6}
            md={6}
            lg={6}
            xl={4}
            xxl={4}
            style={{ display: check('/ticket/workbench/scan') === true ? '' : 'none' }}
          >
            <ProCard
              headerBordered={true}
              title={<span style={{ fontWeight: 'bold' }}>剩余识别次数</span>}
              bordered
            >
              <Row gutter={[6, 4]}>
                <Col>
                  <div
                    style={{
                      marginBottom: '4px',
                      color: 'rgba(0,0,0,.45)',
                      fontSize: '14px',
                      display: check('/ticket/workbench/scan') === true ? '' : 'none',
                    }}
                  >
                    剩余识别次数：
                    <div
                      style={{
                        color: allData?.scanNum <= 5 ? 'red' : 'rgba(0, 0, 0, 0.85)',
                        fontSize: '24px',
                      }}
                    >
                      {allData?.scanNum || 0}
                    </div>
                  </div>
                  {/* <div
                    style={{
                      marginBottom: '4px',
                      color: 'rgba(0,0,0,.45)',
                      fontSize: '18px',
                      display: check('/ticket/workbench/scan/bgd') === true ? '' : 'none',
                    }}
                  >
                    报关单剩余识别数：
                    <span style={{ color: allData?.bgdNum <= 5 ? 'red' : '' }}>
                      {allData?.bgdNum || 0}
                    </span>
                  </div>
                  <div
                    style={{
                      marginBottom: '4px',
                      color: 'rgba(0,0,0,.45)',
                      fontSize: '18px',
                      display: check('/ticket/workbench/scan/invoice') === true ? '' : 'none',
                    }}
                  >
                    发票剩余识别数：
                    <span style={{ color: allData?.invoiceNum <= 5 ? 'red' : '' }}>
                      {allData?.invoiceNum || 0}
                    </span>
                  </div> */}
                </Col>
              </Row>
            </ProCard>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={12}
            lg={12}
            xl={8}
            xxl={8}
            style={{ display: check('/ticket/workbench/basics') === true ? '' : 'none' }}
          >
            <ProCard
              title={<span style={{ fontWeight: 'bold' }}>基础统计</span>}
              bordered
              headerBordered={true}
            >
              <Row gutter={[6, 2]}>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={6}
                  xxl={6}
                  style={{
                    display:
                      check('/ticket/workbench/basics/client') === true ||
                      datasuserInfo.roleCode != 'client'
                        ? ''
                        : 'none',
                  }}
                >
                  <Statistic
                    title="客户总数"
                    value={allData?.client}
                    style={{ wordBreak: 'keep-all' }}
                  />
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={6}
                  xxl={6}
                  style={{
                    display: check('/ticket/workbench/basics/order') === true ? '' : 'none',
                  }}
                >
                  <Statistic
                    title="订单总数"
                    value={allData?.total}
                    style={{ wordBreak: 'keep-all' }}
                  />
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={6}
                  xxl={6}
                  style={{
                    display: check('/ticket/workbench/basics/noFinishOrder') === true ? '' : 'none',
                  }}
                >
                  <Statistic
                    title="待完成订单"
                    value={allData?.todo}
                    style={{ wordBreak: 'keep-all' }}
                  />
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={6}
                  xxl={6}
                  style={{
                    display: check('/ticket/workbench/basics/finishOrder') === true ? '' : 'none',
                  }}
                >
                  <Statistic
                    title="已完成订单"
                    value={allData?.completed}
                    style={{ wordBreak: 'keep-all' }}
                  />
                </Col>
              </Row>
            </ProCard>
          </Col>
        </Row>
      </ProCard>
      <ProCard
        gutter={8}
        style={{
          marginTop: 8,
          display:
            check('/ticket/workbench/guide') === false && check('/ticket/workbench/issue') === false
              ? 'none'
              : '',
        }}
      >
        <Row gutter={[8, 8]}>
          <Col
            xs={check('/ticket/workbench/guide') === false ? 24 : 12}
            sm={check('/ticket/workbench/guide') === false ? 12 : 12}
            md={check('/ticket/workbench/guide') === false ? 12 : 12}
            lg={check('/ticket/workbench/guide') === false ? 12 : 12}
            xl={check('/ticket/workbench/guide') === false ? 8 : 12}
            xxl={check('/ticket/workbench/guide') === false ? 8 : 12}
            style={{ display: check('/ticket/workbench/guide') === true ? '' : 'none' }}
          >
            <ProCard style={{ width: '100%' }} split="vertical">
              <ProCard title={<div style={{ fontWeight: 'bold' }}>新手指引</div>} colSpan="25%">
                <Menu
                  onClick={onClick}
                  style={{ width: '100%', fontWeight: 'bold' }}
                  defaultSelectedKeys={['0']}
                  // defaultOpenKeys={['0']}
                  mode="inline"
                  items={guide}
                />
              </ProCard>
              <ProCard colSpan="75%">
                <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: content }} />
              </ProCard>
            </ProCard>
          </Col>
          <Col
            xs={check('/ticket/workbench/issue') === false ? 24 : 12}
            sm={check('/ticket/workbench/issue') === false ? 12 : 12}
            md={check('/ticket/workbench/issue') === false ? 12 : 12}
            lg={check('/ticket/workbench/issue') === false ? 12 : 12}
            xl={check('/ticket/workbench/issue') === false ? 8 : 12}
            xxl={check('/ticket/workbench/issue') === false ? 8 : 12}
            style={{ display: check('/ticket/workbench/issue') === true ? '' : 'none' }}
          >
            <ProCard
              headerBordered={true}
              title={<span style={{ fontWeight: 'bold' }}>常见问题</span>}
              extra={
                <>
                  <Search placeholder="输入问题描述" onSearch={onSearch} style={{ width: 200 }} />
                </>
              }
              bordered
            >
              <Col>
                <List
                  header=""
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    onChange: (p) => {
                      console.log(p);
                    },
                    pageSize: 10,
                  }}
                  dataSource={data}
                  renderItem={(item, index) => (
                    <Collapse defaultActiveKey={['0']} ghost>
                      <Panel
                        header={<div style={{ fontWeight: 'bold' }}>{item.issue}</div>}
                        key={index}
                      >
                        <div dangerouslySetInnerHTML={{ __html: item.descr }} />
                        {/* <p>{item.descr}</p> */}
                      </Panel>
                    </Collapse>
                  )}
                />
              </Col>
            </ProCard>
          </Col>
        </Row>
      </ProCard>
      {/* <ProCard
        style={{
          marginTop: 8,
          display: check('/ticket/workbench/noFinishOrder') === true ? '' : 'none',
        }}
        gutter={8}
        headerBordered={true}
        title={'待完成订单'}
      >
        <ProTable<GithubIssueItem>
          toolBarRender={false}
          columns={columns}
          cardBordered
          actionRef={actionRef}
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
            console.log(params, sort, filter, 999);
            const dd: any = params;
            //标签筛选数据处理
            const tagStr = dd.tag || '';
            const tagArr = tagStr.split('_');
            const tagKey = tagArr[0];
            const tagValue = tagArr[1];
            dd[tagKey] = tagValue;
            dd.state = '1';
            dd.column = 'createTime';
            dd.order = 'desc';
            dd.pageNo = params?.current;
            const res: any = await _pjOrderList(dd);
            return res;
            // const totalList = msg?.result?.total || 0;
            // setListTotal(totalList);
          }}
          dataSource={datasource}
          postData={(data: any[]): any[] => {
            const arr: any = [];
            data.map((item: any) => {
              arr.push(item.id);
            });
            // console.log(data);

            // @ts-ignore
            setDatasource(data);
            setDefaultExpanded(arr);
            return data;
          }}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          pagination={{
            pageSize: 10,
            size: 'default',
            simple: false,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 100, 200, 1000, 2000],
          }}
          dateFormatter="string"
          expandable={{
            expandedRowRender: (record: any) => {
              return <OrderStatus record={record} />;
            },
            expandedRowKeys: [...newExpandedKeys],
            showExpandColumn: false,
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
        />
      </ProCard> */}
      <BackTop />
    </PageContainer>
  );
};

export default Welcome;
