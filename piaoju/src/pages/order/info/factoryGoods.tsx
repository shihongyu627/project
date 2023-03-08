import {
  //   pjBillingDelete,
  //   pjBillingNoPageList,
  //   pjGoodsNoPageList,
  pjBillingnoPageFactoryList,
  pjBillingoneKeyGenerate,
} from '@/services/ant-design-pro/order';
import openModal from '@/utils/page';
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import type { EditableFormInstance, ProFormInstance } from '@ant-design/pro-components';
import ProForm from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
// import { InputNumber, InputRef } from 'antd';
// import { Input, Popconfirm, Space } from 'antd';
// import { times } from 'lodash';
import React, { useImperativeHandle, useRef, useState } from 'react';
import OpenBillModal from './billNoticeTow'; //发票通知
// import UploadBillModal from './billupload'; //上传进项发票
import ContractModal from './contracTow'; //查看合同
import OpenBillModalAll from './billNoticeAllGoodsTow'; //发票通知quanbu
import ContractModalAll from './contractAllGoodsTow'; //hetong quanbu
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { request } from 'umi';
import { Button, message, notification, Space } from 'antd';
import { DownloadOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons';
// import InvoiceConfiguration from './invoiceConfiguration'; //发票配置invoiceConfiguration
// import ProForm, { ProFormText } from '@ant-design/pro-form';
type TableListItem = {
  sort: number;
  url: string;
  id: number;
  kid: number;
  index: any;
  number: number;
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
  const [Oldata, setOldata] = useState([]);
  const formRef = useRef<ProFormInstance>();
  const editorFormRef = useRef<EditableFormInstance>();
  const actionRef = useRef<ActionType>();

  // const [inputValue, setInputValue] = useState<string>('');

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
    pjGoodsNoPageList: () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return _pjGoodsNoPageList();
    },
  }));
  // 获取工厂开票列表
  const _pjGoodsNoPageList = async () => {
    const kk: any = {};
    kk.orderId = props.queryId || '';
    const resData: any = await pjBillingnoPageFactoryList({ ...kk });
    const promiseList: any = [];
    for (const i in resData.result) {
      //   console.log(i); //a b c d

      //   console.log(resData.result[i]); // aa bb cc dd
      if (resData.result[i].length > 1) {
        resData.result[i].map((item: any, index: any) => {
          const kaipiao: any = {};
          kaipiao.kcreateBy = item.createBy;
          kaipiao.kcreateTime = item.createTime;
          kaipiao.kdelStatus = item.delStatus;
          kaipiao.kgoodId = item.goodId;
          kaipiao.kid = item.id;
          kaipiao.kmoney = item.money;
          kaipiao.kname = item.name;
          kaipiao.kgoodName = item.goodName;
          kaipiao.knum = item.num;
          kaipiao.korderId = item.orderId;
          kaipiao.kremark = item.remark;
          kaipiao.kstate = item.state;
          kaipiao.ksysOrgCode = item.sysOrgCode;
          kaipiao.kunit = item.unit;
          kaipiao.kupdateBy = item.updateBy;
          kaipiao.kupdateTime = item.updateTime;
          kaipiao.kurl = item.url;
          kaipiao.kbatch = item.batch;
          kaipiao.incomeState = item.incomeState;
          kaipiao.kcategory = item.category;
          if (index === 0) {
            kaipiao.ManyToOne = resData.result[i].length;
            promiseList.push(kaipiao);
          } else {
            kaipiao.ManyToOne = 0;
            promiseList.push(kaipiao);
          }
        });
      } else {
        resData.result[i].map((item: any) => {
          const kaipiao: any = {};
          kaipiao.kcreateBy = item.createBy;
          kaipiao.kcreateTime = item.createTime;
          kaipiao.kdelStatus = item.delStatus;
          kaipiao.kgoodId = item.goodId;
          kaipiao.kid = item.id;
          kaipiao.kmoney = item.money;
          kaipiao.kname = item.name;
          kaipiao.kgoodName = item.goodName;
          kaipiao.knum = item.num;
          kaipiao.korderId = item.orderId;
          kaipiao.kremark = item.remark;
          kaipiao.kstate = item.state;
          kaipiao.ksysOrgCode = item.sysOrgCode;
          kaipiao.kunit = item.unit;
          kaipiao.kupdateBy = item.updateBy;
          kaipiao.kupdateTime = item.updateTime;
          kaipiao.kurl = item.url;
          kaipiao.kbatch = item.batch;
          kaipiao.incomeState = item.incomeState;
          kaipiao.kcategory = item.category;
          promiseList.push(kaipiao);
        });
      }
    }
    // console.log(promiseList);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    // Promise.all(promiseList).then((dd) => {
    //TODO
    // console.log('promiseList', promiseList);
    formRef?.current?.setFieldsValue({
      table: promiseList,
    });
    setOldata(promiseList);
    // });
    // if (param === 10086) {
    //   props.pjOrderEdit();
    // }
  };
  //路由校验及获取
  const columnsArr = `${localStorage.getItem('auths')}`;
  const urlData = JSON.parse(columnsArr);
  const check = (url: any) => {
    if (!urlData) {
      return false;
    }
    return urlData.some((item: any) => item.url == url);
  };
  //   const goodsUpData = () => {
  //     const param = 10086;
  //     _pjGoodsNoPageList(param);
  //   };
  const defaultData: any = [];
  const columns: ProColumns<TableListItem>[] = [
    {
      dataIndex: 'index',
      title: '序号',
      width: 50,
      fixed: 'left',
      valueType: 'indexBorder',
    },
    {
      title: '工厂名称',
      dataIndex: 'kname',
      width: 140,
      search: false,
      onCell: (row: any) => {
        {
          return { rowSpan: row.ManyToOne };
        }
      },
    },
    {
      title: '商品名称',
      dataIndex: 'kgoodName',
      width: 140,
      search: false,
    },
    // {
    //   title: '商品名称',
    //   dataIndex: 'kgoodName',
    //   fixed: 'left',
    //   width: 140,
    //   search: false,
    // },
    {
      title: '开票金额',
      dataIndex: 'kmoney',
      valueType: 'digit',
      hideInTable:
        props.dataInfo.clientType === 2 || props.dataInfo.comboType === 'A' ? true : false,
      copyable: true,
      ellipsis: true,
      search: false,
      width: 100,
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
      width: 100,
    },
    // {
    //   title: '创建时间',
    //   key: 'showTime',
    //   dataIndex: 'date',
    //   valueType: 'createTime',
    //   search: false,
    //   width: 180,
    // },
    // {
    //   title: '编辑',
    //   valueType: 'option',
    //   key: 'option',
    //   width: 90,
    //   fixed: 'right',
    //   align: 'center',
    //   render: (row, record, _, action) => [
    //     <a
    //       key="editable"
    //       style={{
    //         display:
    //           check('/ticket/order/edit') === false || props?.dataInfo.state === 3 ? 'none' : '',
    //       }}
    //       onClick={() => {
    //         console.log('editable', row, record, _, record.sort);
    //         action?.startEditable?.(record.sort);
    //       }}
    //     >
    //       编辑
    //     </a>,
    //   ],
    // },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 120,
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
              check('/ticket/order/factory/message') === false
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
              check('/ticket/order/factory/contract') === false
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
    oneKeyGenerate.type = 'factory';
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
    });
    notification.close('openNotification');
  };

  React.useEffect(() => {
    // console.log('useEffect syncCount', props);
    _pjGoodsNoPageList();
  }, [props.syncCount]);
  // const pjOrderEdit = () => {
  //   props.pjOrderEdit();
  // };
  //   function pjGoodsName(value: any) {
  //     console.log(value.target.value, '返回的数据');
  //     const param = value.target.value;
  //     _pjGoodsNoPageList(param);
  //   }
  return (
    <ProCard
      colSpan={{ sm: 4, md: 6, lg: 6, xl: 6 }}
      headerBordered={true}
      title={
        <span id="order_goods" style={{ fontWeight: 'bold' }}>
          工厂信息
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
          <Button
            style={{
              display:
                props?.dataInfo.comboType === 'A' ||
                props?.dataInfo.clientType === 2 ||
                check('/ticket/order/factory/message/download') === false
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
                check('/ticket/order/factory/contract/download') === false
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
                check('/ticket/order/factory/message/create') === false
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
                check('/ticket/order/factory/contract/create') === false
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
