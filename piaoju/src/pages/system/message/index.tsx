/* eslint-disable @typescript-eslint/no-use-before-define */
import { Card, Col, List, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { messageList, editByAnntIdAndUserId } from '@/services/ant-design-pro/message';
import { page } from '@/utils';
import Page2 from '@/components/NoticeIcon/modal';

const Page: React.FC<any> = () => {
  const [data, setData] = useState<any[]>([]); //消息参数

  //获取数据
  const _data = async () => {
    const result: any = await messageList({});
    setData(result.result.records);
  };
  //取消按钮
  const onCancel = async (e: any, ref: any) => {
    const columns = `${localStorage.getItem('loginType')}`;
    const loginType = JSON.parse(columns);
    // console.log('onCancel', loginType);
    if (e.readFlag === '0' && loginType === 'SaaS') {
      const res: any = await editByAnntIdAndUserId(e.anntId);
      console.log('onCancel', res);
    }
    page.closeModal(ref);
  };
  //确认按钮
  const onOk = async (e: any, ref: any) => {
    const columns = `${localStorage.getItem('loginType')}`;
    const loginType = JSON.parse(columns);
    // console.log('onCancel', urlData);
    if (e.readFlag === '0' && loginType === 'SaaS') {
      const res: any = await editByAnntIdAndUserId(e.anntId);
      console.log('onCancel', res);
    }
    page.closeModal(ref);
  };
  //初始化
  useEffect(() => {
    _data();
  }, []);
  return (
    <Row>
      <Col offset={2} span={20}>
        <Card>
          <List
            header="系统消息中心"
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (p) => {
                console.log(p);
              },
              pageSize: 10,
            }}
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                key={item.title}
                extra={<div>{item.sendTime}</div>}
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  const ref = page.showModal(<Page2 action={item} />, {
                    title: item.titile,
                    maskClosable: false,
                    zIndex: 9999,
                    onCancel: () => {
                      onCancel(item, ref);
                    },
                    onOk: () => {
                      onOk(item, ref);
                    },
                  });
                }}
              >
                <div>
                  {item.titile}
                  {item.msgAbstract != '' || item.msgAbstract != null
                    ? `(${item.msgAbstract})`
                    : ''}
                </div>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Page;
