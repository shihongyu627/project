import { BaseEdit } from '@/components/base';
// import { findIndexItems } from '@kafudev/ui-kit';
import { utils as formUtils } from '@/components/form';
import { sysUseredit } from '@/services/ant-design-pro/account';
import { useraddTenant, selectDetails } from '@/services/ant-design-pro/tenant';
import { page } from '@/utils';
import React from 'react';

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
      label: '用户姓名',
      name: 'realname',
      type: 'input',
      placeholder: '请输入用户姓名',
      rules: [{ required: true, trigger: 'blur' }],
    },
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
    // {
    //   label: '用户类型',
    //   name: 'state',
    //   type: 'select',
    //   width: 'md',
    //   dropList: [
    //     { label: '租户管理用户', value: 0 },
    //     { label: '租户客服用户', value: 3 },
    //   ],
    //   rules: [{ required: true, trigger: 'blur', type: 'select' }],
    // },
    {
      label: '备注',
      name: 'remark',
      type: 'textarea',
      placeholder: '请输入备注',
    },
  ]);

  React.useEffect(() => {
    console.log('query', props?.location?.query);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getData(props.id);
  }, []);
  const getData = async (id: any) => {
    if (id) {
      const result: any = await selectDetails(id);
      // console.log('initFormsresult:', result);
      if (result.result) {
        const formresult = result.result;
        formresult.password = '';
        setForms(formresult);
      } else {
        const formresult: any = {};
        formresult.password = '';
        setForms(formresult);
      }
    }
  };
  const initItems = (values: any) => {
    console.log('initItems:', values);
    // if (props.action === 'add') {
    //   values[3].rules = [{ required: true, trigger: 'blur' }];
    // }
    // if (props.action === 'edit') {
    //   values[3].disabled = true;
    //   values[2].disabled = true;
    // }
    // setItems(values);
  };

  const initForms = async (values: any) => {
    console.log('initForms:', values);
  };

  // 表单提交
  const onSubmits = async (value: any) => {
    if (value.id) {
      const res: any = await sysUseredit(value);
      if (res.code == 200) {
        page.closeModal();
        setTimeout(() => {
          history.go(0);
        }, 200);
      }
      // console.log('onSubmit:', value);
    } else {
      value.tenantId = props.id;
      value.tenantName = props.name;
      value.state = 0;
      const res: any = await useraddTenant(value);
      // console.log('onSubmit:', res);
      if (res.code == 200) {
        page.closeModal();
        setTimeout(() => {
          history.go(0);
        }, 200);
      }
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
      submitter={check('/ticket/tenant/user/commit') === false ? false : true}
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
