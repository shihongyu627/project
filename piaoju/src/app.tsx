import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
// import TagView from '@/components/TagView';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading, SettingDrawer } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
// import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import defaultSettings from '../config/defaultSettings';
// import { KeepAlive } from 'react-activation';
// import * as Sentry from '@sentry/browser';
// import { BrowserTracing } from '@sentry/tracing';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

// if (!isDev) {
//   Sentry.init({
//     // dsn需要替换新建项目的dsn，从下面截图中的地方获取
//     dsn: 'https://24dfffe9373e44c2b642d0fe0b943d38@sentry.kafukeji.com/3',
//     integrations: [new BrowserTracing()],
//     tracesSampleRate: 1.0,
//   });
// }

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
  showtool: false,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  showtool?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    localStorage.setItem('search', JSON.stringify(window.location.search));
    const currentUser = await fetchUserInfo();
    // history.push(loginPath);
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,

    disableContentMargin: false,
    waterMarkProps: {
      rotate: -40,
      fontSize: 14,
      fontColor: 'rgba(0,0,0,.10)',
      gapY: 300,
      content:
        initialState?.currentUser?.realname + '(' + initialState?.currentUser?.username + ')',
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        const url = document.location.toString();
        // console.log('xx2', url, url.indexOf('?'));
        if (url.indexOf('?') != -1) {
          const arrUrl = url.split('?');
          const para = arrUrl[1];
          // console.log('xx3', loginPath, defaultSettings);
          history.push(loginPath + '?' + para);
        } else {
          history.push(loginPath);
        }
      }
    },
    links: isDev
      ? [
          // <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          //   <LinkOutlined />
          //   <span>OpenAPI 文档</span>
          // </Link>,
          // <Link to="/~docs" key="docs">
          //   <BookOutlined />
          //   <span>业务组件文档</span>
          // </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children: any, props: any) => {
      const columnsArr = `${localStorage.getItem('auths')}`;
      const datas = JSON.parse(columnsArr);
      const firsturl: any = {};
      firsturl.url = '/welcome';
      if (!datas) {
        firsturl.url = '/welcome';
      } else if (datas.some((item: any) => item.url == '/dashboard/analysis') === true) {
        firsturl.url = '/welcome';
      } else if (datas.some((item: any) => item.url == '/ticket/client') === true) {
        firsturl.url = '/customer';
      } else if (datas.some((item: any) => item.url == '/ticket/order') === true) {
        firsturl.url = '/order';
      } else if (datas.some((item: any) => item.url == '/statistics') === true) {
        firsturl.url = '/statistics';
      } else if (datas.some((item: any) => item.url == '/ticket/combo') === true) {
        firsturl.url = '/setmeal';
      } else if (datas.some((item: any) => item.url == '/isystem') === true) {
        if (datas.some((item: any) => item.url == '/ticket/picture') === true) {
          firsturl.url = '/system/banner';
        } else if (datas.some((item: any) => item.url == '/ticket/exchangeRate') === true) {
          firsturl.url = '/system/exchangerate';
        } else if (datas.some((item: any) => item.url == '/isystem/depart') === true) {
          firsturl.url = '/system/department';
        } else if (datas.some((item: any) => item.url == '/isystem/user') === true) {
          firsturl.url = '/system/account';
        } else if (datas.some((item: any) => item.url == '/isystem/roleUserList') === true) {
          firsturl.url = '/system/rule';
        } else if (datas.some((item: any) => item.url == '/ticket/tenant') === true) {
          firsturl.url = '/system/tenant';
        }
      } else if (datas.some((item: any) => item.url == '/ticket/firm') === true) {
        firsturl.url = '/trial';
      } else if (datas.some((item: any) => item.url == '/ticket/log') === true) {
        firsturl.url = '/record';
      }
      // console.log('firsturl', firsturl);
      return (
        <>
          {/* 标签 */}
          {/* {initialState?.currentUser && location.pathname !== loginPath ? (
            <TagView pathname={location.pathname} search={location.search} home={firsturl.url} />
          ) : null} */}
          {/* 数据缓存 */}
          {/* {location.pathname === '/welcome' ||
          location.pathname === '/user/login' ||
          location.pathname === '/trial' ||
          location.pathname === '/customer/edit' ? (
            <ConfigProvider>
              {children}
              {!props.location?.pathname?.includes('/login') && (
                <SettingDrawer
                  collapse={initialState?.showtool}
                  disableUrlParams
                  enableDarkTheme
                  // hideHintAlert
                  settings={initialState?.settings}
                  onSettingChange={(settings) => {
                    setInitialState((preInitialState) => ({
                      ...preInitialState,
                      settings,
                    }));
                  }}
                  onCollapseChange={(collapsed: boolean) => {
                    setInitialState((preInitialState) => ({
                      ...preInitialState,
                      showtool: collapsed,
                    }));
                  }}
                />
              )}
            </ConfigProvider>
          ) : (
            <KeepAlive
              when={true}
              id={location.pathname}
              name={location.pathname}
              saveScrollPosition="screen"
            >
              <ConfigProvider>
                {children}
                {!props.location?.pathname?.includes('/login') && (
                  <SettingDrawer
                    collapse={initialState?.showtool}
                    disableUrlParams
                    enableDarkTheme
                    // hideHintAlert
                    settings={initialState?.settings}
                    onSettingChange={(settings) => {
                      setInitialState((preInitialState) => ({
                        ...preInitialState,
                        settings,
                      }));
                    }}
                    onCollapseChange={(collapsed: boolean) => {
                      setInitialState((preInitialState) => ({
                        ...preInitialState,
                        showtool: collapsed,
                      }));
                    }}
                  />
                )}
              </ConfigProvider>
            </KeepAlive>
          )} */}
          <ConfigProvider>
            {children}
            {!props.location?.pathname?.includes('/login') && (
              <SettingDrawer
                collapse={initialState?.showtool}
                disableUrlParams
                enableDarkTheme
                // hideHintAlert
                settings={initialState?.settings}
                onSettingChange={(settings) => {
                  setInitialState((preInitialState) => ({
                    ...preInitialState,
                    settings,
                  }));
                }}
                onCollapseChange={(collapsed: boolean) => {
                  setInitialState((preInitialState) => ({
                    ...preInitialState,
                    showtool: collapsed,
                  }));
                }}
              />
            )}
          </ConfigProvider>
        </>
      );
    },
    ...initialState?.settings,
  };
};
