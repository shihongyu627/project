import { BaseList } from '@/components/base';
import { sysRole, sysRoleDelete } from '@/services/ant-design-pro/rule';
import { ActionType } from '@ant-design/pro-table';
import React, { ReactNode, useRef } from 'react';
import { history } from 'umi';

const Page: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [table] = React.useState<any>({
    mname: 'role',
    key: 'id',
  });
  const [datas] = React.useState<any[]>([]);
  const [actions] = React.useState<any[]>([
    {
      label: '新增角色',
      icon: 'PlusOutlined',
      type: 'button',
      auth: '/isystem/role/add',
      onClick: () => {
        history?.push('/system/rule/edit?action=add');
      },
    },
    // { label: '导出数据', icon: 'DeleteOutlined', type: 'button', buttonType: 'success' },
  ]);
  const [footerActions] = React.useState<any[]>([
    // { label: '批量设置时间', icon: 'PlusOutlined', type: 'button', buttonType: 'primary' },
    // { label: '批量删除', icon: 'DeleteOutlined', type: 'button', danger: true },
    // { label: '批量导出', icon: 'ToTopOutlined', type: 'button', buttonType: 'primary' },
  ]);
  const [filters] = React.useState<any[]>([{ title: '角色名称', name: 'roleName', type: 'input' }]);
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
    { title: '角色名称', key: 'roleName' },
    { title: '更新时间', align: 'center', width: 160, key: 'updateTime' },
    {
      title: '操作',
      align: 'center',
      type: 'option',
      width: 220,
      showLength: 5,
      handle: (text: ReactNode, record: any): ReactNode[] => [
        {
          type: 'edit',
          text: '编辑',
          mode: 'page',
          auth: '/isystem/role/edit',
          url: `/system/rule/edit?action=edit&id=${record.id}`,
        },
        {
          type: 'delete',
          mode: 'modal',
          text: '删除',
          auth: '/isystem/role/delete',
          onConfirm: () => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            _sysRoleDelete(record.id);
          },
        },
      ],
    },
  ]);

  React.useEffect(() => {
    console.log('query', props?.location?.query);
  }, [props?.location?.query]);
  // 删除
  const _sysRoleDelete = async (id: any) => {
    const res: any = await sysRoleDelete(id);
    if (res.code == 200) {
      actionRef.current?.reloadAndRest?.();
    }
  };
  const request = async (params: any, sort: any, filter: any) => {
    console.log('Page request:', params, sort, filter);
    const result: any = await sysRole(params);
    result.result.records.map((item: any) => {
      item.current = params.current;
      item.pageSize = params.pageSize;
    });
    return {
      data: result.result.records,
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
