import { Space } from 'antd';
// import {
//   //  QuestionCircleOutlined,
//   SettingOutlined,
// } from '@ant-design/icons';
import React from 'react';
import {
  useModel,
  // SelectLang
} from 'umi';
import Avatar from './AvatarDropdown';
// import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import NoticeIcon from '../NoticeIcon';
import { WechatOutlined } from '@ant-design/icons';
import { page } from '@/utils';
import Page2 from './modal';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  // const { initialState, setInitialState } = useModel('@@initialState');
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  //路由校验及获取
  const urlDatas = `${localStorage.getItem('auths')}`;
  const urlData = JSON.parse(urlDatas);
  const check = (url: any) => {
    if (!urlData) {
      return false;
    }
    return urlData.some((item: any) => item.url == url);
  };
  return (
    <Space className={className}>
      {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="umi ui"
        options={[
          { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
          {
            label: <a href="next.ant.design">Ant Design</a>,
            value: 'Ant Design',
          },
          {
            label: <a href="https://protable.ant.design/">Pro Table</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]}
        // onSearch={value => {
        //   console.log('input', value);
        // }}
      /> */}

      {/* <span
        className={styles.action}
        onClick={() => {
          window.open('https://pro.ant.design/docs/getting-started');
        }}
      >
        <QuestionCircleOutlined />
      </span> */}
      <span
        className={styles.action}
        onClick={() => {
          page.showModal(<Page2 />, {
            title: '微信客服（打开微信扫一扫）',
            // maskClosable: false,
            width: 300,
            footer: false,
          });
        }}
      >
        <div style={{ color: '#FFF' }}>在线客服</div>
        <WechatOutlined style={{ marginLeft: '6px' }} />
      </span>
      <div style={{ display: check('/ticket/message') === true ? 'flex' : 'none', zIndex: 999 }}>
        <NoticeIcon />
      </div>
      <Avatar />
      {/* <SelectLang className={styles.action} /> */}
      {/* <a
        type={'text'}
        onClick={() => {
          setInitialState((preInitialState) => ({
            ...preInitialState,
            showtool: !preInitialState?.showtool,
          }));
        }}
      >
        <SettingOutlined />
      </a> */}
    </Space>
  );
};
export default GlobalHeaderRight;
