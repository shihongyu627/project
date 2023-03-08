import React from 'react';
import { Row, Col, Button } from 'antd';
import ProForm from '@ant-design/pro-form';
import openModal from '@/utils/page';
export type TableListItem = {
  key: number;
  name: string;
  status: string;
  updatedAt: number;
  createdAt: number;
  progress: number;
  money: number;
};
export default () => {
  return (
    <ProForm<{
      name: string;
      company?: string;
      useMode?: string;
    }>
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      grid={false}
      rowProps={{
        gutter: [16, 0],
      }}
      submitter={{
        render: () => {
          return (
            <Row justify={'end'}>
              <Col style={{ marginRight: '8px' }}>
                <Button
                  onClick={() => {
                    openModal.closeModal();
                  }}
                >
                  取消
                </Button>
              </Col>
              <Col style={{ marginRight: '8px' }}>
                <Button
                  onClick={() => {
                    openModal.closeModal();
                  }}
                >
                  导出
                </Button>
              </Col>
              <Col style={{ marginRight: '8px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    openModal.closeModal();
                  }}
                >
                  确定
                </Button>
              </Col>
            </Row>
          );
        },
      }}
      params={{}}
    >
      <span>预览</span>
    </ProForm>
  );
};
