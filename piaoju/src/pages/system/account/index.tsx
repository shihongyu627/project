import { BaseList } from '@/components/base';
import React, { ReactNode, useRef } from 'react';
import Page1 from '../account/changepassword';
import Page2 from '../account/edit';
// import Page3 from '../account/change';
// import { ModalForm, ProFormText } from '@ant-design/pro-form';
import {
  frozenBatch,
  sysDepartnoPageList,
  sysUser,
  sysUserDelete,
} from '@/services/ant-design-pro/account';
import { page } from '@/utils';
import { ActionType } from '@ant-design/pro-table';
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
      label: '新增用户',
      icon: 'PlusOutlined',
      type: 'button',
      auth: '/isystem/user/add',
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
    // { title: '账号搜索', name: 'realname', type: 'input' },
    // { title: '登录账号', name: 'username', type: 'input' },
    {
      label: '部门搜索',
      name: 'departIds',
      type: 'treeSelect',
      multiple: false,
      placeholder: '请选择所属部门',
      request: async function () {
        const result: any = await sysDepartnoPageList();
        const columnsArr: any[] = result.result;
        const res: any = [];
        columnsArr.map((item) => {
          const temp = {};
          temp['title'] = item.departName;
          temp['value'] = item.id;
          temp['children'] = item.children;
          res.push(temp);
        });
        return res;
      },
      dropList: [],
      rules: [{ required: true, trigger: 'blur' }],
      fieldProps: {
        multiple: false,
        showSearch: true,
        // labelInValue: true,
        allowClear: true,
        autoClearSearchValue: true,
        treeNodeFilterProp: 'title',
        treeDefaultExpandAll: true,
        fieldNames: {
          label: 'title',
        },
      },
    },
    // {
    //   title: '部门搜索',
    //   name: 'departIds',
    //   type: 'select',
    //   fieldProps: {
    //     showSearch: true,
    //   },
    //   request: async function () {
    //     const result: any = await sysDepartnoPageList();
    //     const columnsArr: any[] = result.result;
    //     const res: any = [];
    //     columnsArr.map((item) => {
    //       const temp = {
    //         label: item.departName,
    //         value: item.id,
    //       };
    //       res.push(temp);
    //     });
    //     console.log('sysDepartnoPageList', res);
    //     return res;
    //   },
    // },
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
      title: '姓名',
      key: 'realname',
    },
    { title: '登录账号', key: 'username' },
    // { title: '租户名称', key: 'tenantName' },
    { title: '所属部门', key: 'orgCodeTxt' },
    { title: '绑定角色', key: 'roleTxt' },
    {
      title: '账户类型',
      key: 'userIdentity',
      valueEnum: {
        1: {
          text: '普通用户',
        },
        2: {
          text: '主管',
        },
      },
    },
    { title: '备注', key: 'remark' },
    { title: '更新时间', align: 'center', width: 160, key: 'updateTime' },
    {
      title: '操作',
      align: 'center',
      type: 'option',
      width: 400,
      showLength: 6,
      handle: (text: ReactNode, record: any): ReactNode[] => [
        {
          type: 'edit',
          text: '重置密码',
          mode: 'page',
          auth: '/isystem/user/reset',
          onClick: () => {
            const targetId = 'abc1';
            page.showModal(
              <Page1
                mode={'modal'}
                id={record.id}
                username={record.username}
                action={'change'}
                submitTarget={targetId}
              />,
              {
                title: '重置密码',
                footer: <div id={targetId} />,
              },
            );
          },
        },
        // {
        //   type: 'edit',
        //   text: '查看数据',
        //   mode: 'page',
        //   auth: '/isystem/user/details',
        //   onClick: () => {
        //     if (record.state === 3) {
        //       history?.push(`/order?allot=${record.id}`);
        //     } else {
        //       return;
        //     }
        //   },
        // },
        // {
        //   type: 'edit',
        //   text: '租户绑定',
        //   auth: '/isystem/user/tenant',
        //   mode: 'page',
        //   onClick: () => {
        //     const targetId = 'abc1';
        //     page.showModal(
        //       <Page3 mode={'modal'} id={record.id} action={'edit'} submitTarget={targetId} />,
        //       {
        //         title: '租户绑定',
        //         footer: <div id={targetId} />,
        //       },
        //     );
        //   },
        // },
        {
          type: 'edit',
          text: '编辑',
          auth: '/isystem/user/edit',
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
          type: 'edit',
          text: record.status == 2 ? '解冻' : '冻结',
          auth: '/isystem/user/frozenBatch',
          // hidden: record.status == 2 ? true : false,
          onClick: () => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            _frozenBatchstatus(record);
          },
        },
        {
          type: 'delete',
          mode: 'modal',
          auth: '/isystem/user/delete',
          text: '删除',
          onConfirm: () => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            _sysUserDelete(record.id);
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
      params.status = 2;
    }
    if (record.status === 2) {
      params.status = 1;
    }
    const res: any = await frozenBatch(params);
    if (res.code == 200) {
      actionRef.current?.reloadAndRest?.();
    }
  };

  // 删除
  const _sysUserDelete = async (id: any) => {
    const res: any = await sysUserDelete(id);
    if (res.code == 200) {
      actionRef.current?.reloadAndRest?.();
    }
  };

  const request = async (params: any, sort: any, filter: any) => {
    console.log('Page request:', params, sort, filter);
    const result: any = await sysUser(params);
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
