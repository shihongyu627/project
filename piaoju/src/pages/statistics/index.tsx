import { noPageClient, noPageClientList } from '@/services/ant-design-pro/customer';
import { sysDepart } from '@/services/ant-design-pro/department';
import { pjOrderstatistics } from '@/services/ant-design-pro/order';
import { pjComboNoPageList } from '@/services/ant-design-pro/setmeal';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import {
  BackTop,
  Button,
  Col,
  DatePicker,
  Descriptions,
  Radio,
  Row,
  Space,
  Tooltip,
  //  Button,
  TreeSelect,
} from 'antd';
import React, { useState } from 'react';
import BarChart from './barChart'; //柱状图
import HeaderCard from './headerCard'; //头部数据
import LineChart from './lineChart'; //折线图
import Ranking from './ranking'; //排行榜
import Select from './select';

export type TableListItem = {
  key: number;
  name: string;
  progress: number;
  containers: number;
  callNumber: number;
  creator: string;
  status: string;
  createdAt: number;
  memo: string;
};

const Statistics: React.FC = () => {
  const [dateType, setDateType] = useState('date');
  const [rankType, setRankType] = useState('1');
  const [allData, setAllData] = useState({});
  const [barData, setbarData] = useState([]);
  const [rankData1, setrankData1] = useState([]);
  const [rankData2, setrankData2] = useState([]);
  const [rankData3, setrankData3] = useState([]);
  const [lineData, setlineData] = useState([]);
  const [mealData, setmealData] = useState([]);
  const [serviceData, setallotData] = useState([]);
  const [departmentData, setdepartmentData] = useState([]);
  const [customerData, setClientData] = useState([]);
  const [selectData, setselectData] = useState({});

  const _statistics = async (select: any) => {
    // console.log('dateType', dateType);
    if (dateType === 'date') {
      select.type = 1;
    }
    if (dateType === 'month') {
      select.type = 2;
    }
    if (dateType === 'quarter') {
      select.type = 3;
      const time1 = select.begin.split('-');
      const time2 = select.end.split('-');
      if (time1[1] === 'Q1') {
        select.begin = time1[0] + '-' + '01';
      }
      if (time1[1] === 'Q2') {
        select.begin = time1[0] + '-' + '04';
      }
      if (time1[1] === 'Q3') {
        select.begin = time1[0] + '-' + '07';
      }
      if (time1[1] === 'Q4') {
        select.begin = time1[0] + '-' + '10';
      }
      if (time2[1] === 'Q1') {
        select.end = time2[0] + '-' + '03';
      }
      if (time2[1] === 'Q2') {
        select.end = time2[0] + '-' + '06';
      }
      if (time2[1] === 'Q3') {
        select.end = time2[0] + '-' + '09';
      }
      if (time2[1] === 'Q4') {
        select.end = time2[0] + '-' + '12';
      }
    }
    if (dateType === 'halfyear') {
      select.type = 4;
    }
    if (dateType === 'year') {
      select.type = 5;
    }
    const res = await pjOrderstatistics(select);
    //头部数据
    setAllData(res.result);
    //柱状图数据
    const drawbackTotalMoney = (res.result.drawbackTotalMoney || []).map((item: any) => {
      const drawbackTotalMoneydata: any = {};
      drawbackTotalMoneydata.type = item.type;
      drawbackTotalMoneydata.date = item.time;
      drawbackTotalMoneydata.num = item.money || 0;
      return drawbackTotalMoneydata;
    });
    setbarData(drawbackTotalMoney);
    //报关金额统计数据
    const customsMoney = (res.result.customsMoney || []).map((key: any) => {
      const customsMoneydata: any = {};
      customsMoneydata.name = key.type;
      customsMoneydata.num = key.money || 0;
      customsMoneydata.month = key.time;
      return customsMoneydata;
    });
    setlineData(customsMoney);
    //排行榜数据
    const exportMoney = (res.result.exportMoney || []).map((xx: any) => {
      const exportMoneydata: any = {};
      exportMoneydata.name = xx.type;
      exportMoneydata.num = xx.money || 0;
      return exportMoneydata;
    });
    setrankData1(exportMoney);
    const exportxx = (res.result.export || []).map((key: any) => {
      const exportdata: any = {};
      exportdata.name = key.type;
      exportdata.num = key.money || 0;
      return exportdata;
    });
    setrankData2(exportxx);
    const drawbackMoney = (res.result.drawbackMoney || []).map((key: any) => {
      const drawbackMoneydata: any = {};
      drawbackMoneydata.name = key.type;
      drawbackMoneydata.num = key.money || 0;
      return drawbackMoneydata;
    });
    setrankData3(drawbackMoney);
  };
  //路由校验及获取
  const urlDatas = `${localStorage.getItem('auths')}`;
  const urlData = JSON.parse(urlDatas);
  const check = (url: any) => {
    if (!urlData) {
      return false;
    }
    return urlData.some((item: any) => item.url == url);
  };
  //套餐查询
  const _pjComboNoPageList = async () => {
    const result: any = await pjComboNoPageList();
    const columnsArr: any[] = result.result || [];
    const res: any = [];
    columnsArr.map((item) => {
      const temp = {
        name: item.name,
        id: item.comboType,
      };
      res.push(temp);
    });
    setmealData(res);
  };
  //客服查询
  const _pjUserNoPageList = async (value: any) => {
    const dd: any = {};
    if (value) {
      dd.departId = value;
    }
    const result: any = await noPageClient(dd);
    const columnsArr: any[] = result.result || [];
    const res: any = [];
    columnsArr.map((item) => {
      const temp = {
        name: item.realname,
        id: item.id,
      };
      res.push(temp);
    });
    setallotData(res);
  };
  //部门查询
  const _sysDepartnoPageList = async () => {
    const result: any = await sysDepart('');
    const columnsArr: any[] = result.result || [];
    const res: any = [];
    columnsArr.map((item) => {
      const temp = {
        title: item.departName,
        value: item.id,
        children: item.children,
      };
      res.push(temp);
    });
    setdepartmentData(res);
  };
  //客户查询
  const _ClientNoPageList = async (value: any, allot: any) => {
    const dd: any = {};
    if (value) {
      dd.departId = value;
    }
    if (allot) {
      dd.allot = allot;
    }
    const result: any = await noPageClientList(dd);
    const columnsArr: any[] = result.result;
    const res: any = [];
    columnsArr.map((item) => {
      const temp = {
        name: item.name,
        id: item.id,
      };
      res.push(temp);
    });
    setClientData(res);
  };
  React.useEffect(() => {
    const select = {};
    _statistics(select);
    _pjComboNoPageList();
    _pjUserNoPageList('');
    _sysDepartnoPageList();
    _ClientNoPageList('', '');
    if (
      check('/ticket/statistics/exportMoney') === false &&
      check('/ticket/statistics/export') === true
    ) {
      setRankType('2');
    }
    if (
      check('/ticket/statistics/exportMoney') === false &&
      check('/ticket/statistics/export') === false &&
      check('/ticket/statistics/drawbackMoney') === true
    ) {
      setRankType('3');
    }
  }, []);
  //部门选择数据
  // const departmentData = [
  //   {
  //     id: 1,
  //     name: '全部',
  //   },
  //   {
  //     id: 2,
  //     name: '采购部',
  //   },
  //   {
  //     id: 3,
  //     name: '财务部',
  //   },
  // ];
  // //客服选择数据
  // const serviceData = [
  //   {
  //     id: 1,
  //     name: '全部',
  //   },
  //   {
  //     id: 2,
  //     name: '小李',
  //   },
  //   {
  //     id: 3,
  //     name: '小王',
  //   },
  // ];
  //客户选择数据
  // const customerData = [
  //   {
  //     id: 1,
  //     name: '全部',
  //   },
  //   {
  //     id: 2,
  //     name: '李四',
  //   },
  //   {
  //     id: 3,
  //     name: '王五',
  //   },
  // ];
  //套餐选择数据
  // const mealData = [
  //   {
  //     id: 1,
  //     name: '全部',
  //   },
  //   {
  //     id: 2,
  //     name: '李四',
  //   },
  //   {
  //     id: 3,
  //     name: '王五',
  //   },
  // ];
  //日期选择数据
  const dateData = [
    {
      id: 'date',
      name: '日期',
    },
    {
      id: 'month',
      name: '月度',
    },
    {
      id: 'quarter',
      name: '季度',
    },
    {
      id: 'halfyear',
      name: '半年',
    },
    {
      id: 'year',
      name: '全年',
    },
  ];
  //头部数据
  const headerData = {
    customsMoneyNum: allData?.customsMoneyNum || 0,
    orderNo: allData?.orderNo || 0,
    taxMoney: allData?.taxMoney || 0,
    serviceMoney: allData?.serviceMoney || 0,
    inputInvoiceRate: allData?.inputInvoiceRate || 0,
    drawbackRate: allData?.drawbackRate || 0,
    nextMonthTaxMoney: allData?.nextMonthTaxMoney || 0,
  };
  //柱状图数据
  // const barData = [
  //   {
  //     type: '单量',
  //     date: 'Jan.',
  //     num: 1823.9,
  //   },
  // ];
  //排行榜选择切换数据
  const rankTabbar = [
    {
      id: '1',
      name: '出口金额',
      style: { display: check('/ticket/statistics/exportMoney') === false ? 'none' : '' },
    },
    {
      id: '2',
      name: '出口单量',
      style: { display: check('/ticket/statistics/export') === false ? 'none' : '' },
    },
    {
      id: '3',
      name: '退税金额',
      style: { display: check('/ticket/statistics/drawbackMoney') === false ? 'none' : '' },
    },
  ];
  // 排行榜数据
  // const rankData = [
  //   {
  //     name: '客户1',
  //     num: 122323,
  //     progress: 89,
  //   },
  // ];
  //折线图报关金额统计
  // const lineData = [
  //   {
  //     name: '单量',
  //     month: '1月',
  //     num: 9605,
  //   },
  // ];
  function onDepartChange(value: any) {
    const kk: any = {};
    kk.depart = value;
    const select = { ...selectData, ...kk };
    setselectData(select);
    setTimeout(() => {
      _statistics(select);
      _pjUserNoPageList(value);
      _ClientNoPageList(value, '');
    }, 1000);
    // console.log(`selected ${value}`, '选择部门，返回的数据');
  }
  function onServiceChange(value: any) {
    const kk: any = {};
    kk.allot = value;
    const select = { ...selectData, ...kk };
    setselectData(select);
    setTimeout(() => {
      _statistics(select);
      const allot = value;
      _ClientNoPageList('', allot);
    }, 1000);
    // console.log(`selected ${value}`, '选择客服，返回的数据');
  }
  function onCustomerChange(value: any) {
    const kk: any = {};
    kk.client = value;
    const select = { ...selectData, ...kk };
    setselectData(select);
    setTimeout(() => {
      _statistics(select);
    }, 1000);
    // console.log(`selected ${value}`, '选择客户，返回的数据');
  }
  function onMealChange(value: any) {
    const kk: any = {};
    kk.combo = value;
    const select = { ...selectData, ...kk };
    setselectData(select);
    setTimeout(() => {
      _statistics(select);
    }, 1000);
    // console.log(`selected ${value}`, '选择套餐，返回的数据');
  }
  function onDateChange(value: any, dateString: any) {
    // console.log('Formatted Selected Time: ', dateString, '选择日期');
    const kk: any = {};
    kk.begin = dateString[0];
    kk.end = dateString[1];
    const select = { ...selectData, ...kk };
    setselectData(select);
    setTimeout(() => {
      _statistics(select);
    }, 1000);
  }
  //选择日期类型
  const handleSizeChange = (e: any) => {
    // console.log('xx', e.target);
    setDateType(e.target.value);
  };
  //选择排行类型
  const handleRankChange = (e: any) => {
    // console.log('xx', e.target.value);
    setRankType(e.target.value);
  };
  // const _reset = () => {
  //   const kk: any = {};
  //   kk.depart = '';
  //   kk.allot = '';
  //   kk.client = '';
  //   kk.combo = '';
  //   const select = { ...selectData, ...kk };
  //   setselectData(select);
  //   console.log('selectData', select);
  //   setTimeout(() => {
  //     _statistics(select);
  //     console.log('selectData', selectData);
  //   }, 1000);
  // };
  const { RangePicker } = DatePicker;
  // const columnsArr = `${localStorage.getItem('userInfo')}`;
  // const datas = JSON.parse(columnsArr);
  const rule = `${localStorage.getItem('rule')}`;
  const ruledata = JSON.parse(rule);
  return (
    <PageContainer
      header={{
        onBack: () => window.history.back(),
      }}
    >
      <ProCard gutter={[16, 16]} bordered>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
            <Space align="start" style={{ marginBottom: '10px' }}>
              <TreeSelect
                placeholder={'选择部门'}
                allowClear
                style={{
                  width: '180px',
                  display: check('/ticket/statistics/depart') === false ? 'none' : '',
                }}
                treeData={departmentData}
                multiple={false}
                showSearch={true}
                autoClearSearchValue={true}
                treeNodeFilterProp={'title'}
                treeDefaultExpandAll={true}
                onChange={onDepartChange}
                // selectdata={departmentData}
                // changeSelect={onDepartChange}
              />
              <Select
                placeholder="选择客服"
                style={{ display: check('/ticket/statistics/service') === false ? 'none' : '' }}
                selectdata={serviceData}
                changeSelect={onServiceChange}
              />
              <Select
                placeholder="选择客户"
                style={{
                  display: check('/ticket/statistics/client') === false ? 'none' : '',
                  width: '250px',
                }}
                selectdata={customerData}
                changeSelect={onCustomerChange}
              />
              <Select
                style={{ display: check('/ticket/statistics/combo') === false ? 'none' : '' }}
                placeholder="选择套餐类型"
                selectdata={mealData}
                changeSelect={onMealChange}
              />
            </Space>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
            <Space align="end" style={{ marginBottom: '10px' }}>
              <Radio.Group value={dateType} onChange={handleSizeChange} size={'middle'}>
                {(dateData || []).map((item, index) => {
                  return (
                    <Radio.Button value={item.id} key={index}>
                      {item.name}
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
              <RangePicker
                picker={
                  dateType === 'date'
                    ? 'date'
                    : dateType === 'month'
                    ? 'month'
                    : dateType === 'quarter'
                    ? 'quarter'
                    : dateType === 'halfyear'
                    ? 'month'
                    : dateType === 'year'
                    ? 'year'
                    : ''
                }
                onChange={onDateChange}
                allowClear
              />
              <Button
                type="primary"
                onClick={() => {
                  // _reset();
                  window.location.reload();
                }}
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </ProCard>
      <ProCard
        gutter={[16, 16]}
        bordered
        style={{
          display: check('/ticket/statistics/basis') === false ? 'none' : '',
          // display: datas.state === 1 ? 'none' : '',
        }}
      >
        <HeaderCard headerData={headerData} selectData={selectData} />
      </ProCard>
      <ProCard
        gutter={[16, 16]}
        bordered
        style={{
          display: check('/ticket/statistics/drawbackTotalMoney') === false ? 'none' : '',
        }}
      >
        <ProCard
          title={<span style={{ fontWeight: 'bold' }}>报关金额、退税金额统计</span>}
          colSpan={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }}
          bordered
          headerBordered
          style={{ height: 460 }}
          extra={
            <Space
              style={{
                display:
                  check('/ticket/statistics/nextMonthTaxMoney') === false ||
                  selectData.combo === 'A'
                    ? 'none'
                    : '',
              }}
            >
              <Descriptions.Item label="Product">
                {<span style={{ fontWeight: 'bold' }}>预计下月退税额（元）：</span>}
                <Tooltip title={ruledata.nextMonthTaxMoney}>
                  <QuestionCircleOutlined />
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="Billing">
                {<span style={{ fontWeight: 'bold' }}>¥{headerData.nextMonthTaxMoney}</span>}
              </Descriptions.Item>
            </Space>
            // <StatisticCard
            //   statistic={{
            //     // prefix: '¥',
            //     title: '预计下月退税额（元）' + headerData.nextMonthTaxMoney,
            //     tip: ruledata.nextMonthTaxMoney,
            //     // value: headerData.nextMonthTaxMoney,
            //   }}
            // />
          }
        >
          <BarChart barData={barData} />
        </ProCard>
      </ProCard>
      <ProCard
        gutter={[16, 16]}
        bordered
        style={{
          display: check('/ticket/statistics/customsMoney') === false ? 'none' : '',
        }}
      >
        <ProCard
          title={<span style={{ fontWeight: 'bold' }}>报关单量、退税单量统计</span>}
          bordered
          headerBordered
        >
          <LineChart lineData={lineData} />
        </ProCard>
      </ProCard>
      <ProCard
        gutter={[16, 16]}
        bordered
        style={{
          display: check('/ticket/statistics/client') === false ? 'none' : '',
          // display: datas.state === 1 ? 'none' : '',
        }}
      >
        <ProCard
          title={<span style={{ fontWeight: 'bold', marginLeft: 24 }}>客户排行榜</span>}
          colSpan={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }}
          bordered
          headerBordered
          direction="column"
        >
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Radio.Group style={{ marginLeft: 24 }} value={rankType} onChange={handleRankChange}>
              {(rankTabbar || []).map((item, index) => {
                return (
                  <Radio.Button value={item.id} key={index} style={item.style}>
                    {item.name}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
            <Ranking
              rankType={rankType}
              rankData1={rankData1}
              rankData2={rankData2}
              rankData3={rankData3}
            />
          </Space>
        </ProCard>
      </ProCard>
      <BackTop />
    </PageContainer>
  );
};

export default Statistics;
