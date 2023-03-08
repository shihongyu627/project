import React from 'react';
import { BaseEdit } from '@/components/base';
import { utils as formUtils } from '@/components/form';
import { page } from '@/utils';
import { PjCarouselData, PjCarouseladd, PjCarouseledit } from '@/services/ant-design-pro/banner';
import loadimg from '@/utils/image';

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
      label: '广告名称',
      name: 'name',
      type: 'input',
      width: 'md',
      placeholder: '请输入广告名称',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '排序',
      name: 'sort',
      type: 'digit',
      rules: [{ required: true, trigger: 'blur', type: 'digit' }],
    },
    {
      label: '封面图',
      name: 'imgUrl',
      type: 'image',
      desc: '建议图片宽高尺寸比例700*700像素比例',
    },
    {
      label: '状态',
      name: 'state',
      type: 'radio',
      width: 'md',
      options: [
        { label: '上架', value: 1 },
        { label: '下架', value: 2 },
      ],
      rules: [{ required: true, trigger: 'blur', type: 'radio' }],
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
      const result: any = await PjCarouselData(props.id);
      const formresult = result.result;
      if (result.result.imgUrl) {
        const img_url: any[] = [];
        const aa = {
          url: loadimg(result.result.imgUrl),
        };
        img_url.push(aa);
        formresult.imgUrl = img_url;
      }
      if (result.result.imgUrl === '') {
        delete formresult.imgUrl;
      }
      setForms(formresult);
    }
  };
  // 表单提交
  const onSubmits = async (value: any) => {
    // console.log('PjCarouseledit:', value);
    if (value.imgUrl) {
      value.imgUrl = value.imgUrl[0]?.response?.result || value.imgUrl[0]?.url || '';
    }
    if (props.action === 'edit') {
      const res: any = await PjCarouseledit(value);
      if (res.code == 200) {
        page.closeModal();
        setTimeout(() => {
          history.go(0);
        }, 200);
      }
    }
    if (props.action === 'add') {
      const res: any = await PjCarouseladd(value);
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
      submitter={check('/ticket/picture/commit') === false ? false : true}
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
