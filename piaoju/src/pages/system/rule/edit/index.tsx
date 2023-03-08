import React from 'react';
import { BaseEdit } from '@/components/base';
// import { findIndexItems } from '@kafudev/ui-kit';
import { utils as formUtils } from '@/components/form';
import {
  sysRoleTreeList,
  sysRoleedit,
  sysRoleadd,
  sysRoleData,
  sysRoleRolePermission,
} from '@/services/ant-design-pro/rule';
import { history } from 'umi';

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
      label: '角色名称',
      name: 'roleName',
      type: 'input',
      width: 'md',
      placeholder: '请输入角色',
      rules: [{ required: true, trigger: 'blur' }],
    },
    // {
    //   label: '角色编码',
    //   name: 'roleCode',
    //   type: 'input',
    //   width: 'md',
    //   placeholder: '请输入角色编码',
    //   desc: '111',
    //   rules: [{ required: true, trigger: 'blur' }],
    // },
    {
      label: '权限',
      name: 'permissionIdall',
      type: 'treeselect',
      width: 330,
      request: async function () {
        const result: any = await sysRoleTreeList();
        const columnsArr: any[] = result.result.treeList;
        const res: any = [];
        columnsArr.map((item) => {
          const temp = {};
          temp['title'] = item.slotTitle;
          temp['value'] = item.value;
          temp['children'] = item.children;
          res.push(temp);
        });
        return res;
      },
      dropList: [],
      placeholder: '请选择权限',
      fieldProps: {
        showArrow: false,
        filterTreeNode: true,
        showSearch: true,
        dropdownMatchSelectWidth: false,
        labelInValue: true,
        autoClearSearchValue: true,
        multiple: true,
        treeCheckable: true,
        treeNodeFilterProp: 'title',
        treeCheckStrictly: true,
        treeDefaultExpandAll: true,
        fieldNames: {
          label: 'title',
        },
      },
    },
    // <Button> 直接渲染组件</Button>,
  ]);

  React.useEffect(() => {
    console.log('query', props?.location?.query);
    // if (props?.location?.query.action === 'edit') {
    //   items[findIndexItems('roleCode', items)].disabled = 'disabled';
    // }
  }, [props?.location?.query]);

  const initItems = (values: any) => {
    console.log('initItems:', values);
    // setItems(values);
  };

  const initForms = async (values: any) => {
    console.log('initForms:', values);
    if (props?.location?.query.action === 'edit') {
      const result: any = await sysRoleData(props?.location?.query.id);
      const result2: any = await sysRoleRolePermission(props?.location?.query.id);
      const formresult = result.result;
      const columnsArr: any[] = result2.result;
      const res: any = [];
      columnsArr.map((item) => {
        const temp = {};
        temp['value'] = item;
        res.push(temp);
      });
      formresult.permissionIdall = res;
      formresult.lastpermissionIds = res;
      // console.log('initFormsformresult:', formresult);
      setForms(formresult);
    }
    // setForms(values);
  };
  // 表单提交
  const onSubmits = async (value: any) => {
    if (value.permissionIdall) {
      const str = value.permissionIdall
        .map(function (elem: { value: any }) {
          return elem.value;
        })
        .join(',');
      value.permissionIds = str;
      delete value.permissionIdall;
    }
    if (props?.location?.query.action === 'edit') {
      const str = forms.lastpermissionIds
        .map(function (elem: { value: any }) {
          return elem.value;
        })
        .join(',');
      value.lastpermissionIds = str;
      const res: any = await sysRoleedit(value);
      if (res.code == 200) {
        history.go(-1);
      }
    }
    if (props?.location?.query.action === 'add') {
      const res: any = await sysRoleadd(value);
      if (res.code == 200) {
        history.go(-1);
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
      submitter={check('/isystem/role/commit') === false ? false : true}
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
