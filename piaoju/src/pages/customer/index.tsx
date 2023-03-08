import { BaseList } from '@/components/base';
import {
  // PjClient,
  PjClientDelete,
  pjComboNoPageList,
  pjUserNoPageList,
  pjClientlist,
} from '@/services/ant-design-pro/customer';
import type { ActionType } from '@ant-design/pro-table';
import { page } from '@kafudev/ui-kit';
import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import { history } from 'umi';
import Page1 from '../customer/adduser';
import Page3 from '../customer/changeuser';
import Page2 from '../customer/setup';

const Page: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [table] = React.useState<any>({
    mname: 'PjClient',
    key: 'id',
  });
  const [datas] = React.useState<any[]>([]);
  const [actions] = React.useState<any[]>([
    {
      label: '新增客户',
      icon: 'PlusOutlined',
      type: 'button',
      auth: '/ticket/client/add',
      onClick: () => {
        history?.push('/customer/add?action=add');
      },
    },
    // { label: '导出数据', icon: 'DeleteOutlined', type: 'button', buttonType: 'success' },
  ]);
  const [footerActions] = React.useState<any[]>([
    // { label: '批量设置时间', icon: 'PlusOutlined', type: 'button', buttonType: 'primary' },
    // { label: '批量删除', icon: 'DeleteOutlined', type: 'button', danger: true },
    // { label: '批量导出', icon: 'ToTopOutlined', type: 'button', buttonType: 'primary' },
  ]);
  const [filters] = React.useState<any[]>([
    // { label: '企业名称', tooltip: '最长为 24 位，用于标定的唯一 id', name: 'desc', type: 'input' },
    { label: '企业名称', name: 'name', type: 'input' },
    {
      label: '客服搜索',
      name: 'allot',
      type: 'select',
      fieldProps: {
        showSearch: true,
      },
      request: async function () {
        const result: any = await pjUserNoPageList();
        const columnsArr: any[] = result.result;
        const res: any = [];
        columnsArr.map((item) => {
          const temp = {
            label: item.realname,
            value: item.id,
          };
          res.push(temp);
        });
        return res;
      },
    },
    {
      label: '套餐类型',
      name: 'combo',
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
    {
      label: '客户类型',
      name: 'clientType',
      type: 'select',
      valueEnum: {
        1: {
          text: '贸易型企业',
          //   status: 'Error',
        },
        2: {
          text: '生产型企业',
          //   status: 'Success',
        },
      },
    },
  ]);
  const [columns] = React.useState<any[]>([
    {
      title: '序号',
      key: 'id',
      width: 80,
      render(text: any, record: any, index: any) {
        // console.log('record', text, record, index);
        return (
          <span style={{ fontSize: 14 }}>
            {record.total - record.size * (record.current - 1) - index}
          </span>
        );
      },
    },
    { title: '企业名称', key: 'name' },
    {
      title: '客户类型',
      key: 'clientType',
      width: 100,
      valueEnum: {
        1: {
          text: '贸易型企业',
        },
        2: {
          text: '生产型企业',
        },
        3: {
          text: '其他',
        },
      },
    },
    { title: '联系人', key: 'contacts' },
    { title: '联系电话', key: 'phone', width: 100 },
    { title: '备注', key: 'remark' },
    { title: '创建时间', align: 'center', key: 'createTime' },
    {
      title: '操作',
      align: 'center',
      type: 'option',
      width: 280,
      showLength: 4,
      handle: (text: ReactNode, record: any): ReactNode[] => [
        {
          type: 'link',
          text: '详情',
          auth: '/ticket/client/getId',
          onClick: () => {
            history?.push(`/customer/edit?action=edit&id=${record.id}`);
          },
        },
        {
          type: 'link',
          text: '设定套餐',
          auth: '/ticket/client/edit',
          onClick: () => {
            page.showModal(<Page2 mode={'modal'} action={'edit'} id={record.id} setFooter />, {
              title: '设定套餐',
            });
          },
        },
        {
          type: 'link',
          text: '订单',
          auth: '/ticket/client/order',
          onClick: () => {
            history?.push(`/order?clientId=${record.id}`);
          },
        },
        {
          type: 'info',
          text: '更换客服',
          auth: '/ticket/client/checkAllot',
          onClick: () => {
            page.showModal(
              <Page3 mode={'modal'} action={'add'} name={record.name} id={record.id} setFooter />,
              {
                title: '更换客服',
              },
            );
          },
        },
        {
          type: 'info',
          text: '账号',
          auth: '/ticket/client/user/add',
          hidden: record.isFound === 1 ? true : false,
          onClick: () => {
            page.showModal(
              <Page1 mode={'modal'} action={'add'} name={record.name} id={record.id} setFooter />,
              {
                title: '账号',
              },
            );
          },
        },
        {
          type: 'delete',
          text: '删除',
          auth: '/ticket/client/delete',
          onConfirm: () => {
            // console.log(record.id);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            _PjClientDelete(record.id);
          },
        },
        // 快捷操作-删除
        // 'delete',
      ],
    },
  ]);

  React.useEffect(() => {
    // console.log('query', props?.location?.query);
  }, [props?.location?.query]);
  // 删除
  const _PjClientDelete = async (id: any) => {
    // console.log('id', id);
    const res: any = await PjClientDelete(id);
    if (res.code == 200) {
      setTimeout(() => {
        actionRef.current?.reloadAndRest?.();
      }, 500);
    }
  };
  const request = async (params: any, sort: any, filter: any) => {
    console.log('Page request:', params, sort, filter);
    const res: any = await pjClientlist({
      ...params,
    });
    if (res?.code == 200) {
      const columnsArr: any[] = [];
      if (res.result.records) {
        res.result.records.forEach((item: any) => {
          const dd = item;
          dd.current = res.result.current;
          dd.size = res.result.size;
          dd.index = item.index;
          dd.total = res.result.total;
          columnsArr.push(dd);
        });
      }
      return {
        data: columnsArr,
        // success 请返回 true，
        // 不然 table 会停止解析数据，即使有数据
        success: res?.success,
        // 不传会使用 data 的长度，如果是分页一定要传
        total: res.result.total,
      };
    }
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
