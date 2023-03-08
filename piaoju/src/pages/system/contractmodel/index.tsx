/* eslint-disable @typescript-eslint/no-use-before-define */
import { BaseList } from '@/components/base';
import {
  pjModel,
  pjModelDelete,
  pjModeldefaultStatus,
  pjModeleditStatus,
} from '@/services/ant-design-pro/contract';
import { page } from '@/utils';
import type { ActionType } from '@ant-design/pro-table';
import { Switch } from 'antd';
import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import Page2 from '../contractmodel/edit';
import ContractModalAll from '../contractmodel/edit/contractAllGoods'; //hetong quanbu
import openModal from '@/utils/page';

const Page: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [table] = React.useState<any>({
    mname: 'contract',
    key: 'id',
  });
  const [datas] = React.useState<any[]>([]);
  const [actions] = React.useState<any[]>([
    {
      label: '新增模板',
      icon: 'PlusOutlined',
      type: 'button',
      auth: '/ticket/contract/model/add',
      onClick: () => {
        const targetId = 'abc1';
        page.showModal(<Page2 mode={'modal'} action={'add'} submitTarget={targetId} />, {
          title: '新增',
          width: 1460,
          maskClosable: false,
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
  const [filters] = React.useState<any[]>([{ title: '模板名称', name: 'code', type: 'input' }]);
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
    { title: '模板名称', key: 'code' },
    {
      title: '是否默认模板',
      key: 'defaultStatus',
      valueEnum: {
        0: {
          text: '否',
        },
        1: {
          text: '是',
        },
      },
      // render: (_: any, record: any) => {
      //   const checked = record.defaultStatus === 0 ? false : true;
      //   return (
      //     <Switch
      //       checkedChildren="是"
      //       unCheckedChildren="否"
      //       checked={checked}
      //       onChange={onChange}
      //     />
      //   );
      // },
    },
    {
      title: '是否生效',
      key: 'status',
      // valueEnum: {
      //   0: {
      //     text: '否',
      //   },
      //   1: {
      //     text: '是',
      //   },
      // },
      render: (_: any, record: any) => {
        const checked = record.status === 0 ? false : true;
        return (
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            checked={checked}
            onClick={async () => {
              const params: any = {};
              params.id = record.id;
              if (record.status === 0) {
                params.status = 1;
              }
              if (record.status === 1) {
                params.status = 0;
              }
              const res: any = await pjModeleditStatus(params);
              if (res.code == 200) {
                actionRef.current?.reloadAndRest?.();
              }
            }}
          />
        );
      },
    },
    { title: '创建时间', align: 'center', key: 'createTime' },
    {
      title: '操作',
      align: 'center',
      type: 'option',
      showLength: 5,
      handle: (text: ReactNode, record: any): ReactNode[] => [
        {
          type: 'edit',
          text: '设置默认模板',
          auth: '/ticket/contract/model/change',
          onClick: () => {
            _contractchange(record);
            actionRef.current?.reloadAndRest?.();
          },
        },
        // {
        //   type: 'edit',
        //   text: record.status == 0 ? '生效' : '失效',
        //   auth: '/ticket/contract/model/status',
        //   onClick: () => {
        //     _pjModeleditStatus(record);
        //     actionRef.current?.reloadAndRest?.();
        //   },
        // },
        {
          type: 'edit',
          text: '模板预览',
          auth: '/ticket/contract/model/edit',
          onClick: () => {
            openModal.showModal(
              <ContractModalAll
                mode={'modal'}
                action={'add'}
                submitTarget={''}
                dataInfo={{}}
                context={record.context}
              />,
              {
                title: '采购合同',
                width: 1000,
                maskClosable: false,
                footer: null,
              },
            );
          },
        },
        {
          type: 'edit',
          text: '编辑',
          mode: 'modal',
          auth: '/ticket/contract/model/edit',
          onClick: () => {
            const targetId = 'abc1';
            page.showModal(
              <Page2 mode={'modal'} action={'edit'} id={record.id} submitTarget={targetId} />,
              {
                title: '编辑',
                width: 1460,
                maskClosable: false,
                footer: <div id={targetId} />,
              },
            );
          },
        },
        {
          type: 'delete',
          mode: 'modal',
          text: '删除',
          auth: '/ticket/contract/model/delete',
          onConfirm: () => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            _PjCarouselDelete(record.id);
          },
        },
        // 'delete',
      ],
    },
  ]);

  React.useEffect(() => {
    console.log('query', props?.location?.query);
  }, [props?.location?.query]);

  // // 生效/失效
  // const _pjModeleditStatus = async (record: any) => {
  //   const params: any = {};
  //   params.id = record.id;
  //   if (record.status === 0) {
  //     params.status = 1;
  //   }
  //   if (record.status === 1) {
  //     params.status = 0;
  //   }
  //   const res: any = await pjModeleditStatus(params);
  //   if (res.code == 200) {
  //     actionRef.current?.reloadAndRest?.();
  //   }
  // };
  // 设置默认模板;
  const _contractchange = async (record: any) => {
    const params: any = {};
    params.id = record.id;
    const res: any = await pjModeldefaultStatus(params);
    if (res.code == 200) {
      actionRef.current?.reloadAndRest?.();
    }
  };

  // 删除
  const _PjCarouselDelete = async (id: any) => {
    const res: any = await pjModelDelete(id);
    if (res.code == 200) {
      actionRef.current?.reloadAndRest?.();
    }
    // message.success(res.msg);
    // console.log(8989, datas);
  };

  const request = async (params: any, sort: any, filter: any) => {
    console.log('Page request:', params, sort, filter);
    const result: any = await pjModel(params);
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
