import React from 'react';
import { Column } from '@ant-design/plots';
export type Props = {
  barData: any[]; //
};

const BarData: React.FC<Props> = (props) => {
  // console.log('柱状图', props.barData);
  const data = props.barData;
  const config = {
    data,
    isGroup: true,
    xField: 'date',
    yField: 'num',
    seriesField: 'type',
    yAxis: {
      label: {
        // 数值格式化
        formatter: function (v: any) {
          let yData = v;
          if (yData >= 10000 && yData < 100000000) {
            yData = (yData / 10000).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '万';
          } else if (yData >= 100000000) {
            yData = (yData / 100000000).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '亿';
          }
          return yData;
        },
      },
    },
    //图例
    legend: {
      position: 'top',
    },
    /** 设置颜色 */
    color: ['#49a9ee', '#98d87d'],
    // color: ['#1ca9e6', '#f88c24'],
    /** 设置间距 */
    marginRatio: 0.1,
    tooltip: {
      formatter: (originData: any) => {
        console.log(originData);
        if (originData.type === '报关金额') {
          return { name: originData.type, value: originData.num + '＄' };
        }
        if (originData.type === '退税金额') {
          return { name: originData.type, value: originData.num + '￥' };
        }
      },
    },
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      content: (originData: any) => {
        const val = parseFloat(originData.num);
        if (originData.type === '报关金额') {
          return val + '＄';
        }
        if (originData.type === '退税金额') {
          return val + '￥';
        }
      },
      // 'top', 'middle', 'bottom'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: 'interval-adjust-position',
        }, // 数据标签防遮挡
        {
          type: 'interval-hide-overlap',
        }, // 数据标签文颜色自动调整
        {
          type: 'adjust-color',
        },
      ],
    },
  };
  return <Column {...config} />;
};

export default BarData;
