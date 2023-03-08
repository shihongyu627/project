import React from 'react';
import { BaseEdit } from '@/components/base';
import { utils as formUtils } from '@/components/form';
import { configuration, configurationedit } from '@/services/ant-design-pro/configuration';

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
      label: '邮箱开关',
      name: 'email',
      type: 'radio',
      options: [
        { label: '关', value: 'OFF' },
        { label: '开', value: 'ON' },
      ],
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '换汇成本预警最小值',
      name: 'minNum',
      type: 'digit',
    },
    {
      label: '换汇成本预警最大值',
      name: 'maxNum',
      type: 'digit',
    },
  ]);
  //路由校验及获取
  const urlDatas = `${localStorage.getItem('auths')}`;
  const urlData = JSON.parse(urlDatas);
  const check = (url: any) => {
    if (!urlData) {
      return false;
    }
    return urlData.some((item: any) => item.url == url);
  };

  React.useEffect(() => {
    // console.log('query', props?.location?.query);
    if (check('/ticket/configuration/email') === false) {
      items[formUtils.findIndexItems('email', items)].type = 'empty';
      setItems([...items]);
    } else {
      items[formUtils.findIndexItems('email', items)].type = 'radio';
      setItems([...items]);
    }
    if (check('/ticket/configuration/exchange') === false) {
      items[formUtils.findIndexItems('minNum', items)].type = 'empty';
      items[formUtils.findIndexItems('maxNum', items)].type = 'empty';
      setItems([...items]);
    } else {
      items[formUtils.findIndexItems('minNum', items)].type = 'digit';
      items[formUtils.findIndexItems('maxNum', items)].type = 'digit';
      setItems([...items]);
    }
  }, [props?.location?.query]);

  const initItems = (values: any) => {
    console.log('initItems:', values);
    // setItems(values);
  };

  const initForms = async (values: any) => {
    console.log('initForms:', values);
    const result: any = await configuration();
    const formresult = result.result;
    console.log('initForms:', formresult);
    setForms(formresult);
    // /admin/ticket/configuration/configuration
    // setForms(values);
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

  // 表单提交
  const onSubmit = async (values: any) => {
    // console.log('Page onSubmit:', values);
    const dd: any = {};
    dd.state = values.email;
    const res: any = await configurationedit(dd);
    console.log('Page onSubmit:', res);
  };

  return (
    <BaseEdit
      mode={props.mode}
      rowCol={rowCol}
      fixedSubmit={props.fixedSubmit}
      submitTarget={props.submitTarget}
      formLayoutType={formLayoutType}
      action={props.action || props?.location?.query?.action}
      items={items}
      forms={forms}
      initItems={initItems}
      initForms={initForms}
      changeForms={changeForms}
      onSubmits={onSubmit}
    />
  );
};

export default Page;
