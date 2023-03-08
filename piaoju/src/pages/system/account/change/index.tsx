import { BaseEdit } from '@/components/base';
// import { findIndexItems } from '@kafudev/ui-kit';
import { utils as formUtils } from '@/components/form';
import {
  pjTenantnoPageList,
  usercheckTenant,
  sysUserData,
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
      label: '租户',
      name: 'tenantId',
      type: 'select',
      width: 'md',
      request: async function () {
        const result: any = await pjTenantnoPageList();
        const columnsArr: any[] = result.result;
        const res: any = [];
        columnsArr.map((item) => {
          const temp = {
            label: item.name,
            value: item.id,
          };
          res.push(temp);
        });
        return res;
      },
      dropList: [],
      placeholder: '请选择租户',
    },
  ]);

  React.useEffect(() => {
    console.log('query', props?.location?.query);
  }, []);

  const initItems = (values: any) => {
    if (props.action === 'add') {
      values[3].rules = [{ required: true, trigger: 'blur' }];
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
      setForms(formresult);
    }
  };

  // 表单提交
  const onSubmits = async (value: any) => {
    const dd: any = {};
    dd.tenantId = value.tenantId;
    dd.userId = value.id;
    if (props.action === 'edit') {
      const res: any = await usercheckTenant(dd);
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

  return (
    <BaseEdit
      mode={props.mode}
      rowCol={rowCol}
      fixedSubmit={props.fixedSubmit}
      submitTarget={props.submitTarget}
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
