import React from 'react';
import { BaseEdit } from '@/components/base';
import { utils as formUtils } from '@/components/form';
import { PjComboData, PjComboupdate } from '@/services/ant-design-pro/setmeal';
import { page } from '@/utils';

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
      label: '套餐名称',
      name: 'name',
      type: 'input',
      width: 'md',
      placeholder: '请输入套餐名称',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '套餐类型',
      name: 'comboType',
      type: 'select',
      width: 'md',
      disabled: 'disabled',
      dropList: [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'A+B', value: 'A+B' },
      ],
      placeholder: '请选择套餐',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '结算方式',
      name: 'closing',
      type: 'radio',
      width: 'md',
      options: [
        { label: '月结', value: 1 },
        // { label: '季结', value: 2 },
        // { label: '年结', value: 3 },
      ],
      rules: [{ required: true, trigger: 'blur', type: 'number' }],
    },
    {
      label: '备注',
      name: 'remark',
      type: 'textarea',
      width: 'md',
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

  const initForms = async () => {
    const result: any = await PjComboData(props.id);
    const formresult = result.result;
    setForms(formresult);
  };
  // 表单提交
  const onSubmits = async (value: any) => {
    const res: any = await PjComboupdate(value);
    if (res.code == 200) {
      page.closeModal();
      setTimeout(() => {
        history.go(0);
      }, 200);
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
      submitter={check('/ticket/combo/commit') === false ? false : true}
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
