import { Button, Result } from 'antd';
import React from 'react';
// import { history } from 'umi';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button
        type="primary"
        onClick={() => {
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
          window.location.replace(firsturl.url);
          // history.go(-1)
        }}
      >
        回到主页
      </Button>
    }
  />
);

export default NoFoundPage;
