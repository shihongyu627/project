import { BaseList } from '@/components/base';
import { PjExchangeRate, PjExchangeRateDelete } from '@/services/ant-design-pro/exchangerate';
import { page } from '@/utils';
import type { ActionType } from '@ant-design/pro-table';
import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import Page2 from '../exchangerate/edit';

const Page: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [table] = React.useState<any>({
    mname: 'PjExchangeRate',
    key: 'id',
  });
  const [datas] = React.useState<any[]>([]);
  const [actions] = React.useState<any[]>([
    {
      label: '新增汇率',
      icon: 'PlusOutlined',
      type: 'button',
      auth: '/ticket/exchangeRate/add',
      onClick: () => {
        const targetId = 'abc1';
        page.showModal(<Page2 mode={'modal'} action={'add'} submitTarget={targetId} />, {
          title: '新增',
          footer: <div id={targetId} />,
        });
      },
    },
  ]);
  const [footerActions] = React.useState<any[]>([]);
  const [filters] = React.useState<any[]>([
    { title: '月份', name: 'mouth', type: 'dateMonth' },
    { title: '汇率', name: 'exchange', type: 'input' },
    {
      label: '币种',
      name: 'currency',
      type: 'select',
      fieldProps: {
        showSearch: true,
      },
      options: [
        { label: 'USD', value: 'USD' },
        // { label: 'RMB', value: 'RMB' },
        // { label: 'RUB', value: 'RUB' },
        // { label: 'HKD', value: 'HKD' },
      ],
      valueEnum: {
        USD: {
          text: 'USD',
        },
        // RMB: {
        //   text: 'RMB',
        // },
        // RUB: {
        //   text: 'RUB',
        // },
        // HKD: {
        //   text: 'HKD',
        // },
      },
      // valueEnum: {
      //   { label: 'USD', value: 'USD' },
      //   { label: 'RMB', value: 'RMB' },
      //   { label: 'RUB', value: 'RUB' },
      //   { label: 'HKD', value: 'HKD' },
      // },
    },
  ]);
  const _filterPoint = (number: any, n: any) => {
    const number1 = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); // 四舍五入
    const number2 = Number(number1).toFixed(n); // 补足位数
    return number2;
  };
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
    { title: '月份', key: 'mouth' },
    {
      title: '汇率',
      key: 'exchange',
      render: (h: any, row: any) => {
        return (
          <div>
            <div style={{ fontSize: 14 }}>{_filterPoint(row.exchange, 4)}</div>
          </div>
        );
      },
    },
    {
      title: '币种',
      key: 'currency',
    },
    { title: '更新时间', align: 'center', key: 'updateTime' },
    { title: '创建时间', align: 'center', key: 'createTime' },
    {
      title: '操作',
      align: 'center',
      type: 'option',
      showLength: 5,
      handle: (text: ReactNode, record: any): ReactNode[] => [
        {
          type: 'edit',
          text: '编辑',
          mode: 'page',
          auth: '/ticket/exchangeRate/edit',
          onClick: () => {
            const targetId = 'abc1';
            page.showModal(
              <Page2 mode={'modal'} action={'edit'} id={record.id} submitTarget={targetId} />,
              {
                title: '设定汇率',
                footer: <div id={targetId} />,
              },
            );
          },
        },
        {
          type: 'delete',
          mode: 'modal',
          text: '删除',
          auth: '/ticket/exchangeRate/delete',
          onConfirm: () => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            _PjExchangeRateDelete(record.id);
          },
        },
      ],
    },
  ]);
  const _PjExchangeRateDelete = async (id: any) => {
    const res: any = await PjExchangeRateDelete(id);
    if (res.code == 200) {
      actionRef.current?.reloadAndRest?.();
    }
  };
  const request = async (params: any, sort: any, filter: any) => {
    console.log(params, sort, filter);
    const result: any = await PjExchangeRate(params);
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

  React.useEffect(() => {
    console.log('query', props?.location?.query);
  }, [props?.location?.query]);

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
