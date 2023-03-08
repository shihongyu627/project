/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseList } from '@/components/base';
import { PjCombo, pjComboNoPageList } from '@/services/ant-design-pro/setmeal';
import { page } from '@/utils';
import type { ReactNode } from 'react';
import React from 'react';
import Page2 from '../setmeal/edit';

const Page: React.FC<any> = (props) => {
  const [table] = React.useState<any>({
    mname: 'PjCombo',
    key: 'id',
  });
  const [datas] = React.useState<any[]>([]);
  const [actions] = React.useState<any[]>([
    // {
    //   label: '新增数据',
    //   icon: 'PlusOutlined',
    //   type: 'button',
    //   auth1: '/admin/advert/add',
    //   onClick: () => {
    //     history?.push('/customer/edit?action=add');
    //     // alert('xxx');
    //   },
    // },
  ]);
  const [footerActions] = React.useState<any[]>([
    // { label: '批量设置时间', icon: 'PlusOutlined', type: 'button', buttonType: 'primary' },
    // { label: '批量删除', icon: 'DeleteOutlined', type: 'button', danger: true },
    // { label: '批量导出', icon: 'ToTopOutlined', type: 'button', buttonType: 'primary' },
  ]);
  const [filters] = React.useState<any[]>([
    {
      label: '套餐类型',
      name: 'comboType',
      type: 'select',
      fieldProps: {
        showSearch: true,
      },
      request: async function () {
        const result: any = await pjComboNoPageList();
        const columnsArr: any[] = result.result;
        const res: any = [];
        columnsArr.map((item) => {
          const temp = {
            label: item.name,
            value: item.comboType,
          };
          res.push(temp);
        });
        return res;
      },
    },
  ]);
  const [columns] = React.useState<any[]>([
    { title: '序号', key: 'index', type: 'indexBorder' },
    { title: '套餐名称', key: 'name' },
    {
      title: '套餐类型',
      key: 'comboType',
    },
    {
      title: '结算方式',
      key: 'closing',
      valueEnum: {
        1: {
          text: '月结',
        },
        2: {
          text: '季结',
        },
        3: {
          text: '年结',
        },
      },
    },
    { title: '备注', key: 'remark' },
    {
      title: '更新时间',
      align: 'center',
      key: 'updateTime',
    },
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
          auth: '/ticket/combo/edit',
          onClick: () => {
            const targetId = 'abc1';
            page.showModal(
              <Page2 mode={'modal'} action={'edit'} id={record.id} submitTarget={targetId} />,
              {
                title: '编辑套餐',
                footer: <div id={targetId} />,
              },
            );
          },
        },
      ],
    },
  ]);

  React.useEffect(() => {
    // console.log('query', props?.location?.query);
  }, [props?.location?.query]);
  const request = async (params: any, sort: any, filter: any) => {
    console.log('Page request:', params, sort, filter);
    const result: any = await PjCombo(params);
    const columnsArr: any[] = result.result.records;
    return {
      data: columnsArr,
      // success 请返回 true，
      // 不然 table 会停止解析数据，即使有数据
      success: result?.success,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: result.total,
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
    />
  );
};

export default Page;
