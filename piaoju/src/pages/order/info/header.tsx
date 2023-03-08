import { SyncOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Affix, Button, Space } from 'antd';
import React from 'react';
export type Props = {
  headerData: any[]; // 状态
  // ref_other: null;
  handleSubmit: any;
  dataInfo: any;
  saveLoading: boolean;
};
const IconLink = ({ src, text, link }) => (
  <Space
    style={{ display: 'flex', alignItems: 'center', margin: '0 0 0 20px' }}
    onClick={() => {
      if (link) {
        const serve = document.getElementById(link); // 获取要滚动到哪个元素
        let aa = 6; // 设置一个变量  使滚动由快到慢
        const scollHeight = serve?.scrollTop; // 获取元素到顶部的距离
        if (!scollHeight) {
          return;
        }
        // 设置定时器
        const location = setInterval(() => {
          const speed = scollHeight / aa; // 每次滚动多少
          // 当前滚动位置小于元素到顶部的距离
          if (document.documentElement.scrollTop <= scollHeight) {
            document.documentElement.scrollTop += speed; // 和回到顶部不同，需要每次加上步长值
            aa += 3; // 每走一次 使下次的步长值变小
          } else {
            clearInterval(location);
          }
        }, 30);
      }
    }}
  >
    <div>{src}</div>
    <div>{text}</div>
  </Space>
);
//路由校验及获取
const columnsArr = `${localStorage.getItem('auths')}`;
const urlData = JSON.parse(columnsArr);
const check = (url: any) => {
  if (!urlData) {
    return false;
  }
  return urlData.some((item: any) => item.url == url);
};
const userInfo = `${localStorage.getItem('userInfo')}`;
const datasuserInfo = JSON.parse(userInfo);
const Header: React.FC<Props> = (props) => {
  return (
    <Affix offsetTop={48}>
      <ProCard
        colSpan={{ sm: 4, md: 6, lg: 6, xl: 6 }}
        headerBordered={true}
        bordered
        // direction="column"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space wrap>
            <span style={{ fontWeight: 'bold' }}>合同协议号：{props.dataInfo.contractNo}</span>
          </Space>
          <Space wrap>
            {/* <span style={{ fontWeight: 'bold' }}>订单状态：</span> */}
            {(props.headerData || []).map((item, key) => {
              return <IconLink key={key} src={item.src} text={item.text} link={item.link} />;
            })}
          </Space>
          <Space wrap>
            {/* <Button
              type="default"
              size="large"
              onClick={() => {
                window.history.back();
              }}
            >
              取消
            </Button> */}
            <Button
              type="primary"
              // size="large"
              icon={<SyncOutlined />}
              style={{
                display:
                  check('/ticket/order/save') === false ||
                  props.dataInfo.state === 3 
                  // ||
                  // datasuserInfo.state === 1
                    ? 'none'
                    : '',
                marginRight: '3vw',
              }}
              loading={props.saveLoading}
              onClick={() => {
                props.handleSubmit();
              }}
            >
              立即保存
            </Button>
          </Space>
        </div>
      </ProCard>
    </Affix>
  );
};

export default Header;
