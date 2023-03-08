import { pjFileNoPageList, pjOrdereditState } from '@/services/ant-design-pro/order';
import {
  DownloadOutlined,
  ExclamationCircleOutlined,
  IssuesCloseOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import type { ProFormInstance } from '@ant-design/pro-components';
import ProForm, { ProFormUploadButton } from '@ant-design/pro-form';
import { Button, Checkbox, Col, message, notification, Popconfirm, Space } from 'antd';
import FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { request } from 'umi';
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';
import loadimg from '@/utils/image';
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
export type Props = {
  headerData: any[]; // 状态
  keepRecordUpload: any;
  ref: any;
  queryId: any;
  onChangePjFileEdit: any;
  dataInfo: any;
  syncCount: number;
  pjOrderEdit: any;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};
const KeepRecordData: React.FC<Props> = React.forwardRef((props, ref) => {
  // console.log('KeepRecordData', props);
  const openNotification = () => {
    notification.open({
      icon: <LoadingOutlined style={{ color: 'green' }} />,
      message: '备案资料',
      description: '下载中...',
      duration: null,
      key: 'openNotification',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };
  const formRef = useRef<ProFormInstance<{}>>();
  const [Alldata, setAlldata] = useState([]);
  const [Checkeddata, setChecked] = useState([]);
  const [Checked, setCheckeds] = useState(false);

  useImperativeHandle(ref, () => ({
    getFieldsValue: () => {
      return formRef.current.getFieldsValue();
    },
    getFieldsFormatValue: () => {
      return formRef.current.getFieldsFormatValue();
    },
    setFieldsValue: (value: any) => {
      return formRef.current.setFieldsValue(value);
    },
  }));
  const _pjFileNoPageList = async () => {
    try {
      const dd = {
        sourceId: props.queryId,
        type: 5,
      };
      const res: any = await pjFileNoPageList({ ...dd });
      if (res.code === 200) {
        if (res.result.length > 0) {
          const arr = JSON.parse(res?.result[0]?.message) || [];
          // let fileList=[] declareBill passBook warehousing voucher forwarderBill otherBill
          const newObj = {};
          arr.map((items: any) => {
            items.fileList.map((item1: any) => {
              item1.url = loadimg(item1.url);
            });
            newObj[items.type] = items.fileList;
          });
          formRef?.current?.setFieldsValue(newObj);
          props.onChangePjFileEdit(res?.result[0]?.id);
          setAlldata(JSON.parse(res?.result[0]?.message));
        }
        // props.onChangeData(JSON.stringify(res.result), '1');
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
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
  //下载备案资料
  const _downloadCodeImg = () => {
    // 要下载图片的url
    // console.log(Checked, Checkeddata);
    if (Alldata.length == 0) {
      return;
    }
    const arry: any = [];
    if (Checked === true) {
      if (Checkeddata.length > 0) {
        Checkeddata.map((item: any) => {
          item.fileList.map((key: any) => {
            const dd: any = {};
            dd.fileName = key.name;
            // const url1 = loadimg(key.url);
            // console.log('url1', url1);
            // const url = url1.split('.com')[1];
            const url = key.url;
            dd.path = url;
            arry.push(dd);
          });
        });
      } else {
        message.error('请选择有数据的选项！');
        return;
      }
    } else {
      Alldata.map((item: any) => {
        item.fileList.map((key: any) => {
          const dd: any = {};
          dd.fileName = key.name;
          // const url1 = loadimg(key.url);
          // console.log('url1', url1);
          // const url = url1.split('.com')[1];
          const url = key.url;
          dd.path = url;
          arry.push(dd);
        });
      });
    }
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1;
    const date = nowDate.getDate();
    const zip = new JSZip();
    const cache = {};
    const promises: any = [];
    arry.forEach((item: any) => {
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
          '备案资料' +
            year +
            +(month > 9 ? month : '0' + month) +
            (date > 9 ? date : '0' + date) +
            +'_' +
            props.queryId +
            '.zip',
        ); // 利用file-saver保存文件  自定义文件名
        // eslint-disable-next-line no-undef
        // saveAs(content, '文件下载.zip'); // 利用file-saver保存文件  自定义文件名
      });
    });
  };
  //图片宽高
  const _loadImgage = (url: any) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      // img.setAttribute('crossOrigin', 'Anonymous');
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
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      const canvas = document.createElement('canvas');
      canvas.height = width;
      canvas.width = height;
      const ctx: any = canvas.getContext('2d');
      img.setAttribute('crossOrigin', 'Anonymous');
      ctx.fillStyle = '#fff';
      img.onerror = reject;
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
    }).catch((exception) => {
      console.log('exception', exception);
      message.error('部分备案资料下载失败，请联系开发人员');
      notification.close('openNotification');
    });
  };
  //PDF转图片
  const _onladPdf = async (url: any) => {
    const loadingTask = PDFJS.getDocument({
      url: url,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/cmaps/',
      cMapPacked: true, // 解决图片没有汉字的问题
    });
    // console.log('loadingTask', loadingTask);
    const pdf = await loadingTask.promise
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then((pdf) => {
        return pdf;
      })
      .catch((exception) => {
        console.log('exception', exception);
        message.error('部分备案资料下载失败，请联系开发人员');
        notification.close('openNotification');
        return false;
      });
    // console.log('pdf', pdf);
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
      console.log('xx', xx);
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

  //导出PDF
  const _downloadPDF = async () => {
    // 要下载图片的url
    if (Alldata.length == 0) {
      return;
    }
    openNotification();
    const arry: any = [];
    const thisarry: any = {};
    if (Checked === true) {
      if (Checkeddata.length > 0) {
        thisarry.aurl = Checkeddata;
      } else {
        message.error('请选择有数据的选项！');
        notification.close('openNotification');
        return;
      }
    } else {
      thisarry.aurl = Alldata;
    }
    for (let index = 0; index < thisarry.aurl.length; index++) {
      const element: any = thisarry.aurl[index];
      for (let i = 0; i < element.fileList.length; i++) {
        if (
          element.fileList[i].url.indexOf('.png') >= 0 ||
          element.fileList[i].url.indexOf('.jpg') >= 0 ||
          element.fileList[i].url.indexOf('.pdf') >= 0 ||
          element.fileList[i].url.indexOf('.jpeg') >= 0
        ) {
          const data = element.fileList[i];
          const dd: any = {};
          const url = data.url;
          if (url.indexOf('.pdf') >= 0) {
            // const url1 = loadimg(data.url);
            // const cc: any = url1.split('.com')[1];
            const cc: any = data.url;
            // const cc: any = 'https://ljyst.com/opt/upFiles/RS22CX007放行通知书_1658368733681.pdf';
            dd.path = await _onladPdf(cc);
          } else {
            // dd.path = 'https://ljyst.com/opt/upFiles/指代付款水单_1658716541301.png';
            dd.path = url;
          }
          arry.push(dd);
        }
      }
    }
    const newArry: any[] = [];
    // console.log('arry', arry);
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
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1;
    const date = nowDate.getDate();
    // console.log('newArry', newArry);
    for (let index = 0; index < newArry.length; index++) {
      const item = newArry[index];
      const imgObj: any = await _loadImgage(item.path);
      if (imgObj.width > imgObj.height) {
        const base64url: any = await _drawImage(item.path, imgObj.height, imgObj.width);
        if (base64url) {
          if (index !== 0) {
            recordPdf.addPage('a4');
          }
          recordPdf.addImage(base64url, 'jpeg', 1, 1.2, 19, 26.6);
        } else {
          return;
        }
      } else {
        if (index !== 0) {
          recordPdf.addPage('a4');
        }
        recordPdf.addImage(item.path, 'jpeg', 1, 1.2, 19, 26.6);
      }
      // recordPdf.addImage(item.path, 'jpeg', 1, 1.2, 19, 26.6);
    }
    recordPdf
      .save(
        '备案资料' +
          year +
          +(month > 9 ? month : '0' + month) +
          (date > 9 ? date : '0' + date) +
          '_' +
          props.queryId +
          '.pdf',
        { returnPromise: true },
      )
      .then((res) => {
        console.log(res);
        // message.success('下载成功');
        notification.close('openNotification');
      })
      .catch((err) => {
        console.log(err);
        notification.close('openNotification');
      });
  };
  const _downloadPDFnow = async () => {
    try {
      _downloadPDF();
    } catch (error) {
      message.error('请求错误');
      notification.close('openNotification');
      console.log('xxx', error);
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
  const onChange = (e: any) => {
    console.log(e, Alldata);
    if (e.length > 0) {
      setCheckeds(true);
      e.map((items: any) => {
        const newArr = Alldata.filter((item: any) => item.type === items.type);
        const dd = [...newArr, ...Checkeddata];
        setChecked(newArr);
        console.log(dd);
      });
    } else {
      setCheckeds(false);
    }
    // if (e.target.checked === true) {
    //   const newArr = Alldata.filter((item: any) => item.type === e.target.value.type);
    //   const dd = [...newArr, ...Checkeddata];
    //   setChecked(dd);
    //   console.log(dd, Checkeddata);
    // }
    // if (e.target.checked === false) {
    //   const newArr = Checkeddata.filter((item: any) => item.type !== e.target.value.type);
    //   setChecked(newArr);
    //   console.log(newArr, Checkeddata);
    // }
  };
  const onChangedelete = (e: any) => {
    if (e.target.checked === false) {
      const newArr = Checkeddata.filter((item: any) => item.type !== e.target.value.type);
      const dd = [...newArr, ...Checkeddata];
      setChecked(dd);
      console.log(newArr, Checkeddata);
    }
  };

  React.useEffect(() => {
    _pjFileNoPageList();
  }, [props.syncCount]);
  return (
    <ProCard
      colSpan={{ sm: 4, md: 6, lg: 6, xl: 6 }}
      headerBordered={true}
      title={
        <span id="order_keeprecord" style={{ fontWeight: 'bold' }}>
          备案资料
        </span>
      }
      bordered
      direction="column"
      extra={
        <>
          <Popconfirm
            key="view4"
            title="是否已经下载？"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={async () => {
              const dd = {
                id: props.queryId,
                isDownload: 1,
              };
              const res: any = await pjOrdereditState(dd);
              if (res.code === 200) {
                props.pjOrderEdit();
              } else {
                message.error(res.message);
              }
            }}
          >
            <Button
              key={'downzip'}
              style={{
                display:
                  check('/ticket/order/reference/isDownload') === false ||
                  props.dataInfo.isDownload === 1
                    ? 'none'
                    : '',
              }}
              type="primary"
              icon={<IssuesCloseOutlined />}
            >
              确认已下载
            </Button>
          </Popconfirm>
          <Button
            key={'downzip'}
            style={{
              marginLeft: 10,
              display: check('/ticket/order/reference') === false ? 'none' : '',
            }}
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              _downloadCodeImg();
            }}
          >
            下载备案资料
          </Button>
          <Button
            key={'downpdf'}
            type="primary"
            icon={<DownloadOutlined />}
            style={{
              marginLeft: 10,
              marginRight: '3vw',
              display: check('/ticket/order/reference/pdf') === false ? 'none' : '',
            }}
            onClick={() => {
              _downloadPDFnow();
            }}
          >
            导出PDF文件
          </Button>
        </>
      }
      style={{ marginTop: 20 }}
    >
      <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
        <ProForm
          submitter={false}
          formRef={formRef}
          layout="horizontal"
          {...formItemLayout}
          grid={true}
          labelCol={{ span: 10 }}
          size="middle"
          labelAlign="right"
        >
          {(props.keepRecordUpload || []).map((item: any, key: any) => {
            return (
              <Col xs={24} sm={12} md={12} lg={12} xl={8} xxl={6} key={key}>
                <ProFormUploadButton
                  width="xs"
                  key={key}
                  name={item.type}
                  label={
                    <Space>
                      <Checkbox value={item} onChange={onChangedelete}></Checkbox>
                      <span style={{ color: item.cut === 'red' ? 'red' : '' }}>{item.name}</span>
                    </Space>
                  }
                  max={item?.maxNum}
                  fieldProps={{
                    name: 'file',
                    listType: 'text',
                    multiple: item?.maxNum == 1 ? false : true,
                    headers: {
                      'Tenant-Token': `${localStorage.getItem('token')}`,
                    },
                    showUploadList: {
                      showDownloadIcon:
                        check('/ticket/order/reference/delete') === false ? false : true,
                      // showPreviewIcon: true,
                      showRemoveIcon: true,
                      // removeIcon: '删除',
                    },
                    disabled:
                      check('/ticket/order/reference/upload') === false ||
                      props.dataInfo.state === 3
                        ? true
                        : false,
                  }}
                  onChange={(e) => {
                    console.log(e);
                    if (e.file.status == 'removed') {
                      //移除图片时；
                    } else if (e.file.status == 'done') {
                      //上传完成时
                      if (e.file.response.code == 200) {
                      } else {
                        message.error(e.file.response.message ?? '上传失败');
                      }
                    } else if (e.file.status == 'error') {
                      //上传错误时
                    } //status状态：'error' | 'success' | 'done' | 'uploading' | 'removed';
                  }}
                  action="/admin/sys/common/upload"
                />
              </Col>
            );
          })}
        </ProForm>
      </Checkbox.Group>
    </ProCard>
  );
});

export default KeepRecordData;
