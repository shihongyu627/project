import { BaseEdit } from '@/components/base';
// import { findIndexItems } from '@kafudev/ui-kit';
import { utils as formUtils } from '@/components/form';
import {
  sysDepartnoPageList,
  sysrolenoPageList,
  sysUseradd,
  sysUserData,
  sysUseredit,
} from '@/services/ant-design-pro/account';
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
      label: '姓名',
      name: 'realname',
      type: 'input',
      width: 'md',
      placeholder: '请输入真实姓名',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '账户类型',
      name: 'userIdentity',
      type: 'radio',
      options: [
        { label: '普通用户', value: 1 },
        { label: '主管', value: 2 },
      ],
      rules: [{ required: true, trigger: 'blur', type: 'number' }],
    },
    {
      label: '登录账号',
      name: 'username',
      type: 'input',
      width: 'md',
      placeholder: '请输入手机号',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '密码',
      name: 'password',
      type: 'password',
      placeholder: '请输入密码',
    },
    {
      label: '所属部门',
      name: 'selecteddeparts',
      type: 'treeselect',
      multiple: false,
      placeholder: '请选择所属部门',
      request: async function () {
        const result: any = await sysDepartnoPageList();
        const columnsArr: any[] = result.result;
        const res: any = [];
        columnsArr.map((item) => {
          const temp = {};
          temp.title = item.departName;
          temp.value = item.id;
          temp.children = item.children;
          res.push(temp);
        });
        return res;
      },
      dropList: [],
      // rules: [{ required: true, trigger: 'blur', type: 'treeselect' }],
      fieldProps: {
        multiple: false,
        allowClear: true,
        treeDefaultExpandAll: true,
        autoClearSearchValue: true,
        treeNodeFilterProp: 'title',
        showSearch: true,
        fieldNames: {
          label: 'title',
        },
      },
    },
    {
      label: '绑定角色',
      name: 'selectedrole',
      type: 'select',
      mode: 'multiple',
      placeholder: '请选择绑定角色',
      request: async function () {
        const result: any = await sysrolenoPageList();
        const columnsArr: any[] = result.result;
        const res: any = [];
        columnsArr.map((item) => {
          const temp = {
            label: item.roleName,
            value: item.id,
          };
          res.push(temp);
        });
        return res;
      },
      dropList: [],
      // rules: [{ required: true, trigger: 'blur', type: 'select' }],
    },
    {
      label: '备注',
      name: 'remark',
      type: 'textarea',
      width: 'md',
      placeholder: '请输入备注',
      // fieldProps: { maxLength: 100 },
      // rules: [{ type: 'string', max: 100, message: '超过最大长度' }],
    },
  ]);

  React.useEffect(() => {
    console.log('query', props?.location?.query);
  }, []);

  const initItems = (values: any) => {
    if (props.action === 'add') {
      values[3].rules = [{ required: true, trigger: 'blur' }];
    }
    if (props.action === 'edit') {
      values[3].hidden = true;
    }
    // if (props.action === 'edit') {
    //   values[3].disabled = true;
    // }
    // setItems(values);
  };

  const initForms = async (values: any) => {
    console.log('initForms:', values);
    if (props.action === 'edit') {
      const result: any = await sysUserData(props.id);
      const formresult = result?.result || {};
      const columnsArr = result?.result?.roleIds || '';
      if (columnsArr != '') {
        // console.log('columnsArr', columnsArr);
        const chars = columnsArr.split(',');
        formresult.selectedrole = chars || [];
      }
      // const chars = columnsArr.split(',');
      // formresult.selectedrole = chars || [];
      formresult.selecteddeparts = result?.result?.departIds || '';
      formresult.password = '';
      if (formresult.state === 4) {
        items[formUtils.findIndexItems('selecteddeparts', items)].hidden = true;
        items[formUtils.findIndexItems('selectedrole', items)].hidden = true;
      }
      setForms(formresult);
    }
  };

  // 表单提交
  const onSubmits = async (value: any) => {
    if (value.selectedrole) {
      // if (
      //   value.selectedrole.some((item: any) => item == '1169504891467464705') === true ||
      //   value.selectedrole.some((item: any) => item == '1260924539346472962') === true ||
      //   value.selectedrole.some((item: any) => item == '1536268081402228738') === true
      // ) {
      // value.state = 3;
      // }
      const str = value.selectedrole.join(',');
      value.selectedroles = str;
      delete value.selectedrole;
    }
    if (props.action === 'edit') {
      const res: any = await sysUseredit(value);
      if (res.code == 200) {
        page.closeModal();
        setTimeout(() => {
          history.go(0);
        }, 200);
      }
    }
    if (props.action === 'add') {
      const res: any = await sysUseradd(value);
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
    console.log('changeForms:', changedValues, values);
    if (values.selecteddeparts) {
    } else {
      forms.selecteddeparts = '';
      setForms(forms);
    }
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
      submitter={check('/isystem/user/commit') === false ? false : true}
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
