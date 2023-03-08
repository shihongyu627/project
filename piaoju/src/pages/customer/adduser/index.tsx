import { PjClientedit, sysUseraddClient } from '@/services/ant-design-pro/customer';
import { BaseEdit, page } from '@kafudev/ui-kit';
import React from 'react';
import { history } from 'umi';

const Page: React.FC<any> = (props) => {
  const [forms] = React.useState<any>({
    username: props.name,
  });
  const [items] = React.useState<any>([
    { label: '基本信息', desc: '表单的基本信息', type: 'header' },
    {
      label: '账号',
      name: 'username',
      type: 'input',
      placeholder: '请输入账号',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '密码',
      name: 'password',
      type: 'password',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '备注',
      name: 'remark',
      type: 'textarea',
      placeholder: '请输入备注',
    },
  ]);

  React.useEffect(() => {
    // console.log('query', props?.location?.query);
  }, [props?.location?.query]);

  // 表单提交
  const onSubmit = async (value: any) => {
    if (props.action === 'add') {
      // console.log('onSubmit:', value);
      value.realname = props.name;
      value.username = props.name;
      value.clientId = props.id;
      value.state = 4;
      const res: any = await sysUseraddClient(value);
      // console.log('onSubmit:', res);
      if (res.code == 200) {
        const data = {
          id: props.id,
          isFound: 1,
        };
        const xx: any = await PjClientedit(data);
        console.log('onSubmit:', xx);
        page.closeModal();
        setTimeout(() => {
          history.go(0);
        }, 200);
      }
    }
  };
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
    <BaseEdit
      {...props}
      mode={props.mode}
      action={props.action || props?.location?.query?.action}
      items={items}
      values={forms}
      submitter={
        check('/ticket/client/user/commit') === false
          ? {
              render() {
                return [];
              },
            }
          : {}
      }
      onSubmit={onSubmit}
    />
  );
};

export default Page;
