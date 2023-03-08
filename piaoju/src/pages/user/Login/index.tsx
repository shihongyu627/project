/* eslint-disable react/jsx-key */
import Footer from '@/components/footerlogin';
import {
  login,
  loginlist,
  permission,
  PjFirmadd,
  tencentOcrsms,
  pjRule,
} from '@/services/ant-design-pro/api';
import loadimg from '@/utils/image';
import { LockOutlined, NumberOutlined, UserOutlined } from '@ant-design/icons';
import ProForm, { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-form';
import {
  Alert,
  Button,
  Carousel,
  Col,
  message,
  Row,
  //  Tabs
} from 'antd';
import React, { useEffect, useState } from 'react';
import { getIntl, useModel } from 'umi';
import logo from '../../../../public/icons/logo.jpg';

import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [total, setListTotal] = useState<any>([]); //轮播图数据

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    // console.log(857857, await initialState?.fetchUserInfo?.());
    if (userInfo) {
      // @ts-ignore
      await setInitialState((s: object) => ({
        ...s,
        currentUser: userInfo,
      }));
      // console.log(857857, userInfo);
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg: any = await login({ ...values, type });
      if (msg.code === 200) {
        const userInfo: string = JSON.stringify(msg.result.userInfo);
        localStorage.setItem('token', msg.result.token);
        localStorage.setItem('userInfo', userInfo);
        const meuns: any = await permission({});
        if (meuns.code === 0) {
          const auth: any = [];
          meuns.result.all.map((item: any) => {
            const kk: any = {};
            kk.name = item.name;
            kk.url = item.url;
            auth.push(kk);
          });
          const auths: string = JSON.stringify(auth);
          localStorage.setItem('auths', auths);
          localStorage.setItem('tagsArr', JSON.stringify([]));
          localStorage.setItem('loginType', JSON.stringify('SaaS'));
        }
        message.success(msg.message || msg.msg || '登录成功');
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        // const { query } = history.location;
        // const { redirect } = query as { redirect: string };
        const rule: any = await pjRule();
        const datarule = JSON.stringify(rule.result);
        localStorage.setItem('rule', datarule);
        const columnsArr = `${localStorage.getItem('auths')}`;
        const datas = JSON.parse(columnsArr);
        const firsturl: any = {};
        firsturl.url = '/welcome';
        if (!datas) {
          firsturl.url = '/welcome';
        } else if (datas.some((item: any) => item.url == '/dashboard/analysis') === true) {
          firsturl.url = '/welcome';
        } else if (datas.some((item: any) => item.url == '/ticket/tenant') === true) {
          firsturl.url = '/system/tenant';
        } else if (datas.some((item: any) => item.url == '/ticket/client') === true) {
          firsturl.url = '/customer';
        } else if (datas.some((item: any) => item.url == '/ticket/order') === true) {
          firsturl.url = '/order';
        } else if (datas.some((item: any) => item.url == '/statistics') === true) {
          firsturl.url = '/statistics';
        } else if (datas.some((item: any) => item.url == '/ticket/message') === true) {
          firsturl.url = '/message';
        } else if (datas.some((item: any) => item.url == '/ticket/log') === true) {
          if (datas.some((item: any) => item.url == '/ticket/log/scan') === true) {
            firsturl.url = '/record/identification';
          } else if (datas.some((item: any) => item.url == '/ticket/log/recharge') === true) {
            firsturl.url = '/record/recharge';
          }
        } else if (datas.some((item: any) => item.url == '/isystem') === true) {
          if (datas.some((item: any) => item.url == '/ticket/picture') === true) {
            firsturl.url = '/system/banner';
          } else if (datas.some((item: any) => item.url == '/ticket/exchangeRate') === true) {
            firsturl.url = '/system/exchangerate';
          } else if (datas.some((item: any) => item.url == '/isystem/depart') === true) {
            firsturl.url = '/system/department';
          } else if (datas.some((item: any) => item.url == '/ticket/combo') === true) {
            firsturl.url = '/setmeal';
          } else if (datas.some((item: any) => item.url == '/isystem/user') === true) {
            firsturl.url = '/system/account';
          } else if (datas.some((item: any) => item.url == '/isystem/roleUserList') === true) {
            firsturl.url = '/system/rule';
          } else if (datas.some((item: any) => item.url == '/ticket/firm') === true) {
            firsturl.url = '/trial';
          } else if (datas.some((item: any) => item.url == '/ticket/configuration') === true) {
            firsturl.url = '/system/configuration';
          } else if (datas.some((item: any) => item.url == '/ticket/contract/model') === true) {
            firsturl.url = '/system/contractmodel';
          }
        }
        // history?.push(firsturl.url);
        // 解决白屏跳转方式
        window.location.replace(firsturl.url);
        return;
      }
      message.error(msg.message || msg.msg || '登录失败');
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error: any) {
      console.log('登录错误 err:', error);
      message.error(error?.message || '登录失败，请重试！');
    }
  };
  const { status, type: loginType } = userLoginState;
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    _loginlist();
  }, []);
  const _tenantNo = () => {
    const url = document.location.toString();
    if (url.indexOf('?') != -1) {
      const arrUrl = url.split('?');
      const para: any = arrUrl[1];
      const id = para.split('=');
      const tenantNoid = id[1];
      return tenantNoid;
    } else {
      const tenantNoid = '';
      return tenantNoid;
    }
    // settenantNo(tenantNoid);
  };
  const _loginlist = async () => {
    try {
      const res: any = await loginlist({});
      if (res.code == 200) {
        const result = res.result;
        // console.log(result);
        setListTotal(result);
        // console.log(857857, total);
      } else {
        // const urlinfo: any = [];
        // console.log(urlinfo);
        message.error(res.msg || '请求错误');
      }
    } catch (error) {}
  };
  const handleSubmits = async (values: API.LoginParams) => {
    try {
      // 登录
      const result: any = await PjFirmadd({ ...values });
      if (result.code === 200) {
        message.success('申请成功！');
        setType('account');
        return;
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('操作失败');
    }
  };
  return (
    <div className={styles.container}>
      {type === 'account' && (
        <Row className={styles.contentrow}>
          <Col span={10} offset={2}>
            <div className={styles.contentStyle}>
              {total && total.length > 0 ? (
                <Carousel autoplay>
                  {total.map((item: any, ii: number) => (
                    <div key={ii} className={styles.contentStyle1}>
                      {<img className={styles.contentStyle2} src={loadimg(item.imgUrl)} />}
                    </div>
                  ))}
                </Carousel>
              ) : (
                <Carousel>
                  <div key="ii1" className={styles.contentStyle1}>
                    <img className={styles.contentStyle2} />
                  </div>
                </Carousel>
              )}
              <Button
                className={styles.contentButton}
                // type="primary"
                size="middle"
                onClick={() => {
                  setType('mobile');
                }}
              >
                申请试用
              </Button>
            </div>
          </Col>
          <Col span={10} className={styles.contents}>
            <div className={styles.content}>
              <LoginForm
                logo={<img className={styles.imgStyle} alt="logo" src={logo} />}
                title={
                  <div className={styles.titleStyle}>
                    {/* <div className={styles.titleStyle1}>链境</div> */}
                    <div className={styles.titleStyle2}>链境退税管理系统</div>
                  </div>
                }
                // title="链境退税管理系统"
                // subTitle="退税管理系统"
                initialValues={{
                  autoLogin: true,
                  tenantNo: _tenantNo(),
                }}
                actions={[]}
                onFinish={async (values) => {
                  await handleSubmit(values as API.LoginParams);
                }}
                submitter={{
                  searchConfig: {
                    submitText: getIntl().formatMessage({
                      id: 'pages.login.submit',
                      defaultMessage: 'pages.login.submit',
                    }),
                  },
                  submitButtonProps: {
                    size: 'middle',
                    style: {
                      width: '200px',
                      position: 'relative',
                      float: 'left',
                      background: '#0066CC',
                      borderColor: '#0066CC',
                    },
                  },
                }}
              >
                {/* <Tabs activeKey={type} onChange={setType}>
                  <Tabs.TabPane key="account" tab={'账户密码登录'} />
                </Tabs> */}
                {status === 'error' && loginType === 'account' && (
                  <LoginMessage content={'账户或密码错误'} />
                )}
                <>
                  <ProFormText
                    name="tenantNo"
                    label="企业编码"
                    fieldProps={{
                      size: 'large',
                      prefix: <NumberOutlined className={styles.prefixIcon} />,
                    }}
                    placeholder={'请输入企业编码'}
                  />
                  <ProFormText
                    name="username"
                    label="用户名"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined className={styles.prefixIcon} />,
                    }}
                    placeholder={'请输入用户名'}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: '请输入用户名',
                    //   },
                    // ]}
                  />
                  <ProFormText.Password
                    label="密码"
                    name="password"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined className={styles.prefixIcon} />,
                    }}
                    placeholder={'请输入密码'}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: '请输入密码！',
                    //   },
                    // ]}
                  />
                </>
              </LoginForm>
            </div>
            <div className={styles.Footer}>
              <Footer />
              <div className={styles.beian}>
                <a
                  target="_blank"
                  href="https://beian.miit.gov.cn/?token=0a6d3619-0cfb-4d67-9d8a-2b7f619f102a#/Integrated/index"
                  rel="noreferrer"
                >
                  <div className={styles.beian}>备案号：浙ICP备2022019988号</div>
                </a>
              </div>
            </div>
          </Col>
        </Row>
      )}
      {type === 'mobile' && (
        <Row className={styles.contentTryall1}>
          <Col span={20} offset={2}>
            <div className={styles.contentTryall}>
              <Button
                className={styles.contentButtonback}
                type="text"
                size="large"
                onClick={() => {
                  setType('account');
                }}
              >
                返回登录页﹥
              </Button>
              <Row justify="center">
                <Col span={8} xxl={9} xl={11} lg={14} md={18} sm={24} xs={24}>
                  <div className={styles.contentTry}>
                    <h1 className={styles.contentTryh1}>填写资料</h1>
                    <ProForm<{
                      names: string;
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
                            <Row justify={'center'}>
                              <Col style={{ marginRight: '8px' }}>
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  className={styles.contentButtonTry}
                                >
                                  申请试用
                                </Button>
                              </Col>
                            </Row>
                          );
                        },
                      }}
                      onFinish={async (values) => {
                        await handleSubmits(values as API.LoginParams);
                      }}
                      params={{}}
                      request={async () => {
                        // await waitTime(100);
                        return {
                          names: '蚂蚁设计有限公司',
                          useMode: 'chapter',
                        };
                      }}
                    >
                      <ProFormText
                        width="md"
                        name="name"
                        label="企业名称"
                        placeholder={'请输入企业名称'}
                        rules={[{ required: true, message: '请输入企业名称' }]}
                      />
                      <ProFormText
                        width="md"
                        name="business"
                        label="主营业务"
                        placeholder={'请输入主营业务'}
                        rules={[{ required: true, message: '请输入主营业务' }]}
                      />
                      <ProFormText
                        name="contac"
                        label="联系人"
                        width="md"
                        placeholder={'请输入联系人'}
                        rules={[{ required: true, message: '请输入联系人' }]}
                      />
                      <ProFormText
                        width="md"
                        name="address"
                        label="公司地址"
                        placeholder={'详细地址'}
                        rules={[{ required: true, message: '请输入详细地址' }]}
                      />
                      <ProFormText
                        width="md"
                        name="phone"
                        label="手机号"
                        rules={[
                          {
                            required: true,
                            message: '请输入手机号！',
                          },
                          {
                            pattern: /^1\d{10}$/,
                            message: '手机号格式错误！',
                          },
                        ]}
                        placeholder={'请输入手机号'}
                      />
                      <ProFormCaptcha
                        label="验证码"
                        fieldProps={{
                          size: 'middle',
                          style: { width: '328PX' },
                          prefix: <LockOutlined className={'prefixIcon'} />,
                        }}
                        captchaProps={{
                          size: 'middle',
                          type: 'primary',
                        }}
                        placeholder={'请输入验证码'}
                        captchaTextRender={(timing, count) => {
                          if (timing) {
                            return `${count} ${'获取验证码'}`;
                          }
                          return '获取验证码';
                        }}
                        phoneName="phone"
                        name="code"
                        rules={[
                          {
                            required: true,
                            message: '请输入验证码！',
                          },
                        ]}
                        onGetCaptcha={async (phone) => {
                          const dataphone: any = {};
                          dataphone.phone = phone;
                          const res: any = await tencentOcrsms(dataphone);
                          if (res?.code === 200) {
                            message.success(`手机号${phone}验证码` + res.message);
                          } else {
                            message.error(res.message);
                          }
                        }}
                      />
                    </ProForm>
                  </div>
                  {/* <div className={styles.Footers}>
                    <Footer />
                  </div> */}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Login;
