import { BaseList } from '@/components/base';
import React, { ReactNode, useRef } from 'react';
import Page1 from '../tenant/setup';
import Page2 from '../tenant/edit';
import Page3 from '../tenant/adduser';
// import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { pjTenantedit, pjTenant, pjTenantdelete } from '@/services/ant-design-pro/tenant';
import { page } from '@/utils';
import { ActionType } from '@ant-design/pro-table';
import moment from 'moment';
// import { history } from 'umi';

const Page: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [table] = React.useState<any>({
    mname: 'rule',
    key: 'id',
  });
  const [datas] = React.useState<any[]>([]);
  const [actions] = React.useState<any[]>([
    {
      label: '新增租户',
      icon: 'PlusOutlined',
      type: 'button',
      auth: '/ticket/tenant/add',
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
  const [filters] = React.useState<any[]>([
    { title: '租户名称', name: 'name', type: 'input' },
    { title: '创建时间', name: 'createTime', type: 'dateRange' },
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
    {
      title: '租户名称',
      key: 'name',
    },
    // { title: '开始时间', align: 'center', width: 160, key: 'beginDate' },
    // { title: '结束时间', align: 'center', width: 160, key: 'endDate' },
    {
      title: '状态',
      key: 'status',
      render: (h: any, row: any) => {
        const text = row?.status == 1 ? '正常' : row?.status == 0 ? '冻结' : '未知';
        return <span style={{ fontSize: 14 }}>{text}</span>;
      },
    },
    // {
    //   title: '报关单识别数',
    //   key: 'bgdNum',
    // },
    // {
    //   title: '发票识别数',
    //   key: 'invoiceNum',
    // },
    {
      title: '剩余识别数',
      key: 'scanNum',
    },
    { title: '创建时间', align: 'center', width: 160, key: 'createTime' },
    {
      title: '操作',
      align: 'center',
      type: 'option',
      width: 340,
      showLength: 6,
      handle: (text: ReactNode, record: any): ReactNode[] => [
        {
          type: 'link',
          text: '充值调整',
          auth: '/ticket/tenant/scan',
          onClick: () => {
            const targetId = 'abc1';
            page.showModal(
              <Page1 mode={'modal'} action={'edit'} id={record.id} submitTarget={targetId} />,
              {
                title: '充值调整',
                footer: <div id={targetId} />,
              },
            );
          },
        },
        // {
        //   type: 'link',
        //   text: '报关单调整',
        //   auth: '/ticket/tenant/bgd',
        //   onClick: () => {
        //     const targetId = 'abc1';
        //     page.showModal(
        //       <Page1
        //         mode={'modal'}
        //         action={'edit'}
        //         id={record.id}
        //         type={'bgd'}
        //         submitTarget={targetId}
        //       />,
        //       {
        //         title: '报关单调整',
        //         footer: <div id={targetId} />,
        //       },
        //     );
        //   },
        // },
        // {
        //   type: 'link',
        //   text: '发票调整',
        //   auth: '/ticket/tenant/invoice',
        //   onClick: () => {
        //     const targetId = 'abc1';
        //     page.showModal(
        //       <Page1
        //         mode={'modal'}
        //         action={'edit'}
        //         id={record.id}
        //         type={'invoice'}
        //         submitTarget={targetId}
        //       />,
        //       {
        //         title: '发票调整',
        //         footer: <div id={targetId} />,
        //       },
        //     );
        //   },
        // },
        {
          type: 'edit',
          text: '编辑',
          auth: '/ticket/tenant/edit',
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
          type: 'info',
          text: '账号',
          auth: '/ticket/tenant/addUser',
          onClick: () => {
            const targetId = 'abc1';
            page.showModal(
              <Page3
                mode={'modal'}
                action={'add'}
                name={record.name}
                id={record.id}
                submitTarget={targetId}
              />,
              {
                title: '账号',
                footer: <div id={targetId} />,
              },
            );
          },
        },
        {
          type: 'link',
          text: '租户客户',
          auth: '/ticket/tenant/basic',
          url: `/basic?action=edit&id=${record.id}`,
          // onClick: () => {
          //   history?.push(`/customer/edit?action=edit&id=${record.id}`);
          // },
        },
        {
          type: 'edit',
          text: record.status == 0 ? '解冻' : '冻结',
          auth: '/ticket/tenant/status',
          // hidden: record.status == 2 ? true : false,
          onClick: () => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            _frozenBatchstatus(record);
          },
        },
        {
          type: 'delete',
          mode: 'modal',
          auth: '/ticket/tenant/delete',
          text: '删除',
          onConfirm: () => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            _pjTenantdelete(record.id);
          },
        },
        // 'delete',
      ],
    },
  ]);

  React.useEffect(() => {
    console.log('query', props?.location?.query);
  }, [props?.location?.query]);
  // 冻结、解冻
  const _frozenBatchstatus = async (record: any) => {
    const params: any = {};
    params.id = record.id;
    if (record.status === 1) {
      params.status = 0;
    }
    if (record.status === 0) {
      params.status = 1;
    }
    const res: any = await pjTenantedit(params);
    if (res.code == 200) {
      actionRef.current?.reloadAndRest?.();
    }
  };

  // 删除
  const _pjTenantdelete = async (id: any) => {
    const res: any = await pjTenantdelete(id);
    if (res.code == 200) {
      actionRef.current?.reloadAndRest?.();
    }
  };

  const request = async (params: any, sort: any, filter: any) => {
    console.log('Page request:', params, sort, filter);
    if (params.createTime) {
      params.createBeginTime = moment(params.createTime[0]).format('YYYY-MM-DD');
      params.createEndTime = moment(params.createTime[1]).format('YYYY-MM-DD');
      delete params.createTime;
    }
    const result: any = await pjTenant(params);
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
