/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseList } from '@/components/base';
import { pjForeign, pjForeignDelete } from '@/services/ant-design-pro/pjForeign';
import { page } from '@/utils';
import { ReactNode, useRef } from 'react';
import React from 'react';
import Page2 from '../foreign/edit';
import { ActionType } from '@ant-design/pro-table';

const Page: React.FC<any> = (props) => {
  const [table] = React.useState<any>({
    mname: 'pjForeign',
    key: 'id',
  });
  const actionRef = useRef<ActionType>();
  const [datas] = React.useState<any[]>([]);
  const [actions] = React.useState<any[]>([
    {
      label: '新增数据',
      icon: 'PlusOutlined',
      type: 'button',
      auth: '/ticket/foreign/add',
      onClick: () => {
        const targetId = 'abc1';
        page.showModal(<Page2 mode={'modal'} action={'add'} submitTarget={targetId} />, {
          title: '新增',
          footer: <div id={targetId} />,
        });
      },
    },
  ]);
  const [footerActions] = React.useState<any[]>([
    // { label: '批量设置时间', icon: 'PlusOutlined', type: 'button', buttonType: 'primary' },
    // { label: '批量删除', icon: 'DeleteOutlined', type: 'button', danger: true },
    // { label: '批量导出', icon: 'ToTopOutlined', type: 'button', buttonType: 'primary' },
  ]);
  const [filters] = React.useState<any[]>([
    { title: '外商名称', name: 'name', type: 'input' },
    { title: '联系方式', name: 'phone', type: 'input' },
  ]);
  const [columns] = React.useState<any[]>([
    {
      title: '序号',
      key: 'index',
      type: 'indexBorder',
      render(text: any, record: any, index: any) {
        return (
          <span style={{ fontSize: 14 }}>{index + (record.current - 1) * record.pageSize + 1}</span>
        );
      },
    },
    { title: '外商名称', key: 'name' },
    {
      title: '联系方式',
      key: 'phone',
    },
    {
      title: '地址',
      key: 'site',
    },
    { title: '备注', key: 'remark' },
    { title: '创建人', key: 'createBy' },
    {
      title: '创建时间',
      align: 'center',
      key: 'createTime',
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
          auth: '/ticket/foreign/edit',
          onClick: () => {
            const targetId = 'abc1';
            page.showModal(
              <Page2 mode={'modal'} action={'edit'} id={record.id} submitTarget={targetId} />,
              {
                title: '编辑外商',
                footer: <div id={targetId} />,
              },
            );
          },
        },
        {
          type: 'delete',
          mode: 'modal',
          text: '删除',
          auth: '/ticket/foreign/delete',
          onConfirm: () => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            _PjCarouselDelete(record.id);
          },
        },
      ],
    },
  ]);
  // 删除
  const _PjCarouselDelete = async (id: any) => {
    const res: any = await pjForeignDelete(id);
    if (res.code == 200) {
      actionRef.current?.reloadAndRest?.();
    }
    // message.success(res.msg);
    // console.log(8989, datas);
  };
  React.useEffect(() => {
    // console.log('query', props?.location?.query);
  }, [props?.location?.query]);
  const request = async (params: any, sort: any, filter: any) => {
    console.log('Page request:', params, sort, filter);
    const result: any = await pjForeign(params);
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
      actionRef={actionRef}
    />
  );
};

export default Page;
