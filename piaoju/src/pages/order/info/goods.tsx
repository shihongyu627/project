import {
  pjBillingDelete,
  pjBillingNoPageList,
  pjGoodsNoPageList,
  pjBillingoneKeyGenerate,
} from '@/services/ant-design-pro/order';
import openModal from '@/utils/page';
import {
  DownloadOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import type { EditableFormInstance, ProFormInstance } from '@ant-design/pro-components';
import ProForm from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { InputNumber, InputRef, message, notification } from 'antd';
import { Button, Input, Popconfirm, Space } from 'antd';
// import { times } from 'lodash';
import React, { useImperativeHandle, useRef, useState } from 'react';
import OpenBillModal from './billNotice'; //发票通知
import OpenBillModalAll from './billNoticeAllGoods'; //发票通知quanbu
import ContractModalAll from './contractAllGoods'; //hetong quanbu
import UploadBillModal from './billupload'; //上传进项发票
import ContractModal from './contract'; //查看合同
import InvoiceConfiguration from './invoiceConfiguration'; //发票配置invoiceConfiguration
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { request } from 'umi';
// import ProForm, { ProFormText } from '@ant-design/pro-form';
type TableListItem = {
  sort: number;
  url: string;
  id: number;
  kid: number;
  index: any;
  number: number;
  maxNum: number;
  minNum: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

const goodsData: React.FC<any> = React.forwardRef((props: any, ref) => {
  // console.log('goodsData', props);
  const [Oldata, setOldata] = useState([]);
  const formRef = useRef<ProFormInstance>();
  const editorFormRef = useRef<EditableFormInstance>();
  const actionRef = useRef<ActionType>();
  const TagList: React.FC<{
    value?: {
      key: string;
      label: string;
    }[];
    onChange?: (
      value: {
        key: string;
        label: string;
      }[],
    ) => void;
  }> = ({ value, onChange }) => {
    const dataref = useRef<InputRef | null>(null);
    const [newTags, setNewTags] = useState<
      {
        key: string;
        label: string;
      }[]
    >([]);
    // const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = (key: any, index: any, e: React.ChangeEvent<HTMLInputElement>) => {
      const newArr: any = value;
      newArr[index].label = e.target.value;
      //console.log(value, 90, newArr[index], index);
      // value[key].label = e.target.value;
      setNewTags([...newTags]);
    };
    const handleInputConfirm = () => {
      const tempsTags = [...(value || [])];
      onChange?.(tempsTags);
      setNewTags([]);
      // setInputValue('');
    };

    return (
      <Space direction={'vertical'}>
        {(value || []).concat(newTags).map((item, index) => (
          <div key={item.key}>
            <Input
              ref={dataref}
              type="text"
              size="small"
              allowClear
              value={item.label}
              style={{ width: 75 }}
              onChange={(e) => handleInputChange(item.key, index, e)}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          </div>
        ))}
      </Space>
    );
  };
  const NumberList: React.FC<{
    value?: {
      key: string;
      label: string;
    }[];
    onChange?: (
      value: {
        key: string;
        label: string;
      }[],
    ) => void;
  }> = ({ value, onChange }) => {
    const dataref = useRef<any | null>(null);
    const [newTags, setNewTags] = useState<
      {
        key: string;
        label: string;
      }[]
    >([]);
    // const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = (key: any, index: any, e: React.ChangeEvent<HTMLInputElement>) => {
      const newArr: any = value;
      newArr[index].label = e;
      //console.log(value, 90, newArr[index], index);
      // value[key].label = e.target.value;
      setNewTags([...newTags]);
    };
    const handleInputConfirm = () => {
      const tempsTags = [...(value || [])];
      onChange?.(tempsTags);
      setNewTags([]);
      // setInputValue('');
    };

    return (
      <Space direction={'vertical'}>
        {(value || []).concat(newTags).map((item, index) => (
          <div key={item.key}>
            <InputNumber
              ref={dataref}
              size="small"
              value={item.label}
              style={{ width: 75 }}
              onChange={(e) => handleInputChange(item.key, index, e)}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          </div>
        ))}
      </Space>
    );
  };
  useImperativeHandle(ref, () => ({
    getRowsData: () => {
      return editorFormRef.current.getRowsData();
    },
    getFieldsFormatValue: () => {
      return formRef.current.getFieldsFormatValue();
    },
    setFieldsValue: (value: any) => {
      return formRef.current.setFieldsValue(value);
    },
  }));
  const _pjBillingDelete = async (record: any) => {
    try {
      const dd = {
        batch: record.kbatch,
      };
      const result: any = await pjBillingDelete({ ...dd });
      if (result.code === 200) {
        history.go(0);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 获取订单列表
  const _pjGoodsNoPageList = async (param: any) => {
    const dd: any = {};
    dd.column = 'createTime';
    dd.order = 'desc';
    dd.title = '';
    if (param != 10086) {
      dd.GName = param;
    }
    dd.orderId = props.queryId || '';
    const res = await pjGoodsNoPageList({
      ...dd,
    });
    if (res?.code == 200) {
      const arr = res?.result || [];
      const promiseList: any = [];
      const kk: any = {};
      kk.orderId = props.queryId || '';
      const resData: any = await pjBillingNoPageList({ ...kk });
      for (let i = 0; i < arr.length; i++) {
        const goodsList: any = arr[i];
        // goodsList.fobMoney = arr[i].declTotal;
        const goodId = arr[i].id || '';
        // console.log(resData);
        const temp = resData.result.filter((item: any) => {
          return item.goodId === goodId;
        });
        // console.log(temp, 'temp');
        //for循环中请求接口
        if (temp.length > 0) {
          // console.log(resData);
          temp.map((key: any, index: any) => {
            const kaipiao: any = {};
            kaipiao.kcreateBy = key.createBy;
            kaipiao.kcreateTime = key.createTime;
            kaipiao.kdelStatus = key.delStatus;
            kaipiao.kgoodId = key.goodId;
            kaipiao.kid = key.id;
            kaipiao.kmoney = key.money;
            kaipiao.kname = key.name;
            kaipiao.kgoodName = key.goodName;
            kaipiao.knum = key.num;
            kaipiao.korderId = key.orderId;
            kaipiao.kremark = key.remark;
            kaipiao.kstate = key.state;
            kaipiao.ksysOrgCode = key.sysOrgCode;
            kaipiao.kunit = key.unit;
            kaipiao.kupdateBy = key.updateBy;
            kaipiao.kupdateTime = key.updateTime;
            kaipiao.kurl = key.url;
            kaipiao.kbatch = key.batch;
            kaipiao.incomeState = key.incomeState;
            kaipiao.finished = key.finished;
            kaipiao.quantity = key.quantity;
            kaipiao.kcategory = key.category;
            if (index === 0) {
              kaipiao.oneToMany = temp.length;
              Object.assign(kaipiao, goodsList);
              promiseList.push(kaipiao);
            } else {
              kaipiao.oneToMany = 0;
              promiseList.push(kaipiao);
            }
          });
        } else {
          promiseList.push(goodsList);
        }
      }
      promiseList.map((aa: any, index: any) => {
        aa.sort = index + 9999;
        aa.numberlabels = [
          { key: 'firstQty', label: aa.firstQty },
          { key: 'secondQty', label: aa.secondQty },
          { key: 'gqty', label: aa.gqty },
        ];
        aa.unitlabels = [
          { key: 'firstUnitValue', label: aa.firstUnitValue },
          { key: 'secondUnitValue', label: aa.secondUnitValue },
          { key: 'gunitValue', label: aa.gunitValue },
        ];
        const factory = promiseList[index].factory || '';
        const batch = promiseList[index].batch || '';
        const temptow = promiseList.filter((item: any) => {
          return item.factory === factory && item.batch === batch;
        });
        // console.log('temptow', temptow);
        if (temptow.length > 1) {
          temptow.map((keydata: any, keyindex: any) => {
            if (keyindex == 0) {
              // console.log('keys', keyindex);
              // console.log('temptow.length', temptow.length);
              // console.log('temptow.length', keydata.ManyToOne);
              keydata.ManyToOne = temptow.length;
            } else {
              keydata.ManyToOne = 0;
            }
          });
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-shadow
      // Promise.all(promiseList).then((dd) => {
      //TODO
      // console.log('promiseList', promiseList);
      formRef?.current?.setFieldsValue({
        table: promiseList,
      });
      setOldata(promiseList);
      // });
      if (param === 10086) {
        props.pjOrderEdit();
      }
    }
  };
  //路由校验及获取
  const columnsArr = `${localStorage.getItem('auths')}`;
  const urlData = JSON.parse(columnsArr);
  const rule = `${localStorage.getItem('rule')}`;
  const ruledata = JSON.parse(rule);
  const check = (url: any) => {
    if (!urlData) {
      return false;
    }
    return urlData.some((item: any) => item.url == url);
  };
  const goodsUpData = () => {
    const param = 10086;
    _pjGoodsNoPageList(param);
  };
  const defaultData: any = [];
  const columns: ProColumns<TableListItem>[] = [
    {
      dataIndex: 'index',
      title: '序号',
      width: 50,
      fixed: 'left',
      valueType: 'indexBorder',
      // onCell: (row) => {
      //   {
      //     return { rowSpan: row.oneToMany };
      //   }
      // },
    },
    {
      title: '商品名称',
      dataIndex: 'gname',
      fixed: 'left',
      width: 120,
      search: false,
      render: (h, row: any) => {
        return (
          <div>
            <div style={{ fontSize: 14 }}>
              {row.gname}
              <p>{row.codeTs}</p>
            </div>
            {/* <div style={{ fontSize: 14 }}>{row.secondQty}</div>
            <div style={{ fontSize: 14 }}>{row.gqty}</div> */}
          </div>
        );
      },
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
      // render: (_) => <a>{_}</a>,
      //合并功能
      // onCell: (row, index) => {
      //   if (index === 2) {
      //     return { rowSpan: 2 };
      //   } else if (index == 3) {
      //     return { rowSpan: 0 };
      //   } else {
      //     return { colSpan: 1 };
      //   }
      // },
    },
    {
      title: '数量',
      dataIndex: 'numberlabels',
      copyable: true,
      ellipsis: true,
      search: false,
      fixed: 'left',
      width: 60,
      renderFormItem: () => {
        return <NumberList />;
      },
      render: (_, row: any) => {
        return row?.numberlabels?.map((item: any, index: any) => (
          <div style={{ fontSize: 14 }} key={index}>
            <span key={index}>{item.label || '-'}</span>
          </div>
        ));
      },
      // renderFormItem: (_, { isEditable }) => {
      //   return isEditable ? <TagList /> : <Input />;
      // },
      // render: (_, row: any) => {
      //   return (
      //     <div>
      //       <div>{row.firstQty}</div>
      //       <div>{row.secondQty}</div>
      //       <div>{row.gqty}</div>
      //     </div>
      //   );
      // },
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: '单位',
      dataIndex: 'unitlabels',
      copyable: true,
      ellipsis: true,
      search: false,
      width: 60,
      renderFormItem: () => {
        return <TagList />;
      },
      render: (_, row) => {
        return row?.unitlabels?.map((item: any, index: any) => (
          <div style={{ fontSize: 14 }} key={index}>
            <span key={index}>{item.label || '-'}</span>
          </div>
        ));
      },
      // render: (h, row: any) => {
      //   return (
      //     <div>
      //       <div style={{ fontSize: 14 }}>{row.firstUnitValue}</div>
      //       <div style={{ fontSize: 14 }}>{row.secondUnitValue}</div>
      //       <div style={{ fontSize: 14 }}>{row.gunitValue}</div>
      //     </div>
      //   );
      // },
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: '总价',
      dataIndex: 'declTotal',
      valueType: 'digit',
      tooltip: ruledata.good_total_price,
      copyable: true,
      ellipsis: true,
      search: false,
      width: 90,
      render: (h, row: any) => {
        return (
          <div>
            <span style={{ fontSize: 14 }}>{row.declTotal}</span>
            <span style={{ fontSize: 14 }}>{row.tradeCurr}</span>
          </div>
        );
      },
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: 'FOB金额',
      dataIndex: 'fobMoney',
      tooltip: ruledata.good_fob,
      valueType: 'digit',
      copyable: true,
      ellipsis: true,
      search: false,
      width: 90,
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: '出口发票金额',
      dataIndex: 'exportInvoiceMoney',
      valueType: 'digit',
      hideInTable: props.dataInfo.comboType === 'A' ? true : false,
      copyable: true,
      // readonly: true,
      ellipsis: true,
      search: false,
      width: 110,
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: '退税率',
      dataIndex: 'taxRate',
      valueType: 'digit',
      hideInTable: props.dataInfo.comboType === 'A' ? true : false,
      // hideInTable: true,
      copyable: true,
      ellipsis: true,
      search: false,
      width: 90,
      render: (h, row: any) => {
        return (
          <div>
            <div style={{ fontSize: 14, display: row.taxRate && row.taxRate != 0 ? '' : 'none' }}>
              {row.taxRate}%
            </div>
            <div style={{ fontSize: 14, display: row.taxRate === 0 ? '' : 'none' }}>
              {row.taxRate}%
            </div>
          </div>
        );
      },
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: '退税金额',
      dataIndex: 'taxMoney',
      valueType: 'digit',
      hideInTable: props.dataInfo.comboType === 'A' ? true : false,
      // hideInTable: true,
      // readonly: true,
      copyable: true,
      ellipsis: true,
      search: false,
      width: 90,
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: '换汇成本',
      dataIndex: 'exchange',
      valueType: 'digit',
      hideInTable:
        props.dataInfo.clientType === 2 || props.dataInfo.comboType === 'A' ? true : false,
      // hideInTable: true,
      readonly: true,
      copyable: true,
      ellipsis: true,
      search: false,
      width: 80,
      render: (h, row: any) => {
        return (
          <div>
            <span
              style={{
                fontSize: 14,
                color:
                  row?.exchange > props?.maxNum || row?.exchange < props?.minNum ? 'red' : 'black',
              }}
            >
              {row.exchange}
            </span>
          </div>
        );
      },
      renderFormItem(schema, config) {
        const row = (config?.record as any) || {};
        return (
          <div>
            <span
              style={{
                fontSize: 14,
                color:
                  row?.exchange > props?.maxNum || row?.exchange < props?.minNum ? 'red' : 'black',
              }}
            >
              {row?.exchange}
            </span>
          </div>
        );
      },
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: '货源地',
      dataIndex: 'districtCodeValue',
      copyable: true,
      ellipsis: true,
      search: false,
      width: 130,
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      copyable: true,
      ellipsis: true,
      search: false,
      width: 115,
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: '工厂名称',
      dataIndex: 'kname',
      hideInTable:
        props.dataInfo.clientType === 2 || props.dataInfo.comboType === 'A' ? true : false,
      copyable: true,
      ellipsis: true,
      search: false,
      width: 140,
      //合并功能
      onCell: (row: any) => {
        {
          return { rowSpan: row.ManyToOne };
        }
      },
    },
    {
      title: '开票金额',
      dataIndex: 'kmoney',
      valueType: 'digit',
      hideInTable:
        props.dataInfo.clientType === 2 || props.dataInfo.comboType === 'A' ? true : false,
      copyable: true,
      ellipsis: true,
      search: false,
      width: 90,
    },
    {
      title: '开票品类',
      dataIndex: 'kcategory',
      hideInTable:
        props.dataInfo.clientType === 2 || props.dataInfo.comboType === 'A' ? true : false,
      copyable: true,
      ellipsis: true,
      search: false,
      width: 90,
    },
    {
      title: '单位',
      dataIndex: 'kunit',
      hideInTable:
        props.dataInfo.clientType === 2 || props.dataInfo.comboType === 'A' ? true : false,
      copyable: true,
      ellipsis: true,
      search: false,
      width: 80,
    },
    {
      title: '数量',
      dataIndex: 'knum',
      valueType: 'digit',
      hideInTable:
        props.dataInfo.clientType === 2 || props.dataInfo.comboType === 'A' ? true : false,
      copyable: true,
      ellipsis: true,
      search: false,
      width: 80,
    },
    // {
    //   title: '创建时间',
    //   key: 'showTime',
    //   dataIndex: 'date',
    //   valueType: 'createTime',
    //   search: false,
    //   width: 180,
    // },
    {
      title: '编辑',
      valueType: 'option',
      key: 'option',
      width: 80,
      fixed: 'right',
      align: 'center',
      render: (row, record, _, action) => [
        <a
          key="editable"
          style={{
            display:
              check('/ticket/order/good/edit') === false || props?.dataInfo.state === 3
                ? 'none'
                : '',
          }}
          onClick={() => {
            // console.log('editable', row, record, _, record.sort);
            action?.startEditable?.(record.sort);
          }}
        >
          编辑
        </a>,
      ],
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 115,
      fixed: 'right',
      align: 'center',
      editable: false,
      render: (
        row,
        record: any,
        //  _, action
      ) => [
        <a
          key="view1"
          style={{
            display:
              record.hasOwnProperty('kid') === false ||
              check('/ticket/order/good/message') === false
                ? // ||
                  // props?.dataInfo.state === 3
                  'none'
                : '',
          }}
          onClick={() => {
            openModal.showModal(
              <OpenBillModal
                mode={'modal'}
                action={'add'}
                submitTarget={''}
                record={record}
                dataInfo={props.dataInfo}
              />,
              {
                title: '开票通知',
                width: 1000,
                maskClosable: false,
                footer: null,
              },
            );
          }}
        >
          通知
        </a>,
        <a
          key="view2"
          style={{
            display:
              record.hasOwnProperty('kid') === false ||
              check('/ticket/order/good/contract') === false
                ? // ||
                  // props?.dataInfo.state === 3
                  'none'
                : '',
          }}
          onClick={() => {
            openModal.showModal(
              <ContractModal
                mode={'modal'}
                action={'add'}
                submitTarget={''}
                record={record}
                dataInfo={props.dataInfo}
              />,
              {
                title: '采购合同',
                width: 1000,
                footer: null,
                maskClosable: false,
              },
            );
          }}
        >
          合同
        </a>,
        <a
          key="view3"
          style={{
            display:
              record.hasOwnProperty('kid') === false ||
              check('/ticket/order/good/invoice') === false
                ? // ||
                  // props?.dataInfo.state === 3
                  'none'
                : '',
          }}
          onClick={() => {
            // if (record?.state == 2) {
            //   return;
            // }
            openModal.showModal(
              <UploadBillModal
                mode={'modal'}
                action={'add'}
                id={record.kid}
                batch={record.kbatch}
                ManyToOne={record.ManyToOne}
                name={record.kname}
                dataInfo={props}
                submitTarget={''}
                goodsUpData={goodsUpData}
              />,
              {
                title: '上传进项发票',
                footer: null,
                width: '1200',
                maskClosable: false,
              },
            );
          }}
        >
          {record?.quantity === record?.finished ? '已完成' : '待上传'}
        </a>,
        <Popconfirm
          key="view4"
          title="确认要删除该数据吗？"
          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => {
            if (record.kid) {
              _pjBillingDelete(record);
              const goodsList = editorFormRef.current.getRowsData();
              const newArr = goodsList.filter((item: any) => item.kid !== record.kid);
              formRef?.current?.setFieldsValue({
                table: newArr,
              });
            }
          }}
        >
          <a
            type="link"
            style={{
              display:
                record.hasOwnProperty('kid') === false ||
                check('/ticket/order/good/delete') === false ||
                props?.dataInfo.state === 3
                  ? 'none'
                  : '',
              color: '#ff4d4f',
            }}
          >
            删除
          </a>
        </Popconfirm>,
      ],
      onCell: (row: any) => {
        {
          return { rowSpan: row.ManyToOne };
        }
      },
    },
  ];
  const _getFile = (url: any) => {
    return new Promise((resolve, reject) => {
      request(url, {
        method: 'get',
        responseType: 'blob',
        // responseType: 'arraybuffer'
      })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error.toString());
        });
    });
  };
  const openNotification = (v: any) => {
    notification.open({
      icon: <LoadingOutlined style={{ color: 'green' }} />,
      message: v,
      description: '正在下载...',
      duration: null,
      key: 'openNotification',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };
  //下载开票通知合同
  const _downloadCodeImg = async (v: any) => {
    const oneKeyGenerate: any = {};
    oneKeyGenerate.orderId = props.queryId;
    oneKeyGenerate.type = 'good';
    const res = await pjBillingoneKeyGenerate({
      ...oneKeyGenerate,
    });
    const arry: any = [];
    const zipName: any = {};
    if (v === 1 && res.result.MessageUrlList.length > 0) {
      zipName.name = '开票通知';
      res.result.MessageUrlList.map((item: any) => {
        openNotification(zipName.name);
        const dd: any = {};
        dd.fileName = item.substring(item.lastIndexOf('/') + 1);
        dd.path = item;
        arry.push(dd);
      });
    } else if (v === 2 && res.result.contractUrlList.length > 0) {
      zipName.name = '采购合同';
      res.result.contractUrlList.map((item: any) => {
        openNotification(zipName.name);
        const dd: any = {};
        dd.fileName = item.substring(item.lastIndexOf('/') + 1);
        dd.path = item;
        arry.push(dd);
      });
    } else {
      message.error('暂无数据，请生成文件');
      return;
    }
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1;
    const date = nowDate.getDate();
    const zip = new JSZip();
    const cache = {};
    const promises: any = [];
    arry.forEach((item: any) => {
      const dd = item.path.substring(item.path.lastIndexOf('/')); //后
      const kk = item.path.substring(0, item.path.lastIndexOf('/')); //前
      item.path = kk + encodeURIComponent(dd);
      const promise = _getFile(item.path).then((data: any) => {
        // eslint-disable-next-line camelcase
        const file_name = item.fileName;
        zip.file(file_name, data, { binary: true });
        cache[file_name] = data;
      });
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        // 生成二进制流
        FileSaver.saveAs(
          content,
          zipName.name +
            props.dataInfo.contractNo +
            '_' +
            year +
            +(month > 9 ? month : '0' + month) +
            (date > 9 ? date : '0' + date) +
            '.zip',
        ); // 利用file-saver保存文件  自定义文件名
        // eslint-disable-next-line no-undef
        // saveAs(content, '文件下载.zip'); // 利用file-saver保存文件  自定义文件名
      });
      notification.close('openNotification');
    });
  };

  React.useEffect(() => {
    // console.log('useEffect syncCount', props);
    _pjGoodsNoPageList('');
  }, [props.syncCount]);
  // const pjOrderEdit = () => {
  //   props.pjOrderEdit();
  // };
  function pjGoodsName(value: any) {
    // console.log(value.target.value, '返回的数据');
    const param = value.target.value;
    _pjGoodsNoPageList(param);
  }
  return (
    <ProCard
      colSpan={{ sm: 4, md: 6, lg: 6, xl: 6 }}
      headerBordered={true}
      title={
        <span id="order_goods" style={{ fontWeight: 'bold' }}>
          商品信息
        </span>
      }
      bordered
      direction="column"
      extra={
        <Space
          style={{
            marginRight: '3vw',
          }}
        >
          <Input.Search
            width="md"
            name="name"
            // label="商品名称"
            placeholder="请输入商品名称"
            onSearch={(value: any) => {
              pjGoodsName(value);
            }}
            onPressEnter={(value: any) => {
              pjGoodsName(value);
            }}
            allowClear
          />
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            style={{
              display:
                props?.status === 0 ||
                props?.dataInfo.state === 3 ||
                props?.dataInfo.comboType === 'A' ||
                props?.dataInfo.clientType === 2 ||
                check('/ticket/order/invoice') === false
                  ? 'none'
                  : '',
            }}
            onClick={() => {
              openModal.showModal(
                <InvoiceConfiguration
                  headerData={[]}
                  orderId={props.queryId}
                  goodsUpData={goodsUpData}
                  // pjOrderEdit={pjOrderEdit}
                />,
                {
                  title: '发票配置',
                  width: 1400,
                  footer: null,
                  maskClosable: false,
                },
              );
            }}
          >
            发票配置
          </Button>
          <Button
            style={{
              display:
                props?.dataInfo.comboType === 'A' ||
                props?.dataInfo.clientType === 2 ||
                check('/ticket/order/good/message/download') === false
                  ? 'none'
                  : '',
            }}
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              _downloadCodeImg(1);
            }}
          >
            一键下载通知
          </Button>
          <Button
            style={{
              display:
                props?.dataInfo.comboType === 'A' ||
                props?.dataInfo.clientType === 2 ||
                check('/ticket/order/good/contract/download') === false
                  ? 'none'
                  : '',
            }}
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              _downloadCodeImg(2);
            }}
          >
            一键下载合同
          </Button>
          <Button
            style={{
              display:
                props?.dataInfo.comboType === 'A' ||
                props?.dataInfo.clientType === 2 ||
                check('/ticket/order/good/message/create') === false
                  ? 'none'
                  : '',
            }}
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => {
              openModal.showModal(
                <OpenBillModalAll
                  mode={'modal'}
                  action={'add'}
                  submitTarget={''}
                  dataInfo={props.dataInfo}
                />,
                {
                  title: '开票通知',
                  width: 1000,
                  maskClosable: false,
                  footer: null,
                },
              );
            }}
          >
            一键生成通知
          </Button>
          <Button
            style={{
              display:
                props?.dataInfo.comboType === 'A' ||
                props?.dataInfo.clientType === 2 ||
                check('/ticket/order/good/contract/create') === false
                  ? 'none'
                  : '',
            }}
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => {
              openModal.showModal(
                <ContractModalAll
                  mode={'modal'}
                  action={'add'}
                  submitTarget={''}
                  dataInfo={props.dataInfo}
                />,
                {
                  title: '采购合同',
                  width: 1000,
                  maskClosable: false,
                  footer: null,
                },
              );
            }}
          >
            一键生成合同
          </Button>
        </Space>
      }
    >
      <ProForm
        formRef={formRef}
        initialValues={{
          table: defaultData,
        }}
        validateTrigger="onBlur"
        submitter={false}
        style={{ marginRight: '3vw' }}
      >
        <EditableProTable
          rowKey="sort"
          columns={columns}
          actionRef={actionRef}
          editableFormRef={editorFormRef}
          name="table"
          loading={false}
          toolBarRender={false}
          // toolBarRender={() => {
          //   return [
          //     <Input
          //       width="md"
          //       name="name"
          //       // label="商品名称"
          //       placeholder="请输入商品名称"
          //       onChange={(value: any) => {
          //         pjGoodsName(value);
          //       }}
          //       allowClear
          //     />,
          //   ];
          // }}
          // formRef={formRef}
          // request={async (params: {}, sort, filter) => {
          //   console.log(params, sort, filter, 999);
          //   const dd = {};
          //   dd.column = 'createTime';
          //   dd.order = 'desc';
          //   dd.title = params.title || '';
          //   // dd.orderId = props.queryId || '';
          //   const res = await _pjGoodsNoPageList(dd);
          //   return res;
          //   // const totalList = msg?.result?.total || 0;
          //   // setListTotal(totalList);
          // }}
          editable={{
            type: 'multiple',
            // onSave: (key, row, originRow, newLine) => {
            //   console.log(key, row, originRow, newLine);
            // },
            actionRender: (row, config, defaultDom) => [
              <a
                key="save"
                onClick={async () => {
                  const values = (await config?.form?.validateFields()) as DataSourceType;
                  console.log(values);
                  if (row.id) {
                    const temp = Oldata.filter((item: any) => {
                      return item.id === row.id;
                    });
                    // console.log(row, Oldata, temp);
                    if (temp.length > 0 && temp[0].fobMoney != row.fobMoney) {
                      // values.table.filter((i: any) => {
                      //   if (i.id === row.id) {
                      //     i.exportInvoiceMoney = 0;
                      //   }
                      // });
                      row.exportInvoiceMoney = 0;
                    }
                    if (temp.length > 0 && temp[0].taxRate != row.taxRate) {
                      // values.table.filter((i: any) => {
                      //   if (i.id === row.id) {
                      //     i.exportInvoiceMoney = 0;
                      //   }
                      // });
                      row.taxMoney = 0;
                    }
                  }
                  // console.log(values);
                  await config?.onSave?.(config.recordKey, row, values);
                }}
              >
                保存
              </a>,
              ,
              defaultDom.cancel,
            ],
          }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
            onChange(value) {
              console.log('value: ', value);
            },
          }}
          form={{
            // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
              if (type === 'get') {
                return {
                  ...values,
                  created_at: [values.startTime, values.endTime],
                };
              }
              return values;
            },
          }}
          pagination={{
            pageSize: 100,
            onChange: (page) => console.log(page),
          }}
          recordCreatorProps={false}
          scroll={{ x: 1300 }}
          search={{
            filterType: 'light',
          }}
          dateFormatter="string"
          headerTitle={false}
          // headerTitle={
          //   <Button
          //     key="button"
          //     icon={<PlusOutlined />}
          //     type="primary"
          //     style={{
          //       display:
          //         props?.status === 0 ||
          //         props?.dataInfo.state === 3 ||
          //         props?.dataInfo.comboType === 'A' ||
          //         props?.dataInfo.clientType === 2 ||
          //         check('/ticket/order/edit') === false ||
          //         check('/ticket/order/finish') === false
          //           ? 'none'
          //           : '',
          //     }}
          //     onClick={() => {
          //       openModal.showModal(
          //         <InvoiceConfiguration headerData={[]} orderId={props.queryId} />,
          //         {
          //           title: '发票配置',
          //           width: '1000',
          //           footer: null,
          //           maskClosable: false,
          //         },
          //       );
          //     }}
          //   >
          //     发票配置
          //   </Button>
          // }
        />
      </ProForm>
    </ProCard>
  );
});

export default goodsData;
