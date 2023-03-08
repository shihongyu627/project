import React from 'react';
import { BaseEdit } from '@/components/base';
import { utils as formUtils } from '@/components/form';
import { PjFirmData, PjFirmedit } from '@/services/ant-design-pro/firm';
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
      label: '企业名称',
      name: 'name',
      type: 'input',
      width: 'md',
      placeholder: '请输入企业名称',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '主营业务',
      name: 'business',
      type: 'textarea',
      width: 'md',
    },
    {
      label: '联系人',
      name: 'contac',
      type: 'input',
      width: 'md',
      placeholder: '请输入联系人',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '联系方式',
      name: 'phone',
      type: 'input',
      width: 'md',
      placeholder: '请输入联系方式',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '地址',
      name: 'address',
      type: 'input',
      width: 'md',
      placeholder: '请输入联系方式',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '状态',
      name: 'state',
      type: 'select',
      width: 'md',
      dropList: [
        { label: '待跟进', value: 1 },
        { label: '已跟进', value: 2 },
      ],
      rules: [{ required: true, trigger: 'blur', type: 'select' }],
    },
    {
      label: '文本备注',
      name: 'remark',
      type: 'textarea',
      width: 'md',
      // fieldProps: { maxLength: 100 },
      // rules: [{ type: 'string', max: 100, message: '超过最大长度' }],
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
    if (props.action === 'edit') {
      const result: any = await PjFirmData(props.id);
      const formresult = result.result;
      setForms(formresult);
    }
  };
  // 表单提交
  const onSubmits = async (value: any) => {
    if (value.selectedrole) {
      const str = value.selectedrole.join(',');
      value.selectedroles = str;
      delete value.selectedrole;
    }
    if (props.action === 'edit') {
      const res: any = await PjFirmedit(value);
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
      submitter={check('/ticket/firm/commit') === false ? false : true}
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
