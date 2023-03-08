import { sysUseraddClient } from '@/services/ant-design-pro/customer';
import { PjFirmedit } from '@/services/ant-design-pro/firm';
import { BaseEdit, page } from '@kafudev/ui-kit';
import React from 'react';
// import { history } from 'umi';

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
    console.log('query', props?.location?.query);
  }, [props?.location?.query]);

  // 表单提交
  const onSubmit = async (value: any) => {
    if (props.action === 'add') {
      value.realname = props.name;
      value.username = props.name;
      value.clientId = props.id;
      value.state = 2;
      const res: any = await sysUseraddClient(value);
      if (res.code == 200) {
        const data = {
          id: props.id,
          is_found: 1,
        };
        const xx: any = await PjFirmedit(data);
        console.log('onSubmit:', xx);
        page.closeModal();
        setTimeout(() => {
          // history.go(0);
        }, 200);
      }
    }
  };

  return (
    <BaseEdit
      {...props}
      mode={props.mode}
      action={props.action || props?.location?.query?.action}
      items={items}
      values={forms}
      onSubmit={onSubmit}
    />
  );
};

export default Page;
