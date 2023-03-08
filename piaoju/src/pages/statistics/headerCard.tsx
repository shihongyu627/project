import ProCard, { StatisticCard } from '@ant-design/pro-card';
import React from 'react';
// const { Statistic } = StatisticCard;
export type Props = {
  // data: {}; //
  headerData: any;
  selectData: any;
};
// const userInfo = `${localStorage.getItem('userInfo')}`;
// const datasuserInfo = JSON.parse(userInfo);
//路由校验及获取
const urlDatas = `${localStorage.getItem('auths')}`;
const urlData = JSON.parse(urlDatas);
const check = (url: any) => {
  if (!urlData) {
    return false;
  }
  return urlData.some((item: any) => item.url == url);
};
const rule = `${localStorage.getItem('rule')}`;
const ruledata = JSON.parse(rule);
const HeaderCard: React.FC<Props> = (props: any) => {
  // console.log('头部', props);
  return (
    <ProCard gutter={[16, 16]} wrap>
      <ProCard
        colSpan={
          check('/ticket/statistics/customsMoneyNum') === false
            ? 0
            : { xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6 }
        }
        layout="center"
        bordered
      >
        <StatisticCard
          statistic={{
            title: '报关金额（美元）',
            tip: ruledata.customsMoneyNum,
            prefix: '＄',
            value: props.headerData.customsMoneyNum,
            // description: (
            // ),
          }}
          // footer={
          //   <Statistic
          //     valueStyle={{ fontWeight: 'bold' }}
          //     title="周同比"
          //     value="8.04%"
          //     trend="up"
          //   />
          // }
        />
      </ProCard>
      <ProCard
        colSpan={
          check('/ticket/statistics/orderNum') === false
            ? 0
            : { xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6 }
        }
        layout="center"
        bordered
      >
        <StatisticCard
          statistic={{
            title: '订单数量（个）',
            tip: ruledata.orderNo,
            value: props.headerData.orderNo,
            suffix: '',
          }}
          // footer={
          //   <Statistic
          //     valueStyle={{ fontWeight: 'bold' }}
          //     title="周同比"
          //     value="8.04%"
          //     trend="up"
          //   />
          // }
        />
      </ProCard>
      <ProCard
        colSpan={
          check('/ticket/statistics/taxMoney') === false || props.selectData.combo === 'A'
            ? 0
            : { xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6 }
        }
        layout="center"
        bordered
      >
        <StatisticCard
          statistic={{
            prefix: '¥',
            title: '退税总金额（元）',
            tip: ruledata.taxMoney,
            value: props.headerData.taxMoney,
          }}
          // footer={
          //   <Statistic
          //     valueStyle={{ fontWeight: 'bold' }}
          //     title="周同比"
          //     value="8.04%"
          //     trend="up"
          //   />
          // }
        />
      </ProCard>
      {/* <ProCard
        colSpan={
          check('/ticket/statistics/nextMonthTaxMoney') === false || props.selectData.combo === 'A'
            ? // datasuserInfo.state === 0 ||
              // datasuserInfo.state === 2 ||
              // datasuserInfo.state === 3
              0
            : { xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6 }
        }
        layout="center"
        bordered
      >
        <StatisticCard
          statistic={{
            prefix: '¥',
            title: '预计下月退税额（元）',
            tip: ruledata.nextMonthTaxMoney,
            value: props.headerData.nextMonthTaxMoney,
          }}
          // footer={
          //   <Statistic
          //     valueStyle={{ fontWeight: 'bold' }}
          //     title="周同比"
          //     value="8.04%"
          //     trend="up"
          //   />
          // }
        />
      </ProCard> */}
      <ProCard
        colSpan={
          // datasuserInfo.state === 1
          check('/ticket/statistics/serviceMoney') === false
            ? 0
            : { xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6 }
        }
        layout="center"
        bordered
      >
        <StatisticCard
          statistic={{
            prefix: '¥',
            title: '服务费（元）',
            tip: ruledata.serviceMoney,
            value: props.headerData.serviceMoney,
          }}
          // footer={
          //   <Statistic
          //     valueStyle={{ fontWeight: 'bold' }}
          //     title="周同比"
          //     value="8.04%"
          //     trend="up"
          //   />
          // }
        />
      </ProCard>
      <ProCard
        colSpan={
          check('/ticket/statistics/inputInvoiceRate') === false || props.selectData.combo === 'A'
            ? 0
            : { xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6 }
        }
        layout="center"
        bordered
      >
        <StatisticCard
          statistic={{
            title: '进项发票开票率',
            suffix: '%',
            tip: ruledata.inputInvoiceRate,
            value: props.headerData.inputInvoiceRate,
          }}
          // footer={
          //   <Statistic
          //     valueStyle={{ fontWeight: 'bold' }}
          //     title="周同比"
          //     value="8.04%"
          //     trend="up"
          //   />
          // }
        />
      </ProCard>
      <ProCard
        colSpan={
          check('/ticket/statistics/drawbackRate') === false || props.selectData.combo === 'A'
            ? 0
            : { xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6 }
        }
        layout="center"
        bordered
      >
        <StatisticCard
          statistic={{
            title: '退税申报率',
            suffix: '%',
            tip: ruledata.drawbackRate,
            value: props.headerData.drawbackRate,
          }}
          // footer={
          //   <Statistic
          //     valueStyle={{ fontWeight: 'bold' }}
          //     title="周同比"
          //     value="8.04%"
          //     trend="up"
          //   />
          // }
        />
      </ProCard>
    </ProCard>
  );
};

export default HeaderCard;
