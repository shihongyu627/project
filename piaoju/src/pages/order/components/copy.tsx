import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React, { useState } from 'react';

export type Copy = {
  row: any;
};

const copy: React.FC<Copy> = (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, setstate] = useState(1);
  const renderIcon = () => {
    if (state == 1) {
      return (
        <CopyOutlined
          style={{ color: '#1890FF', marginTop: '5px' }}
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            _copy(props.row);
          }}
        />
      );
    }
    return <CheckOutlined style={{ color: '#00CC33', marginTop: '5px' }} />;
  };
  const _copy = (row: any) => {
    const url = row;
    const oInput = document.createElement('input');
    oInput.value = url;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象;
    document.execCommand('Copy'); // 执行浏览器复制命令
    oInput.remove();
    // message.success('复制成功！');
    setstate(2);
    setTimeout(() => {
      setstate(1);
    }, 2000);
  };

  return (
    <Row>
      <Col span={3}>{renderIcon()}</Col>
    </Row>
  );
};

export default copy;
