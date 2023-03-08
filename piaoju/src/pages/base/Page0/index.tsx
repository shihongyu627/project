import React from 'react';
import { BasePage } from '@/components/base';
import { Button, Space } from 'antd';
import { history } from 'umi';
import { page } from '../../../utils';
import Page2 from '../Page2';
import Page3 from '../Page3';

const Page: React.FC<any> = () => {
  return (
    <BasePage mode="page">
      <Space>
        <Button
          type="primary"
          onClick={() => {
            history?.push('/base/base3?id=1');
          }}
        >
          查询详情
        </Button>
        <Button
          type="primary"
          onClick={() => {
            history?.push('/base/base2?action=add');
          }}
        >
          新增内容
        </Button>
        <Button
          type="primary"
          onClick={() => {
            history?.push('/base/base2?action=edit&id=1');
          }}
        >
          编辑内容
        </Button>
      </Space>
      <p />
      <Space>
        <Button
          type="primary"
          onClick={() => {
            page.showDrawer(<Page3 mode={'drawer'} />, { title: '侧栏查看详情' });
          }}
        >
          查询详情 - 侧栏
        </Button>
        <Button
          type="primary"
          onClick={() => {
            const ref = page.showModal(<Page3 mode={'modal'} />, {
              title: '弹窗查看详情',
              footer: null,
            });
            // console.log('ref', ref);
            setTimeout(() => {
              ref.current?.close();
              // page.closeModal(ref);
            }, 2000);
          }}
        >
          查询详情 - 弹窗自动关闭
        </Button>
        <Button
          type="primary"
          onClick={() => {
            page.showDrawer(<Page2 mode={'drawer'} action={'add'} />, { title: '侧栏新增编辑' });
          }}
        >
          新增内容 - 侧栏
        </Button>
        <Button
          type="primary"
          onClick={() => {
            const targetId = 'abc';
            const ref = page.showDrawer(
              <Page2 mode={'drawer'} action={'edit'} submitTarget={targetId} />,
              {
                title: '侧栏编辑',
                footer: <div id={targetId} />,
              },
            );
            // console.log('ref', ref);
            setTimeout(() => {
              // ref.current?.close();
              page.closeDrawer(ref);
            }, 2000);
          }}
        >
          编辑内容 - 侧栏自动关闭
        </Button>
        <Button
          type="primary"
          onClick={() => {
            const targetId = 'xxxxx';
            page.showModal(<Page2 mode={'modal'} action={'edit'} submitTarget={targetId} />, {
              title: '弹窗编辑',
              footer: <div id={targetId} />,
            });
          }}
        >
          编辑内容 - 弹窗
        </Button>
      </Space>
    </BasePage>
  );
};

export default Page;
