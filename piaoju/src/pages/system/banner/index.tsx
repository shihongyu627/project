/* eslint-disable @typescript-eslint/no-use-before-define */
import { BaseList } from '@/components/base';
import { PjCarousel, PjCarouselDelete, PjCarouseledit } from '@/services/ant-design-pro/banner';
import { page } from '@/utils';
import loadimg from '@/utils/image';
import type { ActionType } from '@ant-design/pro-table';
import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import Page2 from '../banner/edit';

const Page: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [table] = React.useState<any>({
    mname: 'PjCarousel',
    key: 'id',
  });
  const [datas] = React.useState<any[]>([]);
  const [actions] = React.useState<any[]>([
    {
      label: '新增广告',
      icon: 'PlusOutlined',
      type: 'button',
      auth: '/ticket/picture/add',
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
  const [filters] = React.useState<any[]>([{ title: '广告名称', name: 'name', type: 'input' }]);
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
    { title: '广告名称', key: 'name' },
    { title: '图片', key: 'imgUrl', align: 'center', type: 'image' },
    { title: '排序', key: 'sort' },
    { title: '创建时间', align: 'center', width: 160, key: 'createTime' },
    {
      title: '操作',
      align: 'center',
      type: 'option',
      width: 160,
      showLength: 5,
      handle: (text: ReactNode, record: any): ReactNode[] => [
        {
          type: 'edit',
          text: record.state == 2 ? '上架' : '下架',
          auth: '/ticket/picture/putShelf',
          onClick: () => {
            _PjCarouselstate(record);
            actionRef.current?.reloadAndRest?.();
          },
        },
        {
          type: 'edit',
          text: '编辑',
          mode: 'modal',
          auth: '/ticket/picture/edit',
          onClick: () => {
            const targetId = 'abc1';
            page.showModal(
              <Page2 mode={'modal'} action={'edit'} id={record.id} submitTarget={targetId} />,
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
          auth: '/ticket/picture/delete',
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

  // 上下架
  const _PjCarouselstate = async (record: any) => {
    const params: any = {};
    params.id = record.id;
    if (record.state === 1) {
      params.state = 2;
    }
    if (record.state === 2) {
      params.state = 1;
    }
    const res: any = await PjCarouseledit(params);
    if (res.code == 200) {
      actionRef.current?.reloadAndRest?.();
    }
  };

  // 删除
  const _PjCarouselDelete = async (id: any) => {
    const res: any = await PjCarouselDelete(id);
    if (res.code == 200) {
      actionRef.current?.reloadAndRest?.();
    }
    // message.success(res.msg);
    // console.log(8989, datas);
  };

  const request = async (params: any, sort: any, filter: any) => {
    console.log('Page request:', params, sort, filter);
    const result: any = await PjCarousel(params);
    const columnsArr: any[] = result.result.records;
    if (result.result.records) {
      result.result.records.forEach((item: any) => {
        item.imgUrl = loadimg(item.imgUrl);
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
