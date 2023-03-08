import { BaseIcon } from '@kafudev/ui-kit';
import { Col, Row, Space } from 'antd';
import React from 'react';

export type OrderStatusProps = {
  record: any;
};

const OrderStatus: React.FC<OrderStatusProps> = (props) => {
  const { record } = props;

  const renderIcon = (
    state = false,
    okIcon = 'CheckCircleOutlined',
    failIcon = 'ExclamationCircleOutlined',
  ) => {
    if (state) {
      return <BaseIcon name={okIcon} style={{ color: '#00CC33' }} />;
    }
    return <BaseIcon name={failIcon} style={{ color: 'red' }} />;
  };
  const userInfo = `${localStorage.getItem('userInfo')}`;
  const datasuserInfo = JSON.parse(userInfo);

  return (
    <Row
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: 'calc(100% - 80px)',
        paddingLeft: '80px',
      }}
    >
      <Col
        span={3}
        style={{
          display:
            record?.clientType === 1 && (record?.comboType === 'B' || record?.comboType === 'A+B')
              ? 'flex'
              : 'none',
        }}
      >
        <Space>
          <Space direction="vertical" size={1} align={'baseline'}>
            {renderIcon(record?.incomeState == 1)}
            <div>&nbsp;</div>
          </Space>
          <Space direction="vertical" size={1} align={'baseline'}>
            <div>进项发票</div>
            <div>{record?.incomeTime}&nbsp;</div>
          </Space>
        </Space>
      </Col>
      <Col
        span={3}
        style={{
          display:
            record?.clientType === 1 && (record?.comboType === 'B' || record?.comboType === 'A+B')
              ? 'flex'
              : 'none',
        }}
      >
        <Space>
          <Space direction="vertical" size={1} align={'baseline'}>
            {renderIcon(record?.authenticationState == 1)}
            <div>&nbsp;</div>
          </Space>
          <Space direction="vertical" size={1} align={'baseline'}>
            <div>进项发票认证</div>
            <div>{record?.authenticationTime}&nbsp;</div>
          </Space>
        </Space>
      </Col>
      <Col
        span={4}
        style={{
          display:
            (record?.clientType === 1 || record?.clientType === 2) &&
            (record?.comboType === 'B' || record?.comboType === 'A+B')
              ? 'flex'
              : 'none',
        }}
      >
        <Space>
          <Space direction="vertical" size={1} align={'baseline'}>
            {renderIcon(record?.exitState == 1)}
            <div>&nbsp;</div>
          </Space>
          <Space direction="vertical" size={1} align={'baseline'}>
            <div>出口发票</div>
            <div>{record?.exitTime}&nbsp;</div>
          </Space>
        </Space>
      </Col>
      <Col
        span={3}
        style={{
          display:
            (record?.clientType === 1 || record?.clientType === 2) &&
            (record?.comboType === 'B' || record?.comboType === 'A+B')
              ? 'flex'
              : 'none',
        }}
      >
        <Space>
          <Space direction="vertical" size={1} align={'baseline'}>
            {renderIcon(record?.taxRefundState == 1)}
            <div>&nbsp;</div>
          </Space>
          <Space direction="vertical" size={1} align={'baseline'}>
            <div>退税申报</div>
            <div>{record?.taxRefundTime}&nbsp;</div>
          </Space>
        </Space>
      </Col>
      <Col span={3}>
        <Space
        // style={{
        //   display: record?.comboType === 'B' || record?.comboType === 'A+B' ? 'flex' : 'none',
        // }}
        >
          <Space direction="vertical" size={1} align={'baseline'}>
            {renderIcon(record?.filingState == 1)}
            <div>&nbsp;</div>
          </Space>
          <Space direction="vertical" size={1} align={'baseline'}>
            <div>备案资料</div>
            <div>{record?.filingTime}&nbsp;</div>
          </Space>
        </Space>
      </Col>
      <Col
        span={3}
        style={{
          display: datasuserInfo.roleCode === 'client' ? 'none' : 'flex',
        }}
      >
        <Space>
          <Space direction="vertical" size={1} align={'baseline'}>
            {renderIcon(record?.arrearageState == 1)}
            <div>&nbsp;</div>
          </Space>
          <Space direction="vertical" size={1} align={'baseline'}>
            <div>{record?.arrearageState == 1 ? '已付款' : '未付款'}</div>
            <div>{record?.arrearageTime}&nbsp;</div>
          </Space>
        </Space>
      </Col>
      <Col span={3}>
        <Space>
          <Space direction="vertical" size={1} align={'baseline'}>
            {renderIcon(record?.isDownload == 1)}
            <div>&nbsp;</div>
          </Space>
          <Space direction="vertical" size={1} align={'baseline'}>
            <div>{record?.isDownload == 1 ? '资料已下载' : '资料未下载'}</div>
            <div>&nbsp;</div>
          </Space>
        </Space>
      </Col>
    </Row>
  );
};

export default OrderStatus;
