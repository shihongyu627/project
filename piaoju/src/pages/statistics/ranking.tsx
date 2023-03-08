import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React from 'react';
export type Props = {
  // rankData: any[]; //
  rankType: any;
  rankData1: any;
  rankData2: any;
  rankData3: any;
};
type GithubIssueItem = {
  key: number;
  name: string;
  createdAt: number;
  status: string;
};

const BarData: React.FC<Props> = (props: any) => {
  // console.log('排行', props);
  const rankData =
    props.rankType == '1'
      ? props.rankData1
      : props.rankType == '2'
      ? props.rankData2
      : props.rankType == '3'
      ? props.rankData3
      : [];
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '排名',
      width: 60,
      dataIndex: 'index',
      valueType: 'indexBorder',
      align: 'center',
    },
    {
      title: '客户名称',
      width: 140,
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '数值',
      dataIndex: 'num',
      width: 140,
      align: 'center',
    },
    // {
    //   title: '',
    //   key: 'progress',
    //   dataIndex: 'progress',
    //   align: 'center',
    //   valueType: () => ({
    //     type: 'progress',
    //     status: 'active',
    //   }),
    //   fieldProps: {
    //     showInfo: false,
    //   },
    // },
  ];
  return (
    <ProTable<GithubIssueItem>
      columns={columns}
      rowKey="key"
      dateFormatter="string"
      search={false}
      dataSource={rankData}
      pagination={false}
      options={false}
      scroll={{ y: 300 }}
    />
  );
};

export default BarData;
