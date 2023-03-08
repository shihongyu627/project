import React, { useCallback } from 'react';
import {
  LogoutOutlined,
  //  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
// import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';
import type { MenuInfo } from 'rc-menu/lib/interface';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  // const { query = {}, search, pathname } = history.location;
  // const { redirect } = query;
  // Note: There may be security issues, please note
  // if (window.location.pathname !== '/user/login' && !redirect) {
  if (window.location.pathname !== '/user/login') {
    localStorage.removeItem('token');
    // localStorage.clear();
    history.replace({
      pathname: '/user/login',
      // search: stringify({
      //   redirect: pathname + search,
      // }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({}) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      }
      if (key === 'center') {
        history.push(`/changepassword?action=change`);
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.username) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu
      className={styles.menu}
      selectedKeys={[]}
      onClick={onMenuClick}
      items={[
        {
          key: 'center',
          icon: <UserOutlined />,
          label: `修改密码`,
          onClick: () => {},
        },
        // {
        //   key: 'settings',
        //   icon: <SettingOutlined />,
        //   label: `个人设置`,
        //   onClick: () => {},
        // },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: `退出登录`,
          onClick: () => {},
        },
      ]}
    />
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.username}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
