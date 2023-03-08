/* eslint-disable @typescript-eslint/no-use-before-define */
import { BaseList } from '@/components/base';
import { pjScanLog } from '@/services/ant-design-pro/record';
import loadimg from '@/utils/image';
import type { ActionType } from '@ant-design/pro-table';
import moment from 'moment';
import React, { useRef } from 'react';

const Page: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [table] = React.useState<any>({
    mname: 'pjScanLog',
    key: 'id',
  });
  const [datas] = React.useState<any[]>([]);
  const [activeKey, setActiveKey] = React.useState<any[]>();
  const [actions] = React.useState<any[]>([
    {
      type: 'menu',
      defaultSelectedKeys: '1',
      activeKey: activeKey,
      auth: '/ticket/log/scan',
      items: [
        {
          key: '1',
          label: <span>报关单</span>,
        },
        {
          key: '2',
          label: <span>出口发票</span>,
        },
        {
          key: '3',
          label: <span>进项发票</span>,
        },
      ],
      onClick: (key: any) => {
        setActiveKey(key.key);
        actionRef.current?.reloadAndRest?.();
      },
    },
  ]);
  const [footerActions] = React.useState<any[]>([
    // { label: '批量设置时间', icon: 'PlusOutlined', type: 'button', buttonType: 'primary' },
    // { label: '批量删除', icon: 'DeleteOutlined', type: 'button', danger: true },
    // { label: '批量导出', icon: 'ToTopOutlined', type: 'button', buttonType: 'primary' },
  ]);
  const [filters] = React.useState<any[]>([
    { title: '合同协议号', name: 'contractNo', type: 'input' },
    { title: '识别时间', name: 'createTime', type: 'dateRange' },
  ]);
  const [columns] = React.useState<any[]>([
    {
      title: '序号',
      key: 'index',
      width: 80,
      type: 'indexBorder',
      render(text: any, record: any, index: any) {
        return (
          <span style={{ fontSize: 14 }}>{index + (record.current - 1) * record.pageSize + 1}</span>
        );
      },
    },
    // { title: '租户ID', key: 'tenantId' },
    { title: '合同协议号', key: 'contractNo' },
    // { title: '用户名称', key: 'createBy' },
    // { title: '租户名称', key: 'imgUrl', align: 'center', type: 'image' },
    {
      title: '识别状态',
      key: 'state',
      render: (h: any, row: any) => {
        const text = row?.state == 1 ? '成功' : row?.state == 2 ? '失败' : '未知';
        return <span style={{ fontSize: 14 }}>{text}</span>;
      },
    },
    { title: '识别日期', align: 'center', key: 'scanTime' },
    { title: '详细描述', key: 'remark' },
  ]);

  React.useEffect(() => {
    console.log('query', props?.location?.query);
  }, [props?.location?.query]);

  const request = async (params: any, sort: any, filter: any) => {
    console.log('Page request:', params, sort, filter);
    if (Number(activeKey)) {
      params.scanType = Number(activeKey);
    } else {
      params.scanType = 1;
    }
    if (params.createTime) {
      params.scanBeginTime = moment(params.createTime[0]).format('YYYY-MM-DD');
      params.scanEndTime = moment(params.createTime[1]).format('YYYY-MM-DD');
      delete params.createTime;
    }
    const result: any = await pjScanLog(params);
    const columnsArr: any[] = result.result.records;
    if (result.result.records) {
      result.result.records.forEach((item: any) => {
        item.imgUrl = loadimg(item.imgUrl);
        item.current = result.result.current;
        item.pageSize = result.result.size;
      });
    }
    return {
      data: columnsArr,
      // success 请返回 true，
      // 不然 table 会停止解析数据，即使有数据
      success: result?.success,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: result.result.total,
    };
  };

  return (
    <BaseList
      request={request}
      table={table}
      filters={filters}
      actions={actions}
      footerActions={footerActions}
      columns={columns}
      datas={datas}
      actionRef={actionRef}
    />
  );
};

export default Page;
