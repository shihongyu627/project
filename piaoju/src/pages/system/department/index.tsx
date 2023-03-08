import { BaseList } from '@/components/base';
import { sysDepart, sysDepartDelete } from '@/services/ant-design-pro/department';
import { page } from '@/utils';
import { ActionType } from '@ant-design/pro-table';
import React, { ReactNode, useRef } from 'react';
import Page2 from '../department/edit';

const Page: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [table] = React.useState<any>({
    mname: 'sysDepart',
    key: 'id',
  });
  const [datas] = React.useState<any[]>([]);
  const [actions] = React.useState<any[]>([
    {
      label: '新增部门',
      icon: 'PlusOutlined',
      type: 'button',
      auth: '/isystem/depart/add',
      onClick: () => {
        const targetId = 'abc1';
        page.showModal(<Page2 mode={'modal'} action={'add'} submitTarget={targetId} />, {
          title: '新增',
          footer: <div id={targetId} />,
        });
      },
    },
    // { label: '导出数据', icon: 'DeleteOutlined', type: 'button', buttonType: 'success' },
  ]);
  const [footerActions] = React.useState<any[]>([
    // { label: '批量设置时间', icon: 'PlusOutlined', type: 'button', buttonType: 'primary' },
    // { label: '批量删除', icon: 'DeleteOutlined', type: 'button', danger: true },
    // { label: '批量导出', icon: 'ToTopOutlined', type: 'button', buttonType: 'primary' },
  ]);
  // const [filters] = React.useState<any[]>([
  //   // { title: '部门名称', name: 'departName', type: 'input' },
  // ]);
  const [columns] = React.useState<any[]>([
    { title: '部门名称', key: 'departName' },
    {
      title: '操作',
      align: 'center',
      type: 'option',
      width: 220,
      showLength: 5,
      handle: (text: ReactNode, record: any): ReactNode[] => [
        {
          type: 'edit',
          text: '添加子部门',
          mode: 'page',
          auth: '/isystem/depart/addSon',
          onClick: () => {
            const targetId = 'abc1';
            page.showModal(
              <Page2
                mode={'modal'}
                id={record.id}
                action={'addchildren'}
                submitTarget={targetId}
              />,
              {
                title: '编辑',
                footer: <div id={targetId} />,
              },
            );
          },
        },
        {
          type: 'edit',
          text: '编辑',
          auth: '/isystem/depart/edit',
          mode: 'page',
          onClick: () => {
            const targetId = 'abc1';
            page.showModal(
              <Page2 mode={'modal'} id={record.id} action={'edit'} submitTarget={targetId} />,
              {
                title: '编辑',
                footer: <div id={targetId} />,
              },
            );
          },
        },
        {
          type: 'delete',
          mode: 'modal',
          text: '删除',
          auth: '/isystem/depart/delete',
          onConfirm: () => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            _sysDepartDelete(record.id);
          },
        },
        // 'delete',
      ],
    },
  ]);

  React.useEffect(() => {
    console.log('query', props?.location?.query);
  }, [props?.location?.query]);
  // 删除
  const _sysDepartDelete = async (id: any) => {
    const res: any = await sysDepartDelete(id);
    if (res.code == 200) {
      actionRef.current?.reloadAndRest?.();
    }
  };
  const request = async (params: any, sort: any, filter: any) => {
    console.log('Page request:', params, sort, filter);
    const result: any = await sysDepart(params);

    return {
      data: result.result,
      // success 请返回 true，
      // 不然 table 会停止解析数据，即使有数据
      success: result?.success,
      // 不传会使用 data 的长度，如果是分页一定要传
      // total: result.total,
    };
  };
  return (
    <BaseList
      request={request}
      table={table}
      // filters={filters}
      actions={actions}
      footerActions={footerActions}
      columns={columns}
      datas={datas}
      actionRef={actionRef}
    />
  );
};

export default Page;
