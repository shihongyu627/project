import type { ReactNode } from 'react';
import React from 'react';
import { BaseList } from '@/components/base';
import { history } from 'umi';
import Page3 from '../Page3';
import Page2 from '../Page2';
import { page } from '@/utils';

const Page: React.FC<any> = (props) => {
  const [table] = React.useState<any>({
    mname: 'rule',
    key: 'id',
  });
  const [datas] = React.useState<any[]>([
    {
      title: 'cccc',
      place: 'shop_banner',
      image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      switch: 1,
    },
  ]);
  const [actions] = React.useState<any[]>([
    {
      label: '新增数据',
      icon: 'PlusOutlined',
      type: 'button',
      auth1: '/admin/advert/add',
      onClick: () => {
        history.push('/base/base2?action=add');
      },
    },
    { label: '导出数据', icon: 'DeleteOutlined', type: 'button', buttonType: 'success' },
  ]);
  const [footerActions] = React.useState<any[]>([
    { label: '批量设置时间', icon: 'PlusOutlined', type: 'button', buttonType: 'primary' },
    { label: '批量删除', icon: 'DeleteOutlined', type: 'button', danger: true },
    { label: '批量导出', icon: 'ToTopOutlined', type: 'button', buttonType: 'primary' },
  ]);
  const [filters] = React.useState<any[]>([
    { label: '标题', tooltip: '最长为 24 位，用于标定的唯一 id', name: 'desc', type: 'input' },
    { label: '进度', name: 'progress', type: 'digit' },
    {
      label: '位置',
      name: 'place',
      type: 'select',
      options: [
        { label: '首页轮播', value: 'home_banner' },
        { label: '商城轮播', value: 'shop_banner' },
      ],
      valueEnum: {
        home_banner: {
          text: '首页轮播',
        },
        shop_banner: {
          text: '商城轮播',
        },
      },
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Error',
        },
        1: {
          text: '开启',
          status: 'Success',
        },
      },
    },
  ]);
  const [columns] = React.useState<any[]>([
    { title: '序号', key: 'index', type: 'indexBorder' },
    { title: 'ID', key: 'id', align: 'center' },
    { title: '标题', key: 'desc', copy: true },
    { title: '图片', key: 'avatar', align: 'center', type: 'image' },
    {
      title: '状态',
      key: 'status',
      type: 'switch',
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Error',
        },
        1: {
          text: '开启',
          status: 'Success',
        },
      },
    },
    { title: '进度', key: 'progress', type: 'digit' },
    { title: '空字段', key: 'cc', type: 'digit' },
    { title: '创建时间', align: 'center', key: 'createdAt' },
    {
      title: '操作',
      align: 'center',
      type: 'option',
      showLength: 3,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      handle: (text: ReactNode, record: any, index: number): ReactNode[] => [
        // <Button
        //   key={index}
        //   onClick={() => {
        //     message.info('点击自定义按钮' + record.key);
        //   }}
        // >
        //   自定义按钮
        // </Button>,
        // 快捷操作-查看
        {
          type: 'info',
          mode: 'page',
          text: '查看',
          url: `/base/base3?id=${record.key}`,
        },
        // 快捷操作-编辑
        {
          type: 'edit',
          text: '编辑',
          mode: 'page',
          url: `/base/base2?action=edit&id=${record.key}`,
        },
        // 快捷操作-删除
        'delete',
        {
          type: 'info',
          mode: 'drawer',
          text: '查看-侧栏',
          render: <Page3 id={record.key} mode={'drawer'} />,
        },
        {
          type: 'info',
          mode: 'modal',
          text: '查看-弹窗',
          render: <Page3 id={record.key} mode={'modal'} />,
        },
        {
          type: 'edit',
          mode: 'drawer',
          text: '编辑-侧栏',
          render: <Page2 action={'edit'} id={record.key} mode={'drawer'} />,
        },
        {
          type: 'edit',
          mode: 'drawer',
          text: '编辑-侧栏-底部',
          onClick: () => {
            const targetId = 'abc';
            page.showDrawer(<Page2 mode={'drawer'} action={'edit'} submitTarget={targetId} />, {
              title: '侧栏编辑',
              footer: <div id={targetId} />,
            });
          },
        },
        {
          type: 'edit',
          mode: 'modal',
          text: '编辑-弹窗',
          render: <Page2 action={'edit'} id={record.key} mode={'modal'} />,
        },
        {
          type: 'edit',
          mode: 'modal',
          text: '编辑-弹窗-底部',
          onClick: () => {
            const targetId = 'abc1';
            page.showModal(<Page2 mode={'modal'} action={'edit'} submitTarget={targetId} />, {
              title: '弹窗编辑',
              footer: <div id={targetId} />,
            });
          },
        },
      ],
    },
  ]);

  React.useEffect(() => {
    // console.log('query', props?.location?.query);
  }, [props?.location?.query]);

  // 表单提交
  const request = async (params: any, sort: any, filter: any) => {
    console.log('Page request:', params, sort, filter);
  };

  return (
    <BaseList
      mode={props.mode}
      table={table}
      filters={filters}
      actions={actions}
      footerActions={footerActions}
      columns={columns}
      datas={datas}
      request={request}
    />
  );
};

export default Page;
