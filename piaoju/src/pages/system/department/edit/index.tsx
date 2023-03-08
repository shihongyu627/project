import React from 'react';
import { BaseEdit } from '@/components/base';
import { utils as formUtils } from '@/components/form';
import {
  sysDepartadd,
  sysDepartedit,
  sysDepartnoPageList,
  sysDepartData,
  // pjUserNoPageList,
} from '@/services/ant-design-pro/department';
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
      label: '上级部门',
      name: 'parentId',
      type: 'select',
      width: 'md',
      request: async function () {
        const result: any = await sysDepartnoPageList();
        const columnsArr: any[] = result.result;
        const res: any = [];
        columnsArr.map((item) => {
          const temp = {
            label: item.departName,
            value: item.id,
          };
          res.push(temp);
        });
        return res;
      },
      dropList: [],
      placeholder: '请输入上级部门',
    },
    {
      label: '部门名称',
      name: 'departName',
      type: 'input',
      width: 'md',
      placeholder: '请输入部门名称',
      rules: [{ required: true, trigger: 'blur' }],
    },
    // {
    //   label: '部门负责人',
    //   name: 'directorId',
    //   type: 'select',
    //   width: 330,
    //   request: async function () {
    //     const result: any = await pjUserNoPageList();
    //     const columnsArr: any[] = result.result;
    //     const res: any = [];
    //     columnsArr.map((item) => {
    //       const temp = {
    //         label: item.realname,
    //         value: item.id,
    //       };
    //       res.push(temp);
    //     });
    //     return res;
    //   },
    //   placeholder: '请选择部门负责人',
    // },
    // <Button> 直接渲染组件</Button>,
  ]);

  React.useEffect(() => {
    if (props.action === 'addchildren') {
      const formresult = { parentId: props.id };
      setForms(formresult);
    }
  }, [props?.location?.query]);

  const initItems = (values: any) => {
    console.log('initItems:', values);
    // setItems(values);
  };

  const initForms = async (values: any) => {
    console.log('initForms:', values);
    if (props.action === 'edit') {
      const result: any = await sysDepartData(props.id);
      const formresult = result.result;
      // console.log('initFormsformresult:', formresult);
      setForms(formresult);
    }
    // setForms(values);
  };
  // 表单提交
  const onSubmits = async (value: any) => {
    if (props.action === 'edit') {
      const res: any = await sysDepartedit(value);
      if (res.code == 200) {
        page.closeModal();
        setTimeout(() => {
          history.go(0);
        }, 200);
      }
    }
    if (props.action === 'add' || props.action === 'addchildren') {
      const res: any = await sysDepartadd(value);
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
    // if (values.directorId) {
    // } else {
    //   forms.directorId = '';
    //   setForms(forms);
    // }
    if (values.parentId) {
    } else {
      forms.parentId = '';
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
      submitter={check('/isystem/depart/commit') === false ? false : true}
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
