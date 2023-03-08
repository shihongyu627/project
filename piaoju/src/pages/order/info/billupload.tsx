// import { ocrChange } from '@/services/ant-design-pro/ocr'; //阿里ocr
import { tencentOcr } from '@/services/ant-design-pro/ocr'; //腾讯ocr
import {
  invoiceCheckList,
  pjFileAddBatch,
  pjOrdercheckBatch,
  pjOrdercheckBatchtow,
  upload,
} from '@/services/ant-design-pro/order';
import openModal from '@/utils/page';
import {
  ExclamationCircleOutlined,
  LoadingOutlined,
  UploadOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import ProForm, { ProFormDatePicker } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { Button, Col, message, Popconfirm, notification, Row, Upload, Tooltip, Card } from 'antd';
import React, { useState } from 'react';
import loadimg from '@/utils/image';
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';
import moment from 'moment';
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// import BillPreview from './billPreview';
type DataSourceType = {
  id: React.Key;
  title?: string;
  ManyToOne?: string;
  readonly?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  update_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [];
export type Props = {
  headerData: any[]; // 状态
};

const Header: React.FC<Props> = (props: any, ref) => {
  console.log('props', props, ref);
  const [loading, setloading] = useState(true);
  const [length, setlength] = useState(0);
  // const formRef = useRef<ProFormInstance>();
  // const editorFormRef = useRef<EditableFormInstance>();

  const openNotification = () => {
    notification.open({
      icon: <LoadingOutlined style={{ color: 'green' }} />,
      message: '进项发票',
      description: '正在上传识别中...',
      duration: null,
      key: 'openNotification',
      onClick: () => {},
    });
  };
  const _pjFileNoPageList = async () => {
    try {
      const dd: any = {};
      if (props.ManyToOne) {
        dd.batch = props.batch;
        dd.factory = props.name;
      } else {
        dd.batch = props.batch;
        dd.factory = props.name;
        dd.billIds = props.id;
      }
      const res: any = await invoiceCheckList({ ...dd });
      if (res.code === 200) {
        res.result.map((item: any, index: any) => {
          // item.unit = unit;
          item.index = index;
          item.url = loadimg(item.url);
          return item;
        });
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        setDataSource(res.result);
        setloading(false);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    _pjFileNoPageList();
  }, []);
  //路由校验及获取
  const columnsArr = `${localStorage.getItem('auths')}`;
  const urlData = JSON.parse(columnsArr);
  const check = (url: any) => {
    if (!urlData) {
      return false;
    }
    return urlData.some((item: any) => item.url == url);
  };
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [dataSourcedel, setDataSourcedel] = useState<DataSourceType[]>([]);
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '序号',
      dataIndex: 'sort',
      // 第一行不允许编辑
      readonly: true,
      width: 60,
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
      title: '文件',
      dataIndex: 'name',
      readonly: true,
      width: 100,
    },
    {
      title: '发票号码',
      dataIndex: 'invoiceCode',
      width: 140,
    },
    {
      title: '发票代码',
      dataIndex: 'billNum',
      width: 140,
    },
    {
      title: '开票时间',
      valueType: 'date',
      dataIndex: 'invoiceDate',
      width: 130,
      renderFormItem(schema, config) {
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
            initialValue={row.invoiceDate}
          />
        );
      },
    },
    {
      title: '上传日期',
      dataIndex: 'createTime',
      readonly: true,
      valueType: 'date',
      width: 100,
    },
    {
      title: '收到日期',
      dataIndex: 'receivedTime',
      valueType: 'date',
      width: 130,
      renderFormItem(schema, config) {
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
            initialValue={row.receivedTime}
          />
        );
      },
    },
    {
      title: '商品名称',
      dataIndex: 'goodName',
      // ellipsis: true,
      width: 170,
    },
    {
      title: '数量',
      dataIndex: 'goodNum',
      valueType: 'digit',
      ellipsis: true,
      width: 100,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: 80,
    },
    {
      title: '金额',
      dataIndex: 'goodPrice',
      valueType: 'digit',
      width: 140,
    },
    {
      title: '工厂名称',
      dataIndex: 'factory',
      width: 200,
    },
    {
      title: '购货方',
      dataIndex: 'buyer',
      width: 200,
    },
    {
      title: '税号',
      dataIndex: 'identity',
      width: 220,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      align: 'center',
      fixed: 'right',
      render: (text, record: any, _, action) => [
        // <a
        //   onClick={() => {
        //     openModal.closeModal();
        //     const targetId = 'abc1';
        //     setTimeout(() => {
        //       openModal.showModal(
        //         <BillPreview
        //           mode={'modal'}
        //           action={'add'}
        //           id={record.id}
        //           data={record}
        //           submitTarget={targetId}
        //         />,
        //         {
        //           title: '进项发票预览',
        //           footer: <div id={targetId} />,
        //         },
        //       );
        //     }, 500);
        //   }}
        // >
        //   预览
        // </a>,
        <a
          key={'preview'}
          style={{
            display: check('/ticket/order/input/preview') === false ? 'none' : '',
          }}
          href={record.url}
          target="_blank"
          onClick={() => {
            console.log(record);
            // history?.push(record.url);
          }}
          rel="noreferrer"
        >
          预览
        </a>,
        // <a>效验</a>,
        <a
          key="editable"
          style={{
            display:
              check('/ticket/order/input/edit') === false || props?.dataInfo.dataInfo.state === 3
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
            const InvocieList = dataSource;
            if (record.id) {
              const newArrdelete = InvocieList.filter((item: any) => item.sort === record.sort);
              newArrdelete.map((item: any) => {
                item.delStatus = 1;
              });
              setDataSourcedel(newArrdelete);
              const newArrtow = InvocieList.filter((item: any) => item.sort !== record.sort);
              setDataSource(newArrtow);
            } else {
              const newArr = InvocieList.filter((item: any) => item.sort !== record.sort);
              setDataSource(newArr);
            }
          }}
        >
          <a
            type="link"
            style={{
              color: '#ff4d4f',
              display:
                check('/ticket/order/input/delete') === false ||
                props?.dataInfo.dataInfo.state === 3
                  ? 'none'
                  : '',
            }}
          >
            删除
          </a>
        </Popconfirm>,
        // <a
        //   key="import"
        //   style={{ color: '#ff4d4f' }}
        //   onClick={() => {
        //     _downloadIamge(record.url, 'xx');
        //   }}
        // >
        //   导出
        // </a>,
        // <a key="import" style={{ color: '#ff4d4f' }}>
        //   导出
        // </a>,
      ],
    },
  ];

  // //阿里ocr
  // async function _ocrChange(url: any, name: any) {
  //   try {
  //     const dd = {
  //       url: loadimg(url),
  //       type: 'RecognizeInvoice',
  //     };
  //     const res: any = await ocrChange({ ...dd });
  //     if (res.code === 200) {
  //       console.log(res);
  //       // const InvocieList = editorFormRef.current.getRowsData();
  //       const InvocieList: any = [];
  //       dataSource.map((item: any) => {
  //         InvocieList.push(item);
  //       });
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
  //       obj.bizId = result?.BizId;
  //       obj.parsingMessage = result?.ParsingMessage;
  //       obj.message = result?.Message?.data;
  //       obj.billNum = data.invoiceNumber;
  //       obj.invoiceCode = data.invoiceCode;
  //       obj.invoiceDate = date;
  //       obj.sourceId = props.id;
  //       obj.url = url;
  //       obj.type = 3;
  //       obj.identity = data.purchaserTaxNumber;
  //       obj.buyer = data.purchaserName;
  //       obj.factory = data.sellerName;
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
  //         item.sort = index;
  //         return item;
  //       });
  //       console.log('InvocieList', InvocieList);
  //       setDataSource(InvocieList);
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
  const InvocieList: any = [];
  dataSource.map((item: any) => {
    InvocieList.push(item);
  });
  let nowlength = length;
  //腾讯ocr
  const _ocrChange = async (url: any, name: any) => {
    // try {
    const dd: any = {};
    dd.orderId = props.dataInfo.queryId;
    dd.type = 'input';
    // 识别url的后缀
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
        // const InvocieList = editorFormRef.current.getRowsData();
        const result = thisres?.result;
        result.map((item: any) => {
          // item.identity = props.dataInfo.dataInfo.identity;
          // item.buyer = props.dataInfo.dataInfo.clientName;
          item.sourceId = props.id;
          item.type = 3;
          // item.url = item.url.split('.com')[1];
          item.url = item.url;
          InvocieList.push(item);
        });
        nowlength = nowlength + 1;
        InvocieList.map((item: any, index: any) => {
          item.sort = index + 1;
          item.keyindex = nowlength;
          return item;
        });
        // 关闭通知
        notification.close('openNotification');
        return InvocieList;
      } else {
        // message.error('OCR识别返回失败');
        // 关闭通知
        notification.close('openNotification');
        nowlength = nowlength + 1;
        InvocieList.map((item: any, index: any) => {
          item.sort = index;
          item.keyindex = nowlength;
          return item;
        });
        return InvocieList;
      }
    } else {
      message.error('文件路径为空无法识别，请重新上传！');
    }
    // }
    // catch (error) {
    //   console.log(error);
    //   // 关闭通知
    //   notification.close('openNotification');
    // }
  };
  // //腾讯ocr
  // async function _ocrChangeOld(url: any, name: any) {
  //   try {
  //     const dd: any = {};
  //     if (url.indexOf('.pdf') >= 0) {
  //       const url1 = loadimg(url);
  //       const cc: any = url1.split('.com')[1];
  //       const imgurl = await _onladPdf(cc);
  //       // const imgArr = [];
  //       // imgArr.push(imgurl);
  //       mergeImgs(imgurl).then(async (base64) => {
  //         const imgDom: any = document.createElement('img');
  //         imgDom.src = base64;
  //         const dataFile = base64toFile(imgDom.src, name);
  //         const formdata = new FormData();
  //         formdata.append('file', dataFile); //这里是PDF文件
  //         // console.log('ticketUrl', formdata);
  //         // formdata.append('id', props.id); //随便写的参数
  //         const res = await upload(formdata);
  //         if (res?.code == 200) {
  //           // message.success('发送成功');
  //           const dataFileurl = res?.result || '';
  //           dd.url = loadimg(dataFileurl);
  //           const thisres: any = await tencentOcr({ ...dd });
  //           if (thisres.code === 200) {
  //             console.log(thisres);
  //             // const InvocieList = editorFormRef.current.getRowsData();
  //             const InvocieList: any = [];
  //             dataSource.map((item: any) => {
  //               InvocieList.push(item);
  //             });
  //             const result = thisres?.result;
  //             result.map((item: any) => {
  //               item.identity = props.dataInfo.dataInfo.identity;
  //               item.buyer = props.dataInfo.dataInfo.buyer;
  //               item.sourceId = props.id;
  //               item.type = 3;
  //               item.url = item.url.split('.com')[1];
  //               console.log(item);
  //               InvocieList.push(item);
  //               return item;
  //             });
  //             InvocieList.map((item: any, index: any) => {
  //               item.sort = index;
  //               return item;
  //             });
  //             console.log('InvocieList', InvocieList);
  //             setDataSource(InvocieList);
  //             // 关闭通知
  //             notification.close('openNotification');
  //             return;
  //           } else {
  //             message.error('OCR识别返回失败');
  //             // 关闭通知
  //             notification.close('openNotification');
  //           }
  //         }
  //         // document.body.appendChild(imgDom);
  //       });
  //     } else {
  //       dd.url = loadimg(url);
  //       const thisres: any = await tencentOcr({ ...dd });
  //       if (thisres.code === 200) {
  //         console.log(thisres);
  //         // const InvocieList = editorFormRef.current.getRowsData();
  //         const InvocieList: any = [];
  //         dataSource.map((item: any) => {
  //           InvocieList.push(item);
  //         });
  //         const result = thisres?.result;
  //         result.map((item: any) => {
  //           item.identity = props.dataInfo.dataInfo.identity;
  //           item.buyer = props.dataInfo.dataInfo.buyer;
  //           item.sourceId = props.id;
  //           item.type = 3;
  //           item.url = item.url.split('.com')[1];
  //           console.log(item);
  //           InvocieList.push(item);
  //           return item;
  //         });
  //         InvocieList.map((item: any, index: any) => {
  //           item.sort = index;
  //           return item;
  //         });
  //         console.log('InvocieList', InvocieList);
  //         setDataSource(InvocieList);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
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
    async onChange(info: any) {
      if (info.file.status !== 'uploading') {
        // console.log('xxxx', info.fileList);
        // props.onChangeData(JSON.stringify(info.fileList), '2');
        const img_url = info.file?.response?.result || '';
        const url = img_url;
        if (info.fileList.length == 0) {
          return;
        }
        const nowInvocieList = await _ocrChange(url, info.file.name);
        let key = 0;
        nowInvocieList.map((item: any) => {
          key = item.keyindex;
        });
        if (key === info.fileList.length) {
          setlength(key);
          setDataSource(nowInvocieList);
        }
        // _ocrChange(url);
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
      showDownloadIcon: true,
      showPreviewIcon: '预览',
      showRemoveIcon: true,
      // removeIcon: '删除',
    },
  };
  const _pjOrdercheckBatch = async () => {
    const dd: any = {};
    if (props.ManyToOne) {
      dd.batch = props.batch;
    } else {
      dd.batch = props.batch;
      dd.billIds = props.id;
    }
    dd.fileList = dataSource;
    const res: any = await pjOrdercheckBatchtow(dd);
    if (res.code === 200) {
      message.success('校验完成');
      setDataSource(res.result);
    } else {
      message.error(res.message);
    }
  };
  const _pjFileaddBatch = async () => {
    const dd: any = {};
    if (dataSource.length > 0) {
      const kk: any = {};
      if (props.ManyToOne) {
        kk.batch = props.batch;
      } else {
        kk.batch = props.batch;
        kk.billIds = props.id;
      }
      kk.fileList = dataSource;
      const res: any = await pjOrdercheckBatch(kk);
      if (res.code === 200) {
        message.success('校验完成');
        setDataSource(res.result);
      } else {
        message.error(res.message);
      }
      // dd.fileList = [...dataSource, ...dataSourcedel];
      dd.fileList = [...res.result, ...dataSourcedel];
      const statedata = [];
      res.result.map((item: any) => {
        if (item.state === 1) {
          const stateone: any = {};
          stateone.state = 1;
          // dd.state = 1;
          statedata.push(stateone);
        }
      });
      if (statedata.length === res.result.length) {
        dd.state = 1;
      } else {
        dd.state = 0;
      }
    } else {
      dd.fileList = dataSourcedel;
      dd.state = 0;
    }
    const result: any = await pjFileAddBatch(dd);
    if (result.code === 200) {
      props.goodsUpData();
      openModal.closeModal();
      return;
    }
  };
  const rule = `${localStorage.getItem('rule')}`;
  const ruledata = JSON.parse(rule);
  return (
    <ProForm<{
      name: string;
      company?: string;
      useMode?: string;
    }>
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      grid={false}
      rowProps={{
        gutter: [16, 0],
      }}
      submitter={{
        render: () => {
          return (
            <Row justify={'end'}>
              <Col style={{ marginRight: '8px' }}>
                <Button
                  type="primary"
                  style={{
                    display:
                      check('/ticket/order/input/verify') === false ||
                      props?.dataInfo.dataInfo.state === 3
                        ? 'none'
                        : '',
                  }}
                  onClick={() => {
                    _pjOrdercheckBatch();
                  }}
                >
                  <Tooltip title={ruledata.input_invoice}>批量校验</Tooltip>
                </Button>
              </Col>
              <Col style={{ marginRight: '8px' }}>
                <Button
                  onClick={() => {
                    openModal.closeModal();
                  }}
                >
                  取消
                </Button>
              </Col>
              <Col style={{ marginRight: '8px' }}>
                <Button
                  style={{
                    display:
                      check('/ticket/order/input/confirm') === false ||
                      props?.dataInfo.dataInfo.state === 3
                        ? 'none'
                        : '',
                  }}
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    _pjFileaddBatch();
                  }}
                >
                  确定
                </Button>
              </Col>
            </Row>
          );
        },
      }}
      params={{}}
    >
      <Upload {...fileProps} accept={'.pdf,.jpg,.jpeg,.png,.jpeg'}>
        <Button
          style={{
            display:
              check('/ticket/order/input/upload') === false || props?.dataInfo.dataInfo.state === 3
                ? 'none'
                : '',
          }}
          icon={<UploadOutlined />}
        >
          <Tooltip title={ruledata.input_invoice_file}>
            上传文件(支持pdf,jpg, png, jpeg格式)
          </Tooltip>
        </Button>
      </Upload>
      <EditableProTable<DataSourceType>
        rowKey="sort"
        scroll={{
          x: 700,
        }}
        // editableFormRef={editorFormRef}
        recordCreatorProps={false}
        loading={loading}
        style={{ marginTop: 20 }}
        columns={columns}
        request={async () => ({
          data: defaultData,
          total: 3,
          success: true,
        })}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          actionRender: (row, config, defaultDom) => [defaultDom.save, defaultDom.cancel],
        }}
      />
    </ProForm>
  );
};

export default Header;
