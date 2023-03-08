import {
  getClientData,
  //   noPageGkList,
  upload,
  // pjBillingedit,
  //   pjBillinginfo,
  pjBillingcheckBatch,
  getBillAll,
} from '@/services/ant-design-pro/order';
import openModal from '@/utils/page';
import ProCard from '@ant-design/pro-card';
import type { ProColumns } from '@ant-design/pro-components';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProForm from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { Button, Col, notification, Row, Spin, Typography } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useRef, useState } from 'react';
import loadimg from '@/utils/image';
import { LoadingOutlined } from '@ant-design/icons';
const { Paragraph } = Typography;
export type Props = {
  // headerData: any[]; // 状态
  dataInfo: any;
  mode: any;
  action: any;
  submitTarget: any;
  // record: any;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PdfDow: React.FC<Props> = React.forwardRef((props, ref) => {
  const actionRef = useRef();
  const [loading, setLoading] = useState(false);

  // const _toggle = (checked: boolean) => {
  //   setLoading(checked);
  // };
  const [twoContent, setTwoContent] = useState('');
  const [threeContent, setThreeContent] = useState('');
  const [editValue, setEditValue] = useState(false);
  const [datasorce, setdatasorce] = useState({});
  const [datasorces, setdatasorces] = useState([]);
  const openNotification = (v1: any, v2: any) => {
    notification.open({
      icon: <LoadingOutlined style={{ color: 'green' }} />,
      message: '开票通知生成中',
      description: '正在生成' + v1 + '/' + v2 + '，请稍等',
      duration: null,
      key: 'openNotification',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };
  const [headerColums, setHeaderColums] = useState<any>([
    {
      title: '购货方名称',
      key: 'text',
      dataIndex: 'billName',
      editable: false,
    },
    {
      title: '单位地址',
      key: 'text',
      dataIndex: 'billAddress',
      editable: false,
    },
    {
      title: '开户银行',
      key: 'text',
      dataIndex: 'billBank',
      editable: false,
    },
    {
      title: '账号',
      key: 'text',
      dataIndex: 'billAccount',
      editable: false,
    },
    {
      title: '税号',
      key: 'text',
      dataIndex: 'billIdentity',
      editable: false,
    },
    // {
    //   title: '海关代码',
    //   key: 'text',
    //   dataIndex: 'customsCode',
    //   editable: false,
    // },
    {
      title: '电话',
      key: 'text',
      dataIndex: 'billCall',
      editable: false,
    },
    {
      title: '合同编码',
      key: 'text',
      dataIndex: 'contractNo',
      editable: false,
    },
  ]);
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
  const download = () => {
    //setIsLoading(true);
    const senddata: any = [];
    for (const k in datasorce) {
      //   console.log(i); //a b c d

      //   console.log(resData.result[i]); // aa bb cc dd
      // datasorce.map((item: any) => {
      setdatasorces(datasorce[k]);
      const element: any = document.getElementById('billNoticePdf'); // 这个dom元素是要导出pdf的div容器
      const w = element.offsetWidth; // 获得该容器的宽
      const h = element.offsetWidth; // 获得该容器的高
      const offsetTop = element.offsetTop; // 获得该容器到文档顶部的距离
      const offsetLeft = element.offsetLeft; // 获得该容器到文档最左的距离
      const canvas = document.createElement('canvas');
      let abs = 0;
      const win_i = document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
      const win_o = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）
      if (win_o > win_i) {
        abs = (win_o - win_i) / 2; // 获得滚动条长度的一半
      }
      canvas.width = w * 2; // 将画布宽&&高放大两倍
      canvas.height = h * 2;
      const context: any = canvas.getContext('2d');
      context.scale(2, 2);
      context.translate(-offsetLeft - abs, -offsetTop);
      // 这里默认横向没有滚动条的情况、因为offset.left(),有无滚动条的时候存在差值、因此
      // translate的时候、要把这个差值去掉
      html2canvas(element, {
        allowTaint: true,
        scale: 2, // 提升画面质量，但是会增加文件大小
        // background: '#FFFFFF',
        // eslint-disable-next-line @typescript-eslint/no-shadow
      }).then(async function (canvas) {
        let leftHeight = canvas.height;
        const a4Width = 595.28;
        const a4Height = 841.89; //A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
        //一页pdf显示html页面生成的canvas高度;
        const a4HeightRef = Math.floor((canvas.width / a4Width) * a4Height);
        //pdf页面偏移
        let position = 0;
        const pageData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'pt', 'a4'); //A4纸，纵向
        let index = 1;
        // eslint-disable-next-line prefer-const
        let canvas1 = document.createElement('canvas'),
          height = 0;
        pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen');
        // eslint-disable-next-line @typescript-eslint/no-shadow
        async function createImpl(canvas: any) {
          if (leftHeight > 0) {
            index++;
            let checkCount = 0;
            if (leftHeight > a4HeightRef) {
              let i = position + a4HeightRef;
              for (i = position + a4HeightRef; i >= position; i--) {
                let isWrite = true;
                for (let j = 0; j < canvas.width; j++) {
                  const c = canvas.getContext('2d').getImageData(j, i, 1, 1).data;

                  if (c[0] != 0xff || c[1] != 0xff || c[2] != 0xff) {
                    isWrite = false;
                    break;
                  }
                }
                if (isWrite) {
                  checkCount++;
                  if (checkCount >= 10) {
                    break;
                  }
                } else {
                  checkCount = 0;
                }
              }
              height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef);
              if (height <= 0) {
                height = a4HeightRef;
              }
            } else {
              height = leftHeight;
            }

            canvas1.width = canvas.width;
            canvas1.height = height;

            const ctx = canvas1.getContext('2d');
            ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width, height);
            // const pageHeight = Math.round((a4Width / canvas.width) * height);
            // pdf.setPageSize(null, pageHeight)
            if (position != 0) {
              pdf.addPage();
            }
            if (index === 2) {
              pdf.addImage(
                canvas1.toDataURL('image/jpeg', 1.0),
                'JPEG',
                0,
                0,
                a4Width,
                (a4Width / canvas1.width) * height,
              );
            } else {
              pdf.addImage(
                canvas1.toDataURL('image/jpeg', 1.0),
                'JPEG',
                0,
                5,
                a4Width,
                (a4Width / canvas1.width) * height,
              );
            }
            leftHeight -= height;
            position += height;
            if (leftHeight > 0) {
              setTimeout(createImpl, 500, canvas);
            } else {
              const pdfFile = pdf.output('datauristring');
              //这里是base64，想知道有没有生成pdf，可以打印这里
              // console.log(pdfFile);
              const fileName =
                '开票通知' + props.dataInfo.contractNo + '_' + datasorce[k][0].name + '.pdf';
              const myfile = dataURLtoFile(pdfFile, fileName);
              // console.log('myfile', myfile);
              const formdata = new FormData();
              formdata.append('file', myfile); //这里是PDF文件
              // formdata.append('id', props.id); //随便写的参数
              const res = await upload(formdata);
              if (res?.code == 200) {
                // message.success('发送成功');
                const url = res?.result || '';
                const url1 = loadimg(url);

                const sendurl: any = {};
                sendurl.ticketUrl = url1;
                sendurl.batch = datasorce[k][0].batch;
                sendurl.factory = datasorce[k][0].name;
                senddata.push(sendurl);
                openNotification(senddata.length, Object.keys(datasorce).length);
                if (senddata.length === Object.keys(datasorce).length) {
                  const resxx = await pjBillingcheckBatch(senddata);
                  if (resxx.code == 200) {
                    setLoading(false);
                    notification.close('openNotification');
                  }
                }
              }
            }
          }
        }
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < a4HeightRef) {
          pdf.addImage(pageData, 'JPEG', 0, 0, a4Width, (a4Width / canvas.width) * leftHeight);
          const pdfFile = pdf.output('datauristring');
          //这里是base64，想知道有没有生成pdf，可以打印这里
          const fileName =
            '开票通知' + props.dataInfo.contractNo + '_' + datasorce[k][0].name + '.pdf';
          const myfile = dataURLtoFile(pdfFile, fileName);
          const formdata = new FormData();
          formdata.append('file', myfile); //这里是PDF文件
          // formdata.append('id', props.id); //随便写的参数
          const res = await upload(formdata);
          if (res?.code == 200) {
            // message.success('发送成功');
            const url = res?.result || '';
            const url1 = loadimg(url);

            const sendurl: any = {};
            sendurl.ticketUrl = url1;
            sendurl.batch = datasorce[k][0].batch;
            sendurl.factory = datasorce[k][0].name;
            senddata.push(sendurl);
            openNotification(senddata.length, Object.keys(datasorce).length);
            if (senddata.length === Object.keys(datasorce).length) {
              const resxx = await pjBillingcheckBatch(senddata);
              if (resxx.code == 200) {
                setLoading(false);
                notification.close('openNotification');
              }
            }
          }
        } else {
          try {
            pdf.deletePage(0);
            setTimeout(createImpl, 500, canvas);
          } catch (err) {
            // console.log(err);
          }
        }
      });
      // });
    }
  };
  const columns: ProColumns[] = [
    {
      dataIndex: 'goodName',
      // title: '品名',
      title: () => {
        return <div style={{ margin: '-8px -6px -8px -6px' }}>开票名称</div>;
      },
      render: (h: any, row: any) => {
        return {
          children: row.goodName || '',
          props: {
            style:
              row.index === 0
                ? { borderTop: '1px solid rgba(0, 0, 0, 1)', padding: 0 }
                : { padding: 0 },
          },
        };
      },
    },
    {
      dataIndex: 'category',
      // title: '开票品类',
      title: () => {
        return <div style={{ margin: '-8px -6px -8px -6px' }}>开票品类</div>;
      },
      render: (h: any, row: any) => {
        return {
          children: row.category || '',
          props: {
            style:
              row.index === 0
                ? { borderTop: '1px solid rgba(0, 0, 0, 1)', padding: 0 }
                : { padding: 0 },
          },
        };
      },
    },
    {
      dataIndex: 'num',
      // title: '数量',
      title: () => {
        return <div style={{ margin: '-8px -6px -8px -6px' }}>数量</div>;
      },
      render: (h: any, row: any) => {
        return {
          children: row.num || '',
          props: {
            style:
              row.index === 0
                ? { borderTop: '1px solid rgba(0, 0, 0, 1)', padding: 0 }
                : { padding: 0 },
          },
        };
      },
    },
    {
      dataIndex: 'unit',
      // title: '单位',
      title: () => {
        return <div style={{ margin: '-8px -6px -8px -6px' }}>单位</div>;
      },
      render: (h: any, row: any) => {
        return {
          children: row.unit || '',
          props: {
            style:
              row.index === 0
                ? { borderTop: '1px solid rgba(0, 0, 0, 1)', padding: 0 }
                : { padding: 0 },
          },
        };
      },
    },
    {
      dataIndex: 'money',
      // title: '金额',
      title: () => {
        return <div style={{ margin: '-8px -6px -8px -6px' }}>金额</div>;
      },
      render: (h: any, row: any) => {
        return {
          children: row.money || '',
          props: {
            style:
              row.index === 0
                ? { borderTop: '1px solid rgba(0, 0, 0, 1)', padding: 0 }
                : { padding: 0 },
          },
        };
      },
    },
  ];
  const _noPageGkList = async () => {
    const noPageGdata: any = {
      orderId: props.dataInfo.id,
    };
    const res = await getBillAll(noPageGdata);
    // const res = [
    //   [
    //     {
    //       goodName: '电动压痕机1',
    //       num: '10',
    //       unit: 'ge',
    //       money: '10000',
    //     },
    //     {
    //       goodName: '电动压痕机2',
    //       num: '10',
    //       unit: 'ge',
    //       money: '10000',
    //     },
    //   ],
    //   [
    //     {
    //       goodName: '电动压痕机3',
    //       num: '10',
    //       unit: 'ge',
    //       money: '10000',
    //     },
    //     {
    //       goodName: '电动压痕机4',
    //       num: '10',
    //       unit: 'ge',
    //       money: '10000',
    //     },
    //   ],
    // ];
    setdatasorce(res.result.good);
    const kk: any = Object.values(res.result.good)[0];
    (kk || []).map((item: any, index: any) => {
      item.index = index;
    });
    setdatasorces(kk);
  };
  //获取文件url
  //   const _pjBillinginfo = async () => {
  //     const noPageGdata: any = {
  //       id: props.record.kid,
  //     };
  //     const res = await pjBillinginfo(noPageGdata);
  //     const url = loadimg(res.result.ticketUrl);
  //     setPdf(url);
  //   };

  React.useEffect(() => {
    _noPageGkList();
    // _pjBillinginfo();
  }, []);
  return (
    <div>
      <Spin spinning={loading}>
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
                <Row justify={'end'} style={{ marginTop: 20 }}>
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
                      type="primary"
                      htmlType="submit"
                      style={{
                        display: props?.dataInfo.state === 3 ? 'none' : '',
                      }}
                      onClick={() => {
                        headerColums.map((item: any) => {
                          item.editable = () => true;
                          if (item.dataIndex == 'text') {
                            item.editable = false;
                          }
                        });
                        setEditValue(true);
                        setHeaderColums([...headerColums]);
                      }}
                    >
                      编辑
                    </Button>
                  </Col>
                  <Col style={{ marginRight: '8px' }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        display: props?.dataInfo.state === 3 ? 'none' : '',
                      }}
                      onClick={() => {
                        headerColums.map((item: any) => {
                          item.editable = false;
                        });
                        setEditValue(false);
                        setLoading(true);
                        setHeaderColums([...headerColums]);
                        setTimeout(() => {
                          download();
                        }, 50);
                      }}
                    >
                      生成通知
                    </Button>
                  </Col>
                </Row>
              );
            },
          }}
          params={{}}
        >
          {/* {datasorce.map((item: any, index: number) => ( */}
          <div id="billNoticePdf">
            <ProCard>
              <div style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>开票通知</div>
              <ProDescriptions
                actionRef={actionRef}
                size="small"
                column={1}
                labelStyle={{ justifyContent: 'flex-end', alignItems: 'center' }}
                style={{ marginTop: 30 }}
                editable={{
                  onSave: function (e, value) {
                    console.log(value);
                  },
                }}
                request={async () => {
                  // console.log(props);
                  const dd: any = {
                    orderId: props.dataInfo.id,
                  };
                  const res = await getClientData({ ...dd });
                  const aa = res.result;
                  const ClientData: any = {};
                  ClientData.billName = aa.billName;
                  ClientData.billAddress = aa.billAddress;
                  ClientData.billBank = aa.billBank;
                  ClientData.billAccount = aa.billAccount;
                  ClientData.billIdentity = aa.billIdentity;
                  ClientData.customsCode = aa.customsCode;
                  ClientData.billCall = aa.billCall;
                  ClientData.billMailing = aa.billMailing;
                  ClientData.contractNo = props.dataInfo.contractNo;
                  ClientData.billRecipientName = aa.billRecipientName + aa.billPhone;
                  setTwoContent(ClientData.billMailing);
                  setThreeContent(ClientData.billRecipientName);
                  return Promise.resolve({
                    success: true,
                    data: ClientData,
                  });
                }}
                // dataSource={ClientData}
                columns={headerColums}
              />
              <ProTable
                columns={columns}
                rowKey="id"
                pagination={false}
                defaultSize="small"
                bordered
                style={{ border: '1px solid rgba(0, 0, 0, 1)' }}
                // pagination={{
                //   showQuickJumper: true,
                //   pageSize: 1000,
                //   size: 'default',
                //   simple: false,
                //   showSizeChanger: true,
                //   // pageSizeOptions: [10, 20, 100, 200, 1000, 2000],
                // }}
                dataSource={datasorces}
                toolBarRender={false}
                search={false}
                // style={{ marginTop: 10 }}
              />
              <div style={{ fontWeight: 'bold' }}>
                备注：请严格按上述开票资料开具增值税专用发票,并连同采购合同（盖章）寄以往下地址：
              </div>
              <Paragraph
                style={{ marginTop: 10 }}
                editable={{
                  onChange: setTwoContent,
                  icon: editValue ? null : <div />,
                }}
              >
                {twoContent}
              </Paragraph>
              <div style={{ fontWeight: 'bold' }}>收件人：</div>
              <Paragraph
                style={{ marginTop: 10 }}
                editable={{
                  onChange: setThreeContent,
                  icon: editValue ? null : <div />,
                }}
              >
                {threeContent}
              </Paragraph>
            </ProCard>
          </div>
          {/* ))} */}
        </ProForm>
      </Spin>
    </div>
  );
});

export default PdfDow;
