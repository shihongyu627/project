import React from 'react';
import { BaseEdit } from '@/components/base';
import { utils as formUtils } from '@/components/form';
import { page } from '@/utils';
import { message } from 'antd';
import { updatePassword } from '@/services/ant-design-pro/account';

const Page: React.FC<any> = (props) => {
  const [formLayoutType, setFormLayoutType] = React.useState<'horizontal' | 'vertical' | 'inline'>(
    'horizontal',
  );
  const [rowCol, setRowCol] = React.useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [forms, setForms] = React.useState<any>({});
  const [items, setItems] = React.useState<any>([
    { label: '基本信息', desc: '表单的基本信息', type: 'header' },
    {
      label: '新密码',
      name: 'newPassword',
      type: 'password',
      width: 'xs',
      placeholder: '请输入新密码',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '确认密码',
      name: 'confirmPassword',
      type: 'password',
      width: 'xs',
      placeholder: '请确认密码',
      rules: [{ required: true, trigger: 'blur' }],
    },
    // <Button> 直接渲染组件</Button>,
  ]);

  React.useEffect(() => {
    console.log('query', props?.location?.query);
  }, [props?.location?.query]);

  const initItems = (values: any) => {
    console.log('initItems:', values);
    // setItems(values);
  };

  const initForms = async (values: any) => {
    console.log('initForms:', values);
    // setForms(values);
  };

  // 表单提交
  const onSubmits = async (value: any) => {
    if (value.newPassword === value.confirmPassword) {
      if (props.action === 'change') {
        value.id = props.id;
        value.username = props.username;
        const res: any = await updatePassword(value);
        if (res.code == 200) {
          page.closeModal();
          setTimeout(() => {
            history.go(0);
          }, 200);
        }
      }
    } else {
      message.error('两次密码不一致');
    }
  };
  // 表单字段变化
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changeForms = (changedValues: any, values: any) => {
    // console.log('changeForms:', changedValues, values);
    for (const key in changedValues) {
      if (Object.prototype.hasOwnProperty.call(changedValues, key)) {
        const value = changedValues[key];
        switch (key) {
          case 'type':
            setFormLayoutType(value);
            break;
          case 'rowCol':
            setRowCol(rowCol == 1 ? 2 : 1);
            break;
          case 'listtype':
            if (value == true) {
              items[formUtils.findIndexItems('list', items)].showType = 'card';
              setItems([...items]);
            } else {
              items[formUtils.findIndexItems('list', items)].showType = '';
              setItems([...items]);
            }
            break;
          case 'status':
            if (value == true) {
              items[formUtils.findIndexItems('extra', items)].type = 'empty';
              setItems([...items]);
            } else {
              items[formUtils.findIndexItems('extra', items)].type = 'input';
              setItems([...items]);
            }
            break;
          default:
            break;
        }
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
      mode={props.mode}
      rowCol={rowCol}
      fixedSubmit={props.fixedSubmit}
      submitTarget={props.submitTarget}
      submitter={check('/isystem/user/reset/commit') === false ? false : true}
      getSubmitDom={props.getSubmitDom}
      formLayoutType={formLayoutType}
      action={props.action || props?.location?.query?.action}
      items={items}
      forms={forms}
      initItems={initItems}
      initForms={initForms}
      changeForms={changeForms}
      onSubmits={onSubmits}
    />
  );
};

export default Page;
