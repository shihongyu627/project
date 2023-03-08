import { ocrCustoms, ocrGetFileParseResult } from '@/services/ant-design-pro/ocr';
import { pjFiledelete, pjFileNoPageList, upload, pjForeign } from '@/services/ant-design-pro/order';
import {
  ExclamationCircleOutlined,
  LoadingOutlined,
  ScanOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProDescriptions from '@ant-design/pro-descriptions';
import {
  AutoComplete,
  Button,
  message,
  Modal,
  notification,
  Popconfirm,
  Space,
  Upload,
} from 'antd';
import React, { useRef, useState } from 'react';
import styles from './index.less';
import loadimg from '@/utils/image';
export type Props = {
  dataInfo: any; // 状态
  ref: any;
  onChangeDataBill: any;
  onChangeData: any;
  onChangeBillFiles: any;
  confimBill: any;
  queryId: any;
  billData: any;
  syncCount: number;
  saveLoading: boolean;
};
import { jsPDF } from 'jspdf';
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';
import Copy from '../components/copy';
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BillData: React.FC<Props> = React.forwardRef((props: any, ref: any) => {
  // console.log('billData', props);
  const actionRef = useRef();
  const [fileurl, setFileurl] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [dataFile, setdataFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const openNotification = () => {
    notification.open({
      icon: <LoadingOutlined style={{ color: 'green' }} />,
      message: '报关单',
      description: '正在识别中...',
      duration: null,
      key: 'openNotification',
      onClick: () => {
        // console.log('Notification Clicked!');
      },
    });
  };
  const _pjFileNoPageList = async (id: any) => {
    try {
      const dd = {
        sourceId: id,
        type: 1,
      };
      const res: any = await pjFileNoPageList({ ...dd });
      if (res.code === 200) {
        const newArr: any = [];
        res.result.map((item: any) => {
          const databillFiles: any = {};
          databillFiles.uid = item.id;
          databillFiles.name = item.name;
          databillFiles.status = 'done';
          databillFiles.url = loadimg(item.url);
          databillFiles.response = 'Server Error 500';
          newArr.push(databillFiles);
          // console.log('dataFile', dataFile);
        });
        setdataFile(newArr);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //智能识别报关单结果
  const _ocrGetFileParseResult = async (bizId: any) => {
    try {
      const dd = {
        bizId,
      };
      const result: any = await ocrGetFileParseResult({ ...dd });
      if (result.code === 200) {
        if (result.result) {
          setIntervalTime(bizId, true);
          setLoading(false);
          notification.close('openNotification');
          message.success('报关单识别成功');
          props.onChangeDataBill(JSON.stringify(result.result));
          // console.log('billData', props);
          if (result.result?.TradeName != props.dataInfo.clientName) {
            Modal.warning({
              title: '提示',
              content: '境内发货人与企业名称不一致，请仔细核对！',
            });
          }
          fileList.map((item: any) => {
            item.bizId = result.result?.BizId;
            item.parsingMessage = result.result?.ParsingMessage;
            item.message = result.result?.Message;
          });
          setFileList(fileList);
          props.onChangeBillFiles(fileList);
          actionRef?.current?.reload();
        } else {
          setIntervalTime(bizId, false);
        }
        return;
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      notification.close('openNotification');
    }
  };
  //图片宽高
  const _loadImgage = (url: any) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = function () {
        const obj: any = {};
        const width = img.width;
        const height = img.height;
        obj.width = width;
        obj.height = height;
        resolve(obj);
      };
    });
  };
  //加载图片
  const _drawImage = (url: any, height: any, width: any) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      const canvas = document.createElement('canvas');
      canvas.height = width;
      canvas.width = height;
      const ctx: any = canvas.getContext('2d');
      img.setAttribute('crossOrigin', 'Anonymous');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      img.onload = function () {
        ctx.translate(width / 1.5, 0);
        // 5. 旋转转换，改变画笔的旋转角度
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(img, 0, 0);
        setTimeout(() => {
          const base64url = canvas.toDataURL('image/jpeg');
          resolve(base64url);
        }, 50);
      };
    });
  };
  //PDF转图片
  const _onladPdf = async (url: any) => {
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
        scale: 5,
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
        canvasContext: context,
        viewport: viewport,
      });
      const xx = await renderTask.promise;
      console.log(xx);
      const base64url = canvas.toDataURL('image/jpeg', 1);
      newsArr.push(base64url);
    }
    return newsArr;
    // renderTask.promise.then(async () => {
    //   const base64url = canvas.toDataURL('image/jpeg', 1);
    //   console.log(base64url);
    //   return base64url;
    // });
  };
  //多pdf提交识别
  const _sendMailFn = async (myfile: any) => {
    //提交用表单提交了
    const formdata = new FormData();
    formdata.append('file', myfile); //这里是PDF文件
    // formdata.append('id', props.id); //随便写的参数
    const res = await upload(formdata);
    if (res?.code == 200) {
      message.success('发送成功');
      const url = res?.result || '';
      try {
        const dd = {
          url: url,
          orderId: props.queryId,
        };
        const xx: any = await ocrCustoms({ ...dd });
        if (xx.code === 200) {
          const data = xx?.result?.data.bizId || '';
          console.log('data', data);
          setTimeout(() => {
            _ocrGetFileParseResult(data);
          }, 1000);
          return;
        } else {
          message.error(xx.message || '操作异常');
          setLoading(false);
          notification.close('openNotification');
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        notification.close('openNotification');
      }
      // console.log('xx', url);
    }
  };
  const dataURLtoFile = (dataurl: any, filename: any) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    //转换成file对象
    return new File([u8arr], filename, { type: mime });
    //转换成成blob对象
    // return new Blob([u8arr],{type:mime});
  };
  //生成PDF
  const _downloadPDF = async (Alldata: any) => {
    // console.log('Alldata', Alldata);
    // 要下载图片的url
    // if (Alldata.length === 0) {
    //   return;
    // }
    // openNotification();
    const arry: any = [];
    for (let index = 0; index < Alldata.length; index++) {
      const element: any = Alldata[index];
      const data = element;
      const dd: any = {};
      const url = data;
      if (data.indexOf('.pdf') >= 0) {
        // const url1 = loadimg(data.url);
        // const cc: any = url1.split('.com')[1];
        const cc: any = data;
        dd.path = await _onladPdf(cc);
      } else {
        dd.path = url;
      }
      arry.push(dd);
    }
    const newArry: any[] = [];
    arry.map((item: any) => {
      if (typeof item.path == 'string' && item.path.constructor == String) {
        const dd: any = {};
        dd.path = item.path;
        newArry.push(dd);
      } else {
        item.path.map((menu: any) => {
          const dd: any = {};
          dd.path = menu;
          newArry.push(dd);
        });
      }
    });
    const recordPdf = new jsPDF('p', 'cm', 'a4');
    // const nowDate = new Date();
    // const year = nowDate.getFullYear();
    // const month = nowDate.getMonth() + 1;
    // const date = nowDate.getDate();
    for (let index = 0; index < newArry.length; index++) {
      const item = newArry[index];
      if (index !== 0) {
        recordPdf.addPage('a4');
      }
      const imgObj: any = await _loadImgage(item.path);
      if (imgObj.width > imgObj.height) {
        const base64url: any = await _drawImage(item.path, imgObj.height, imgObj.width);
        recordPdf.addImage(base64url, 'jpeg', 1, 1.2, 19, 26.6);
      } else {
        recordPdf.addImage(item.path, 'jpeg', 1, 1.2, 19, 26.6);
      }
      // recordPdf.addImage(item.path, 'jpeg', 1, 1.2, 19, 26.6);
    }
    const pdfFile = recordPdf.output('datauristring');
    //这里是base64，想知道有没有生成pdf，可以打印这里
    // console.log(pdfFile);
    const fileName = '报关单' + '.pdf';
    const myfile = dataURLtoFile(pdfFile, fileName);
    _sendMailFn(myfile);
  };

  function setIntervalTime(bizId: any, isStop: any) {
    if (isStop) {
      return;
    }
    setTimeout(() => {
      _ocrGetFileParseResult(bizId);
    }, 5000);
  }
  //智能识别报关单
  const _ocrCustoms = async (url: any) => {
    setLoading(true);
    const urlStr = url.join(',');
    // console.log(url);
    if (url.lenght === 0) {
      message.error('请上传文件后,再进行识别');
      setLoading(false);
      return;
    }
    if (url.length > 1) {
      // console.log('url', url);
      openNotification();
      _downloadPDF(url);
    } else {
      try {
        const dd = {
          url: urlStr,
          orderId: props.queryId,
        };
        openNotification();
        const res: any = await ocrCustoms({ ...dd });
        if (res.code === 200) {
          const data = res?.result?.data.bizId || '';
          setTimeout(() => {
            _ocrGetFileParseResult(data);
          }, 1000);
          return;
        } else {
          message.error(res.message || '操作异常');
          setLoading(false);
          notification.close('openNotification');
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        notification.close('openNotification');
      }
    }
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
  const fileProps = {
    name: 'file',
    action: '/admin/sys/common/upload',
    headers: {
      'Tenant-Token': `${localStorage.getItem('token')}`,
    },
    multiple: true,
    onChange(info: any) {
      setdataFile(info.fileList.slice());
      if (info.file.status !== 'uploading') {
        // console.log(info.fileList);
        const urlArr = info.fileList || [];
        const dd: any = [];
        const aa: any = [];
        // console.log(urlArr);
        // console.log(info.file, 121331);
        urlArr.map((item: any) => {
          // console.log('item', item);
          const kkdata: any = {};
          const img_url = item?.response?.result || ''; //新的文件上传
          let urldata = '';
          if (img_url) {
            urldata = loadimg(img_url);
            kkdata.url = img_url;
          } else {
            urldata = loadimg(item.url);
            kkdata.url = item.url;
            kkdata.id = item.uid;
          }
          kkdata.name = item?.name || '';
          kkdata.sourceId = props.queryId;
          kkdata.type = 1;
          kkdata.status = item?.status;
          // kkdata.response = 'Server Error 500';
          dd.push(kkdata);
          aa.push(urldata);
        });
        setFileList(dd);
        setFileurl(aa);
      }
      // setdataFile(dataFile);
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    showUploadList: {
      showRemoveIcon:
        check('/ticket/order/bgd/delete') === false || props?.dataInfo.status === 1 ? false : true,
      showDownloadIcon: true,
      downloadIcon: '预览', // removeIcon: '删除',
    },
    onDownload(info: any) {
      const img_url = info?.response?.result || '';
      if (info?.url?.indexOf('http') >= 0) {
        window.open(info?.url);
      } else {
        const url = loadimg(img_url);
        window.open(url);
      }
    },
    async onRemove(info: any) {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: '确认删除',
          content: '将直接从订单中删除该报关单数据，确认删除吗？',
          onOk: async () => {
            if (info.url) {
              const dd = {
                id: info.uid,
              };
              const res = await pjFiledelete(dd);
              if (res.code === 200) {
                resolve(true);
              } else {
                message.error(res.message || '操作异常');
                resolve(false);
              }
            } else {
              resolve(true);
            }
          },
          onCancel: () => {
            reject(false);
          },
        });
      });
    },
  };
  const _trueCustoms = async () => {
    // props.onChangeBillFiles(fileList);
    props.confimBill();
  };
  React.useEffect(() => {
    _pjFileNoPageList(props?.queryId);
  }, [props?.queryId, props.syncCount]);
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const onSearch = async (searchText: string) => {
    const kk: any = {};
    kk.name = searchText;
    const resvalue = await pjForeign(kk);
    const datakey: any = [];
    resvalue.result.map((item: any) => {
      const xx: any = {};
      xx.value = item.name;
      datakey.push(xx);
    });
    setOptions(datakey);
    // const option = [
    //   { value: 'Burns Bay Road' },
    //   { value: 'Downing Street' },
    //   { value: 'Wall Street' },
    // ];
    // setOptions(option);
  };

  const onSelect = (data: string) => {
    console.log('onSelect', data);
  };

  const onChangeforeignName = async (data: string) => {
    const kk: any = {};
    kk.name = data;
    const resvalue = await pjForeign(kk);
    const datakey: any = [];
    resvalue.result.map((item: any) => {
      const xx: any = {};
      xx.value = item.name;
      datakey.push(xx);
    });
    setOptions(datakey);
    setValue(data);
  };
  //规则
  const rule = `${localStorage.getItem('rule')}`;
  const ruledata = JSON.parse(rule);

  return (
    <ProCard
      colSpan={{ sm: 4, md: 6, lg: 6, xl: 6 }}
      headerBordered={true}
      title={<span style={{ fontWeight: 'bold' }}>出口报关单</span>}
      bordered
      direction="column"
      style={{ height: '100%' }}
      extra={
        <Space style={{ marginRight: '3vw' }}>
          <Upload
            {...fileProps}
            fileList={dataFile}
            showUploadList={false}
            accept={'.jpg,.jpeg,.png,.pdf'}
          >
            <Button
              icon={<UploadOutlined />}
              style={{
                display:
                  check('/ticket/order/bgd/upload') === false ||
                  props.dataInfo.state === 3 ||
                  props?.dataInfo.status === 1
                    ? //  ||
                      // check('/ticket/order/finish') === false
                      'none'
                    : '',
              }}
            >
              上传文件 (支持jpg,png,pdf格式)
            </Button>
          </Upload>
          <Button
            key="primary"
            onClick={() => {
              _ocrCustoms(fileurl);
            }}
            icon={<ScanOutlined />}
            type="primary"
            loading={loading}
            style={{
              display:
                check('/ticket/order/bgd/scan') === false ||
                props.dataInfo.state === 3 ||
                props?.dataInfo.status === 1
                  ? //  ||
                    // check('/ticket/order/finish') === false
                    'none'
                  : '',
            }}
          >
            开始识别
          </Button>
          <Popconfirm
            title="确认已上传完报关单吗？"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() =>
              // !完成请求
              {
                _trueCustoms();
              }
            }
          >
            <Button
              className={styles.billbotton}
              loading={props.saveLoading}
              style={{
                display:
                  check('/ticket/order/bgd/confirm') === false ||
                  props.dataInfo.state === 3 ||
                  props?.dataInfo.status === 1
                    ? // ||
                      // check('/ticket/order/finish') === false
                      'none'
                    : '',
              }}
              key="primary"
              type="primary"
            >
              确认报关单
            </Button>
          </Popconfirm>
        </Space>
      }
    >
      <Upload
        {...fileProps}
        listType="picture"
        className="bill-upload-list-inline"
        fileList={dataFile}
        disabled={
          check('/ticket/order/edit') === false || props.dataInfo.state === 3
            ? //  ||check('/ticket/order/finish') === false
              true
            : false
        }
        // fileList={dataFile.concat(fileList)}
      />
      <ProDescriptions
        actionRef={actionRef}
        // bordered
        column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 3 }}
        labelStyle={{ justifyContent: 'flex-end', alignItems: 'center', minWidth: 100 }}
        dataSource={props?.dataInfo}
        editable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          onSave: function (e, value) {
            props.onChangeData(JSON.stringify(value));
          },
        }}
        style={{ marginTop: 20 }}
        columns={[
          {
            title: '合同协议号',
            dataIndex: 'contractNo',
            copyable: true,
            ellipsis: true,
            render: (h, row) => {
              // console.log('text', row);
              return (
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      fontSize: 14,
                      maxWidth: 150,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer',
                    }}
                  >
                    {row.contractNo}
                  </div>
                  <Copy row={row.contractNo} />
                </div>
              );
            },
          },
          {
            title: '出口日期',
            dataIndex: 'exportTime',
            valueType: 'date',
          },
          {
            title: '总价/美元',
            tooltip: ruledata.order_total_price,
            // tooltip: '美金总价（统计数据）',
            dataIndex: 'totalPrice',
            valueType: 'digit',
            render: (h, row) => {
              return (
                <span style={{ fontSize: 14 }}>
                  {row.totalPrice}/{row.currency}
                </span>
              );
            },
          },
          // {
          //   title: '境内资源地',
          //   key: 'text',
          //   dataIndex: 'domesticSite',
          //   copyable: true,
          //   ellipsis: true,
          // },
          {
            title: '成交方式',
            dataIndex: 'soldFor',
            copyable: true,
            ellipsis: true,
          },
          {
            title: '外商名称',
            key: 'text',
            dataIndex: 'foreignName',
            // dataIndex: 'categorys',
            copyable: true,
            ellipsis: true,
            renderFormItem: () => {
              return (
                <AutoComplete
                  value={value}
                  options={options}
                  style={{ width: 200 }}
                  onSelect={onSelect}
                  onSearch={() => {
                    onSearch(value);
                  }}
                  onFocus={() => {
                    onSearch(value);
                  }}
                  onChange={(e) => {
                    onChangeforeignName(e);
                  }}
                  placeholder="请输入外商名称"
                />
              );
            },
            render: (_, row: any) => {
              return (
                <div style={{ fontSize: 14 }}>
                  <span>{row.foreignName || '-'}</span>
                </div>
              );
            },
          },
        ]}
      />
    </ProCard>
  );
});

export default BillData;
