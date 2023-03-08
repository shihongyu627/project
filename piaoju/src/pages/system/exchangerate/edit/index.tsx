import { BaseEdit } from '@/components/base';
import { utils as formUtils } from '@/components/form';
import {
  PjExchangeRateadd,
  PjExchangeRateData,
  PjExchangeRateedit,
} from '@/services/ant-design-pro/exchangerate';
import { page } from '@/utils';
import moment from 'moment';
import React from 'react';
// import { history } from 'umi';

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
      label: '月份',
      name: 'mouth',
      type: 'dateMonth',
      width: 'md',
      rules: [{ required: true, trigger: 'blur', type: 'date' }],
    },
    {
      label: '汇率',
      name: 'exchange',
      type: 'input',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '币种',
      name: 'currency',
      type: 'select',
      width: 'md',
      dropList: [
        { label: 'USD', value: 'USD' },
        // { label: 'RMB', value: 'RMB' },
        // { label: 'RUB', value: 'RUB' },
        // { label: 'HKD', value: 'HKD' },
      ],
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
      const result: any = await PjExchangeRateData(props.id);
      const formresult = result.result;
      setForms(formresult);
    }
  };
  const onSubmits = async (value: any) => {
    if (value.mouth) {
      const time = moment(value.mouth).format('YYYY-MM');
      value.mouth = time;
    }
    if (props.action === 'edit') {
      const res: any = await PjExchangeRateedit(value);
      if (res.code == 200) {
        page.closeModal();
        setTimeout(() => {
          history.go(0);
        }, 200);
      }
    }
    if (props.action === 'add') {
      const res: any = await PjExchangeRateadd(value);
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
      submitter={check('/ticket/exchangeRate/commit') === false ? false : true}
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
