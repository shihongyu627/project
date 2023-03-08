import ProCard from '@ant-design/pro-card';
import ProDescriptions from '@ant-design/pro-descriptions';
import { Button, Space } from 'antd';
import React from 'react';
export type Props = {
  dataInfo: {
    clientType: any;
    clientName: any;
    isInvoice: any;
    comboType: any;
  }; // 状态
};
const Header: React.FC<Props> = (props: any) => {
  // const [value, setValueRadio] = useState(null);
  // const onChange = (e: any) => {
  //   setValueRadio(e.target.value);
  //   props.onChangeIsInvoice(e.target.value);
  // };

  //路由校验及获取
  const columnsArr = `${localStorage.getItem('auths')}`;
  const urlData = JSON.parse(columnsArr);
  const check = (url: any) => {
    if (!urlData) {
      return false;
    }
    return urlData.some((item: any) => item.url == url);
  };

  return (
    <ProCard
      colSpan={{ sm: 4, md: 6, lg: 6, xl: 6 }}
      headerBordered={true}
      title={<span style={{ fontWeight: 'bold' }}>客户信息</span>}
      bordered
      direction="column"
      style={{ height: '100%' }}
      extra={
        <Space>
          <Button
            style={{
              display:
                check('/ticket/order/edit') === false || props.dataInfo.state === 3 ? 'none' : '',
            }}
          />
        </Space>
      }
    >
      <ProDescriptions size="small" column={1}>
        <ProDescriptions.Item label="客户类型">
          {props?.dataInfo?.clientType == 1 ? '贸易型企业' : '生产型企业'}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="公司名称">{props?.dataInfo?.clientName}</ProDescriptions.Item>
        {/* <Descriptions.Item label="是否开票">
          <Radio.Group onChange={onChange} value={value ? value : props?.dataInfo?.isInvoice}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Descriptions.Item> */}
        <ProDescriptions.Item label="套餐名称">
          <a>{props?.dataInfo?.comboTypeName}</a>
        </ProDescriptions.Item>
        <ProDescriptions.Item label="结算方式">
          <a>月结</a>
        </ProDescriptions.Item>
      </ProDescriptions>
    </ProCard>
  );
};

export default Header;
