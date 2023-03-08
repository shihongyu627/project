import { LoadingOutlined, MonitorOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, notification, Space, Upload, Tooltip, Card } from 'antd';
import type { PropsWithChildren } from 'react';
import React, { useImperativeHandle, useRef } from 'react';
// import type { ProColumns } from '@ant-design/pro-table';
// import { ocrChange } from '@/services/ant-design-pro/ocr';//阿里识别
import { tencentOcr } from '@/services/ant-design-pro/ocr'; //腾讯识别
import {
  pjFileNoPageList,
  pjGoodsNoPageList,
  pjOrdercheckExportBatch,
  upload,
} from '@/services/ant-design-pro/order';
import { ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import type { EditableFormInstance, ProFormInstance } from '@ant-design/pro-components';
import ProForm, { ProFormDatePicker } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-table';
import loadimg from '@/utils/image';
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';
import moment from 'moment';
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface Props extends PropsWithChildren<any> {
  dataInfo: any; // 状态
  syncCount: number;
}

const InvoiceData: React.FC<Props> = React.forwardRef((props, ref) => {
  // console.log('props', props);
  const openNotification = () => {
    notification.open({
      icon: <LoadingOutlined style={{ color: 'green' }} />,
      message: '出口发票',
      description: '正在上传识别中...',
      duration: null,
      key: 'openNotification',
      onClick: () => {},
    });
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
  const formRef = useRef<ProFormInstance>();
  const editorFormRef = useRef<EditableFormInstance>();
  useImperativeHandle(ref, () => ({
    getRowsData: () => {
      return editorFormRef.current.getRowsData();
    },
    setFieldsValue: () => {
      return formRef?.current?.setFieldsValue();
    },
  }));
  const _pjFileNoPageList = async () => {
    try {
      const dd = {
        sourceId: props.queryId,
        type: 2,
      };
      const res: any = await pjFileNoPageList({ ...dd });
      if (res.code === 200) {
        formRef?.current?.setFieldsValue({
          table: res.result,
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const _pjOrdercheckExportBatch = async () => {
    const xx: any = {};
    xx.column = 'createTime';
    xx.order = 'desc';
    xx.title = '';
    xx.orderId = props.dataInfo.id || '';
    const goodsres = await pjGoodsNoPageList({
      ...xx,
    });
    const dd: any = {};
    dd.fileList = editorFormRef.current.getRowsData();
    dd.goodsList = goodsres.result;
    const res: any = await pjOrdercheckExportBatch({ ...dd });
    if (res.code === 200) {
      message.success('校验完成');
      formRef?.current?.setFieldsValue({
        table: res.result,
      });
    } else {
      message.error(res.message);
    }
  };
  React.useEffect(() => {
    _pjFileNoPageList();
  }, [props.syncCount]);
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      // 第一行不允许编辑
      readonly: true,
      valueType: 'indexBorder',
      width: '5%',
    },
    {
      title: '文件',
      dataIndex: 'name',
      readonly: true,
      width: '10%',
    },
    {
      title: '出口发票号',
      dataIndex: 'billNum',
      ellipsis: true,
    },
    {
      title: '开票日期',
      dataIndex: 'fileTime',
      valueType: 'date',
      ellipsis: true,
      renderFormItem(schema: any, config: any) {
        const row = (config?.record as any) || {};
        return (
          <ProFormDatePicker
            fieldProps={{
              format: 'YYYY-MM-DD',
              disabledDate: (currentDate: any) => {
                return currentDate > moment().endOf('day');
              },
              style: {
                marginTop: '22px',
              },
              // console.log(currentDate);
            }}
            width="md"
            initialValue={row.fileTime}
          />
        );
      },
    },
    {
      title: '商品名称',
      dataIndex: 'goodName',
      // ellipsis: true,
    },
    {
      title: '总价',
      dataIndex: 'goodPrice',
      valueType: 'digit',
      ellipsis: true,
    },
    {
      title: '数量',
      dataIndex: 'goodNum',
      valueType: 'digit',
      ellipsis: true,
    },
    {
      title: '校验状态',
      dataIndex: 'state',
      readonly: true,
      width: 100,
      render: (h: any, row: any) => {
        const tagArr = (row.descr || '').split(',');
        const dd = Array.from(new Set(tagArr));
        return (
          <div>
            <Tooltip
              color={'#fff'}
              style={{ width: 300 }}
              title={
                <div style={{ display: 'flex' }}>
                  <CloseCircleOutlined
                    style={{
                      color: 'red',
                      marginTop: '12px',
                    }}
                  />
                  <Card
                    title={
                      <div style={{ display: 'flex' }}>
                        <div style={{ color: 'black' }}>校验错误，请核对以下数据:</div>
                      </div>
                    }
                    bordered={false}
                    size="small"
                  >
                    {(dd || []).map((item, index) => {
                      return (
                        <div style={{ color: '#555', display: item != '' ? '' : 'none' }}>
                          {index + 1}.{item}
                        </div>
                      );
                    })}
                  </Card>
                </div>
              }
            >
              <div
                style={{
                  fontSize: 14,
                  color: 'red',
                  display: row.state === 0 ? '' : 'none',
                }}
              >
                未通过
              </div>
            </Tooltip>
            <div
              style={{
                fontSize: 14,
                color: 'green',
                display: row.state === 1 ? '' : 'none',
              }}
            >
              已通过
            </div>
          </div>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text: any, record: any, _: any, action: any) => [
        <a
          key={'preview'}
          style={{
            display: check('/ticket/order/export/preview') === false ? 'none' : '',
          }}
          href={record.url}
          target="_blank"
          onClick={() => {
            // console.log(record);
            // history?.push(record.url);
          }}
          rel="noreferrer"
        >
          预览
        </a>,
        <a
          key="editable"
          style={{
            display:
              check('/ticket/order/export/edit') === false || props.dataInfo.state === 3
                ? 'none'
                : '',
          }}
          onClick={() => {
            action?.startEditable?.(record.sort);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key={'delete'}
          title="确认要删除该数据吗？"
          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => {
            const InvocieList = editorFormRef.current.getRowsData();
            const newArr = InvocieList.filter((item: any) => item.sort !== record.sort);
            formRef?.current?.setFieldsValue({
              table: newArr,
            });
            if (record.id) {
              props.onChangeFileIds(record.id);
            }
          }}
        >
          <a
            type="link"
            style={{
              color: '#ff4d4f',
              display:
                check('/ticket/order/export/delete') === false || props.dataInfo.state === 3
                  ? 'none'
                  : '',
            }}
          >
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];
  // //阿里智能识别
  // async function _ocrChange(url: any, name: any) {
  //   try {
  //     const dd = {
  //       url: loadimg(url),
  //       type: 'RecognizeInvoice',
  //     };
  //     const res: any = await ocrChange({ ...dd });
  //     if (res.code === 200) {
  //       console.log(res);
  //       const InvocieList = editorFormRef.current.getRowsData();
  //       const result = res?.result;
  //       const data = res?.result?.data;
  //       const obj: any = {};
  //       //日期转换
  //       const invoiceDate = data.invoiceDate;
  //       const newData = invoiceDate.split('年');
  //       const year = newData[0];
  //       const month = newData[1].split('月')[0];
  //       const day = newData[1].split('月')[1].split('日')[0];
  //       const date = year + '-' + month + '-' + day;
  //       obj.name = name;
  //       obj.BizId = result?.BizId;
  //       obj.parsingMessage = result?.ParsingMessage;
  //       obj.message = result?.Message?.data;
  //       obj.billNum = data.invoiceNumber;
  //       obj.fileTime = date;
  //       obj.sourceId = props.queryId;
  //       obj.url = url;
  //       obj.type = 2;
  //       obj.state = 0;
  //       data.invoiceDetails.map((item: any) => {
  //         Object.assign(item, obj);
  //         item.goodName = item.itemName;
  //         item.goodNum = item.quantity;
  //         item.goodPrice = item.total;
  //         console.log(item);
  //         InvocieList.push(item);
  //         return item;
  //       });
  //       InvocieList.map((item: any, index: any) => {
  //         item.sort = index + 9999;
  //         return item;
  //       });
  //       console.log('InvocieList', InvocieList);
  //       formRef?.current?.setFieldsValue({
  //         table: InvocieList,
  //       });
  //       props.onChangeData(JSON.stringify(res.result));
  //       return;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  //PDF转图片
  const _onladPdf = async (url: any): Promise<any> => {
    const loadingTask = PDFJS.getDocument({
      url: url,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/cmaps/',
      cMapPacked: true, // 解决图片没有汉字的问题
    });
    const pdf = await loadingTask.promise;
    const totalPage = pdf.numPages; //pdf页码
    const newsArr = [];
    for (let index = 0; index < totalPage; index++) {
      const res = await pdf.getPage(index + 1);
      const viewport = res.getViewport({
        scale: 1.5,
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        dontFlip: false,
      }); // 默认会旋转180度需要设置回来rotation：0
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderTask = res.render({
        canvasContext: context as any,
        viewport: viewport,
      });
      await renderTask.promise;

      const base64url = canvas.toDataURL('image/jpeg', 0.92);
      const datanewsArr: any = {};
      datanewsArr.height = canvas.height;
      datanewsArr.width = canvas.width;
      datanewsArr.base64url = base64url;
      // newsArr.push(base64url);
      newsArr.push(datanewsArr);
    }

    return newsArr;
    // renderTask.promise.then(async () => {
    //   const base64url = canvas.toDataURL('image/jpeg', 1);
    //   console.log(base64url);
    //   return base64url;
    // });
  };
  //多张图片合为一张 可以是链接图片
  //这里把图片放大了2倍更加清晰,原始会比较模糊
  const mergeImgs = (list: any) => {
    // 获取pdf集合宽度、高度
    // 宽度取最宽
    // 高度取和
    let cheights = 0;
    let cwidths = 0;
    const scale = 1; // 缩放比例
    list.map((item: any) => {
      if (item.width > cwidths) {
        cwidths = item.width;
      }
      if (item.height > 0) {
        cheights += item.height;
      }
    });
    cheights = cheights / scale;
    cwidths = cwidths / scale;
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = cwidths;
      canvas.height = cheights;
      const context = canvas.getContext('2d');
      // canvas绘制y轴
      let topY = 0;
      list.map((item: any, index: number) => {
        const img = new Image();
        img.src = item.base64url;
        // 跨域
        img.crossOrigin = 'Anonymous';
        img.width = item.width;
        img.height = item.height;
        img.onload = () => {
          context?.drawImage(img, 0, topY);
          topY += img.height;
          if (index == list.length - 1) {
            const base64 = canvas.toDataURL('image/png');
            // 返回新的图片
            resolve(base64);
          }
        };
      });
    });
  };
  const base64toFile = (data: any, fileName: any) => {
    const dataArr = data.split(',');
    const byteString = atob(dataArr[1]);
    const options: any = {
      type: 'image/jpeg',
      endings: 'native',
    };
    const u8Arr = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      u8Arr[i] = byteString.charCodeAt(i);
    }
    const fileNamenow = fileName.substring(0, fileName.lastIndexOf('.'));
    return new File([u8Arr], fileNamenow + '.jpg', options); //返回文件流
  };
  //腾讯ocr
  async function _ocrChange(url: any, name: any) {
    try {
      const dd: any = {};
      // 识别url的后缀
      dd.orderId = props.queryId;
      dd.type = 'export';
      const suffix = url.split('.').pop();
      // 如果是pdf则先转换成图片
      if (suffix === 'pdf') {
        const newsArr = await _onladPdf(url);
        const base64 = await mergeImgs(newsArr);
        const file = base64toFile(base64, name);
        dd.file = file;
        // 上传图片到服务器
        const formdata = new FormData();
        formdata.append('file', file);
        const res = await upload(formdata);
        if (res?.code == 200) {
          // message.success('发送成功');
          const dataFileurl = res?.result || '';
          dd.url = loadimg(dataFileurl);
        } else {
          // 图片上传错误
          message.error('转换上传图片失败');
          // 关闭通知
          notification.close('openNotification');
          return false;
        }
      } else {
        dd.url = loadimg(url);
      }
      if (dd.url) {
        // 图片进行识别
        const thisres: any = await tencentOcr({ ...dd });
        if (thisres.code === 200) {
          const InvocieList = editorFormRef.current.getRowsData();
          const result = thisres?.result;
          result.map((item: any) => {
            item.type = 2;
            item.sourceId = props.queryId;
            item.fileTime = item.invoiceDate;
            // item.url = item.url.split('.com')[1];
            item.url = item.url;
            InvocieList.push(item);
            return item;
          });
          InvocieList.map((item: any, index: any) => {
            item.sort = index + 9999;
            return item;
          });
          formRef?.current?.setFieldsValue({
            table: InvocieList,
          });
          props.onChangeData(JSON.stringify(thisres.result));
          // 关闭通知
          notification.close('openNotification');
          return;
        } else {
          // message.error('OCR识别返回失败');
          // 关闭通知
          notification.close('openNotification');
        }
      } else {
        message.error('文件路径为空无法识别，请重新上传！');
      }
    } catch (error) {
      console.log(error);
      // 关闭通知
      notification.close('openNotification');
    }
  }

  const fileProps = {
    name: 'file',
    action: '/admin/sys/common/upload',
    headers: {
      'Tenant-Token': `${localStorage.getItem('token')}`,
    },
    multiple: true,
    beforeUpload(file: any, fileList: any) {
      console.log('beforeUpload', file, fileList);
      // 打开通知
      openNotification();
      return true;
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        // props.onChangeData(JSON.stringify(info.fileList), '2');
        const img_url = info.file?.response?.result || '';
        const url = img_url;
        if (info.fileList.length == 0) {
          return;
        }
        _ocrChange(url, info.file.name);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
        // 关闭通知
        notification.close('openNotification');
      }
    },
    showUploadList: {
      showRemoveIcon: true,
      showDownloadIcon: true,
      downloadIcon: '预览', // removeIcon: '删除',
    },
    onDownload(info: any) {
      const img_url = info?.response?.result || '';
      const url = loadimg(img_url);
      window.open(url);
    },
  };
  const defaultData: any = [];
  const rule = `${localStorage.getItem('rule')}`;
  const ruledata = JSON.parse(rule);
  return (
    <ProCard
      colSpan={{ sm: 4, md: 6, lg: 6, xl: 6 }}
      headerBordered={true}
      title={
        <span id="order_invoice" style={{ fontWeight: 'bold' }}>
          出口发票
        </span>
      }
      bordered
      direction="column"
      style={{ marginTop: 20 }}
      extra={
        <Space>
          <Upload {...fileProps} showUploadList={false} accept={'.pdf,.jpg,.jpeg,.png,.jpeg'}>
            <Button
              icon={<UploadOutlined />}
              style={{
                display:
                  check('/ticket/order/export/upload') === false || props.dataInfo.state === 3
                    ? 'none'
                    : '',
              }}
            >
              <Tooltip title={ruledata.export_invoice_file}>
                上传文件(支持pdf,jpg, png, jpeg格式)
              </Tooltip>
              {/* 上传文件 (支持pdf,jpg, png格式) */}
            </Button>
          </Upload>
          <Button
            key="primary"
            icon={<MonitorOutlined />}
            style={{
              display:
                check('/ticket/order/export/verify') === false || props.dataInfo.state === 3
                  ? 'none'
                  : '',
              marginRight: '3vw',
            }}
            onClick={() => {
              _pjOrdercheckExportBatch();
              // _ocrCustoms(fileList);
            }}
            type="primary"
          >
            <Tooltip title={ruledata.export_invoice}>批量校验</Tooltip>
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
      >
        {/* <Upload {...fileProps}>
          <Button
            icon={<UploadOutlined />}
            style={{
              display:
                check('/ticket/order/edit') === false ||
                props.dataInfo.state === 3 ||
                check('/ticket/order/finish') === false
                  ? 'none'
                  : '',
            }}
          >
            上传文件
          </Button>
        </Upload>
        <span
          style={{
            color: 'rgba(0, 0, 0, 0.447058823529412)',
            display:
              check('/ticket/order/edit') === false ||
              props.dataInfo.state === 3 ||
              check('/ticket/order/finish') === false
                ? 'none'
                : '',
          }}
        >
          支持jpg, png, gif, tiff格式
        </span> */}
        <EditableProTable
          rowKey="sort"
          scroll={{
            x: 960,
          }}
          editableFormRef={editorFormRef}
          recordCreatorProps={false}
          name="table"
          loading={false}
          style={{ marginTop: 20 }}
          columns={columns}
        />
      </ProForm>
    </ProCard>
  );
});

export default InvoiceData;
