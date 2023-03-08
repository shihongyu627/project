import {
  getClientData,
  //   noPageGkList,
  upload,
  // pjBillingedit,
  //   pjBillinginfo,
  pjBillingcheckFactory,
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
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import loadimg from '@/utils/image';
import { LoadingOutlined } from '@ant-design/icons';
import { pjModelData } from '@/services/ant-design-pro/contract';
const { Paragraph } = Typography;
export type Props = {
  // headerData: any[]; // 状态
  dataInfo: any;
  mode: any;
  action: any;
  submitTarget: any;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PdfDow: React.FC<Props> = React.forwardRef((props, ref) => {
  const actionRef = useRef();
  const [loading, setLoading] = useState(false);
  const [datasorce, setdatasorce] = useState({});
  const [datasorces, setdatasorces] = useState([]);
  //   const [Topdata, setTopdata] = useState({});
  const [name, setdataname] = useState('');
  const [kname, setdatakname] = useState('');
  const [title, settitle] = useState('采购合同');
  const [editValue, setEditValue] = useState(false);
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  const [toolbarShow, setsetToolbarShow] = useState(false);
  const [html, setHtml] = useState(''); // 编辑器内容
  const openNotification = (v1: any, v2: any) => {
    notification.open({
      icon: <LoadingOutlined style={{ color: 'green' }} />,
      message: '采购合同生成中',
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
      title: '供方',
      key: 'text',
      dataIndex: 'kname',
      editable: false,
    },
    {
      title: '需方',
      key: 'text',
      dataIndex: 'name',
      editable: false,
    },
  ]);
  const [headerColums2, setHeaderColums2] = useState<any>([
    // {
    //   title: '供方',
    //   key: 'text',
    //   dataIndex: 'kname',
    //   editable: false,
    // },
    {
      title: '合同编号',
      key: 'text',
      dataIndex: 'contractNo',
      editable: false,
    },
    // {
    //   title: '需方',
    //   key: 'text',
    //   dataIndex: 'name',
    //   editable: false,
    // },
    {
      title: '签约地点',
      key: 'text',
      dataIndex: 'address',
      editable: false,
    },
    // {
    //   title: '',
    //   key: 'text',
    //   dataIndex: 'text',
    //   editable: false,
    // },
    {
      title: '签约时间',
      key: 'date',
      dataIndex: 'exportTime',
      valueType: 'date',
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
  const download = async () => {
    const senddata: any = [];
    for (const k in datasorce) {
      const total: any = [];
      const kk: any = datasorce[k];
      const kktow: any = [...kk];
      kk.map((item: any) => {
        const aa = parseFloat(item.money);
        total.push(aa);
      });
      if (total.length > 0) {
        const totals: any = {};
        totals.goodName = '合计(人民币)';
        totals.money = total.reduce(
          (a: any, b: any) => (parseFloat(a) + parseFloat(b)).toFixed(2),
          0,
        );
        kktow.push(totals);
      }
      if (datasorce[k][0].factoryModelId) {
        const result: any = await pjModelData(datasorce[k][0].factoryModelId);
        setHtml(result.result.context);
      }
      setdatakname(kktow[0].name);
      setdatasorces(kktow);
      //   setdatasorces(datasorce[k]);
      //setIsLoading(true);
      const element: any = document.getElementById('contractPdf'); // 这个dom元素是要导出pdf的div容器
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
                '采购合同' + props.dataInfo.contractNo + '_' + datasorce[k][0].name + '.pdf';
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
                sendurl.contractUrl = url1;
                sendurl.orderId = props.dataInfo.id;
                sendurl.factory = datasorce[k][0].name;
                senddata.push(sendurl);
                openNotification(senddata.length, Object.keys(datasorce).length);
                if (senddata.length === Object.keys(datasorce).length) {
                  const resxx = await pjBillingcheckFactory(senddata);
                  if (resxx.code == 200) {
                    setLoading(false);
                    notification.close('openNotification');
                  }
                }
              }
              //   _sendMailFn(myfile);
            }
          }
        }
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < a4HeightRef) {
          pdf.addImage(pageData, 'JPEG', 0, 0, a4Width, (a4Width / canvas.width) * leftHeight);
          const pdfFile = pdf.output('datauristring');
          //这里是base64，想知道有没有生成pdf，可以打印这里
          const fileName =
            '采购合同' + props.dataInfo.contractNo + '_' + datasorce[k][0].name + '.pdf';
          const myfile = dataURLtoFile(pdfFile, fileName);
          // console.log('myfile', myfile);
          //   _sendMailFn(myfile);
          const formdata = new FormData();
          formdata.append('file', myfile); //这里是PDF文件
          // formdata.append('id', props.id); //随便写的参数
          const res = await upload(formdata);
          if (res?.code == 200) {
            // message.success('发送成功');
            const url = res?.result || '';
            const url1 = loadimg(url);
            const sendurl: any = {};
            sendurl.contractUrl = url1;
            sendurl.orderId = props.dataInfo.id;
            sendurl.factory = datasorce[k][0].name;
            senddata.push(sendurl);
            openNotification(senddata.length, Object.keys(datasorce).length);
            if (senddata.length === Object.keys(datasorce).length) {
              const resxx = await pjBillingcheckFactory(senddata);
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
    }
  };
  const columns: ProColumns[] = [
    {
      dataIndex: 'goodName',
      // title: '产品名称',
      title: () => {
        return <div style={{ margin: '-8px -6px -8px -6px' }}>产品名称</div>;
      },
      // {<div>产品名称</div>},
      render: (h: any, row: any) => {
        return {
          children: row.goodName || '',
          props: {
            style:
              row.index === 0 || row.goodName === '合计(人民币)'
                ? { borderTop: '1px solid rgba(0, 0, 0, 1)', padding: 0 }
                : { padding: 0 },
          },
        };
      },
    },
    {
      dataIndex: 'email',
      title: () => {
        return <div style={{ margin: '-8px -6px -8px -6px' }}>规格</div>;
      },
      // title: '规格',
      render: (h: any, row: any) => {
        return {
          children: row.email || '',
          props: {
            style:
              row.index === 0 || row.goodName === '合计(人民币)'
                ? { borderTop: '1px solid rgba(0, 0, 0, 1)', padding: 0 }
                : { padding: 0 },
          },
        };
      },
    },
    {
      dataIndex: 'num',
      title: () => {
        return <div style={{ margin: '-8px -6px -8px -6px' }}>数量</div>;
      },
      // title: '数量',
      render: (h: any, row: any) => {
        return {
          children: row.num || '',
          props: {
            style:
              row.index === 0 || row.goodName === '合计(人民币)'
                ? { borderTop: '1px solid rgba(0, 0, 0, 1)', padding: 0 }
                : { padding: 0 },
          },
        };
      },
    },
    {
      dataIndex: 'unit',
      title: () => {
        return <div style={{ margin: '-8px -6px -8px -6px' }}>单位</div>;
      },
      // title: '单位',
      render: (h: any, row: any) => {
        return {
          children: row.unit || '',
          props: {
            style:
              row.index === 0 || row.goodName === '合计(人民币)'
                ? { borderTop: '1px solid rgba(0, 0, 0, 1)', padding: 0 }
                : { padding: 0 },
          },
        };
      },
    },
    {
      dataIndex: 'money',
      title: () => {
        return <div style={{ margin: '-8px -6px -8px -6px' }}>总金额</div>;
      },
      // title: '总金额',
      render: (h: any, row: any) => {
        return {
          children: row.money || '',
          props: {
            style:
              row.index === 0 || row.goodName === '合计(人民币)'
                ? { borderTop: '1px solid rgba(0, 0, 0, 1)', padding: 0 }
                : { padding: 0 },
          },
        };
      },
    },
    {
      dataIndex: 'remark',
      title: () => {
        return <div style={{ margin: '-8px -6px -8px -6px' }}>备注</div>;
      },
      // title: '备注',
      render: (h: any, row: any) => {
        return {
          children: row.remark || '',
          props: {
            style:
              row.index === 0 || row.goodName === '合计(人民币)'
                ? { borderTop: '1px solid rgba(0, 0, 0, 1)', padding: 0 }
                : { padding: 0 },
          },
        };
      },
    },
  ];
  // console.log(props);
  // const datasorce = [];
  // datasorce.push(props.record);

  // datasorce.push(total);
  const _noPageGkList = async () => {
    // const noPageGdata: any = {
    //   batch: props.record.kbatch,
    //   factory: props.record.kname,
    // };
    // const res = await noPageGkList(noPageGdata);
    const total: any = [];
    const noPageGdata: any = {
      orderId: props.dataInfo.id,
    };
    const res = await getBillAll(noPageGdata);
    setdatasorce(res.result.factory);
    const kk: any = Object.values(res.result.factory)[0];
    const kktow: any = [...kk];
    (kk || []).map((item: any, index: any) => {
      item.index = index;
      const aa = parseFloat(item.money);
      total.push(aa);
    });
    // console.log('reduce:' + total.reduce((a: any, b: any) => a + b));
    if (total.length > 0) {
      const totals: any = {};
      totals.goodName = '合计(人民币)';
      totals.money = total.reduce(
        (a: any, b: any) => (parseFloat(a) + parseFloat(b)).toFixed(2),
        0,
      );
      kktow.push(totals);
    }
    if (kktow) {
      setdatakname(kktow[0].name || '');
    }
    setdatasorces(kktow);
    const dd: any = {
      orderId: props.dataInfo.id,
    };
    const resClientData = await getClientData({ ...dd });
    const aa = resClientData.result;
    const ClientData: any = {};
    ClientData.name = aa.name;
    ClientData.kname = kname;
    setdataname(ClientData.name);
    // setTopdata(ClientData);
    // setdatasorce(res.result);
    // datasorce.push(res.result);
  };

  // 模拟 ajax 请求，异步设置 html
  React.useEffect(() => {
    setTimeout(() => {
      setHtml('');
    }, 1500);
  }, []);

  const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: [
      // 菜单 key
      'headerSelect',
      // 分割线
      // '|',
      // 菜单 key
      'bold',
      'italic',
      'fontSize',
      'color',
      'lineHeight',
      // 菜单组，包含多个菜单
      // {
      //   key: 'group-more-style', // 必填，要以 group 开头
      //   title: '更多样式', // 必填
      //   iconSvg: '<svg>....</svg>', // 可选
      //   menuKeys: ['through', 'code', 'clearStyle'], // 下级菜单 key ，必填
      // },
      // 继续配置其他菜单...
    ],
  };
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    readOnly: true,
  };

  // 及时销毁 editor ，重要！
  React.useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);
  //   const _pjBillinginfo = async () => {
  //     const noPageGdata: any = {
  //       id: props.record.kid,
  //     };
  //     const res = await pjBillinginfo(noPageGdata);
  //     const url = loadimg(res.result.url);
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
                        headerColums2.map((item: any) => {
                          item.editable = () => true;
                          if (item.dataIndex == 'text') {
                            item.editable = false;
                          }
                        });
                        setEditValue(true);
                        setsetToolbarShow(true);
                        if (editor == null) return;
                        editor.enable();
                        setHeaderColums([...headerColums]);
                        setHeaderColums2([...headerColums2]);
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
                        headerColums2.map((item: any) => {
                          item.editable = false;
                        });
                        setEditValue(false);
                        setsetToolbarShow(false);
                        if (editor == null) return;
                        editor.disable();
                        setLoading(true);
                        setHeaderColums([...headerColums]);
                        setHeaderColums2([...headerColums2]);
                        setTimeout(() => {
                          download();
                        }, 50);
                      }}
                    >
                      生成合同
                    </Button>
                  </Col>
                </Row>
              );
            },
          }}
          params={{}}
        >
          <div id="contractPdf">
            <ProCard>
              <div style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                <Paragraph
                  style={{ margin: '0, 0, 0, -10px' }}
                  editable={{
                    onChange: settitle,
                    icon: editValue ? null : <div />,
                  }}
                >
                  {title}
                </Paragraph>
              </div>
              <div>
                <ProCard bodyStyle={{ padding: '0 0 0 0' }}>
                  <ProCard colSpan="50%" bodyStyle={{ padding: '0 0 0 0', marginLeft: 10 }}>
                    <ProDescriptions
                      actionRef={actionRef}
                      size="small"
                      // bordered
                      column={1}
                      labelStyle={{ justifyContent: 'flex-end', alignItems: 'center' }}
                      style={{ marginTop: 10 }}
                      editable={{
                        onSave: function (e, value) {
                          console.log(value);
                        },
                      }}
                      dataSource={{
                        name: name,
                        kname: kname,
                      }}
                      //   request={async () => {
                      //     return {
                      //       success: true,
                      //       data: Topdata,
                      //     };
                      //   }}
                      columns={headerColums}
                    />
                  </ProCard>
                  <ProCard bodyStyle={{ padding: '0 0 0 0' }}>
                    <ProDescriptions
                      actionRef={actionRef}
                      size="small"
                      // bordered
                      column={1}
                      labelStyle={{ justifyContent: 'flex-end', alignItems: 'center' }}
                      style={{ marginTop: 10, marginLeft: 250 }}
                      editable={{
                        onSave: function (e, value) {
                          console.log(value);
                        },
                      }}
                      request={async () => {
                        const ClientData: any = {};
                        ClientData.contractNo = props.dataInfo.contractNo;
                        const arr = props.dataInfo.exportTime.split('-');
                        const year = arr[0]; //获取当前日期的年份
                        const month = arr[1]; //获取当前日期的月份
                        const day = arr[2]; //获取当前日期的日
                        // let days = new Date(year, month, 0);
                        // days = days.getDate(); //获取当前日期中月的天数
                        let year2 = year;
                        let month2 = parseInt(month) - 1;
                        if (month2 == 0) {
                          year2 = parseInt(year2) - 1;
                          month2 = 12;
                        }
                        let day2 = day;
                        const days2 = new Date(year2, month2, 0);
                        const daysnow = days2.getDate(); //获取前一个月的天数
                        if (day2 > daysnow) {
                          day2 = daysnow;
                        }
                        let t2 = '';
                        if (month2 < 10) {
                          t2 = year2 + '-' + '0' + month2 + '-' + day2;
                        } else {
                          t2 = year2 + '-' + month2 + '-' + day2;
                        }
                        ClientData.exportTime = t2;
                        ClientData.address = '浙江杭州';
                        return Promise.resolve({
                          success: true,
                          data: ClientData,
                        });
                      }}
                      columns={headerColums2}
                    />
                  </ProCard>
                </ProCard>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 'bold', marginLeft: 10 }}>
                  一、 产品名称、型号、规格、数量、单价、金额：
                </div>
                {/* <div>(货币单位：人名币：元)</div> */}
              </div>
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
                // style={{ marginTop: 8 }}
              />
              <div style={{ border: '0px solid #ccc', zIndex: 100 }}>
                <Toolbar
                  editor={editor}
                  defaultConfig={toolbarConfig}
                  mode="default"
                  style={{
                    borderBottom: '1px solid #ccc',
                    display: toolbarShow === true ? '' : 'none',
                  }}
                />
                <Editor
                  defaultConfig={editorConfig}
                  value={html}
                  onCreated={setEditor}
                  // onChange={(editor) => setHtml(editor.getHtml())}
                  mode="simple"
                  style={{
                    height: '100%',
                    border: 'none',
                    'overflow-y': 'hidden',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 10 }}>
                <div style={{ display: 'flex' }}>
                  <div>供方：</div>
                  <Paragraph
                    editable={{
                      onChange: setdatakname,
                      icon: editValue ? null : <div />,
                    }}
                  >
                    {kname}
                  </Paragraph>
                </div>
                <div style={{ display: 'flex', width: 300 }}>
                  <div>需方：</div>
                  <Paragraph
                    style={{ margin: '0, 0, 0, -10px' }}
                    editable={{
                      onChange: setdataname,
                      icon: editValue ? null : <div />,
                    }}
                  >
                    {name}
                  </Paragraph>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 10 }}>
                <div>单位名称(章)：</div>
                <div style={{ width: 300 }}>单位名称(章)：</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 10 }}>
                <div>单位地址：</div>
                <div style={{ width: 300 }}>单位地址：</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 10 }}>
                <div>法定代表人：</div>
                <div style={{ width: 300 }}>法定代表人：</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 10 }}>
                <div>委托代表人：</div>
                <div style={{ width: 300 }}>委托代表人：</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 10 }}>
                <div>电话：</div>
                <div style={{ width: 300 }}>电话：</div>
              </div>
            </ProCard>
          </div>
        </ProForm>
      </Spin>
    </div>
  );
});

export default PdfDow;
