import { BaseList } from '@/components/base';
import { PjFirm } from '@/services/ant-design-pro/firm';
import { page } from '@/utils';
import { ActionType } from '@ant-design/pro-table';
import moment from 'moment';
import React, { ReactNode, useRef } from 'react';
// import Page1 from '../trial/adduser';
import Page2 from '../trial/edit';

const Page: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [table] = React.useState<any>({
    mname: 'PjFirm',
    key: 'id',
  });
  const [datas] = React.useState<any[]>([]);
  const [activeKey, setActiveKey] = React.useState<any[]>();
  const [actions] = React.useState<any[]>([
    {
      type: 'menu',
      defaultSelectedKeys: '0',
      activeKey: activeKey,
      auth: '/ticket/firm',
      items: [
        {
          key: '0',
          label: <span>全部</span>,
        },
        {
          key: '1',
          label: <span>待跟进</span>,
        },
        {
          key: '2',
          label: <span>已跟进</span>,
        },
      ],
      onClick: (key: any) => {
        setActiveKey(key.key);
        actionRef.current?.reloadAndRest?.();
      },
    },
  ]);
  const [footerActions] = React.useState<any[]>([]);
  const [filters] = React.useState<any[]>([
    { title: '企业名称', name: 'name', type: 'input' },
    { title: '手机号', name: 'phone', type: 'input' },
    { title: '申请日期', name: 'createTime', type: 'dateRange' },
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
    { title: '企业名称', key: 'name' },
    { title: '主营业务', key: 'business' },
    { title: '联系人', key: 'contac' },
    { title: '联系方式', key: 'phone' },
    { title: '地址', key: 'address' },
    { title: '申请时间', align: 'center', width: 160, key: 'createTime' },
    {
      title: '操作',
      align: 'center',
      type: 'option',
      width: 160,
      showLength: 5,
      handle: (text: ReactNode, record: any): ReactNode[] => [
        {
          type: 'edit',
          text: '编辑',
          mode: 'page',
          auth: '/ticket/firm/edit',
          onClick: () => {
            const targetId = 'abc1';
            page.showModal(
              <Page2 mode={'modal'} action={'edit'} id={record.id} submitTarget={targetId} />,
              {
                title: '编辑',
                footer: <div id={targetId} />,
              },
            );
          },
        },
        // {
        //   type: 'info',
        //   text: '账号',
        //   auth: '/ticket/firm/addUser',
        //   hidden: record.is_found === 1 ? true : false,
        //   onClick: () => {
        //     const targetId = 'abc1';
        //     page.showModal(
        //       <Page1
        //         mode={'modal'}
        //         action={'add'}
        //         name={record.name}
        //         id={record.id}
        //         submitTarget={targetId}
        //       />,
        //       {
        //         title: '账号',
        //         footer: <div id={targetId} />,
        //       },
        //     );
        //   },
        // },
      ],
    },
  ]);

  React.useEffect(() => {
    console.log('query', props?.location?.query);
  }, [props?.location?.query]);
  const request = async (params: any, sort: any, filter: any) => {
    if (params.createTime) {
      params.createBeginTime = moment(params.createTime[0]).format('YYYY-MM-DD');
      params.createEndTime = moment(params.createTime[1]).format('YYYY-MM-DD');
      delete params.createTime;
    }
    if (Number(activeKey)) {
      params.state = Number(activeKey);
    }
    console.log('Page request:', params, sort, filter);
    const result: any = await PjFirm(params);
    const columnsArr: any[] = result.result.records;
    if (result.result.records) {
      result.result.records.forEach((item: any) => {
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
      table={table}
      filters={filters}
      actions={actions}
      footerActions={footerActions}
      columns={columns}
      datas={datas}
      request={request}
      actionRef={actionRef}
    />
  );
};

export default Page;
