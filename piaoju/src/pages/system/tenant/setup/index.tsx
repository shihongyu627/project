// import { BaseEdit, page } from '@kafudev/ui-kit';
import { BaseEdit } from '@/components/base';
import type { ReactNode } from 'react';
import { utils as formUtils } from '@/components/form';
import React from 'react';
// import { history } from 'umi';
import { pjTenantcheckNum, pjRechargeLognoPagelist } from '@/services/ant-design-pro/tenant';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { page } from '@/utils';

const Page: React.FC<any> = (props) => {
  const [formLayoutType, setFormLayoutType] = React.useState<'horizontal' | 'vertical' | 'inline'>(
    'horizontal',
  );
  const [rowCol, setRowCol] = React.useState<number>(1);

  const [data, setData] = React.useState<DataType[]>([]);
  const [forms, setForms] = React.useState<any>({});
  const [items, setItems] = React.useState<any>([
    { label: '基本信息', desc: '表单的基本信息', type: 'header' },
    {
      label: '调整数',
      name: 'num',
      type: 'digit',
      fieldProps: {
        min: -100,
      },
      placeholder: '请输入',
      desc: '输入负数即可减少剩余识别数量',
    },
    {
      label: '操作者',
      name: 'operator',
      type: 'input',
      placeholder: '请输入操作者',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '备注',
      name: 'remark',
      type: 'textarea',
      placeholder: '请输入备注',
    },
    // <Button> 直接-渲染组件</Button>,
  ]);
  const initItems = (values: any) => {
    console.log(values);
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
    const formresult: any = {};
    formresult.id = values;
    setForms(formresult);
  };
  // const getInfoData = async (id: any) => {
  //   console.log('initFormsresult:', id);
  //   const formresult: any = {};
  //   formresult.id = id;
  //   setForms(formresult);
  //   // if (id) {
  //   //   const result: any = await PjClientData(id);

  //   // }
  // };
  const getListData = async (id: any) => {
    if (id) {
      const kk: any = {};
      kk.tenantId = id;
      // if (props.type === 'bgd') {
      //   kk.rechargeType = 1;
      // }
      // if (props.type === 'invoice') {
      //   kk.rechargeType = 2;
      // }
      const res: any = await pjRechargeLognoPagelist(kk);
      const columnsArr: any[] = [];
      if (res.result) {
        res.result.forEach((item: any, index: number) => {
          const dd = item;
          dd.index = index + 1;
          columnsArr.push(dd);
        });
      }
      // console.log('pjComboLog', columnsArr);
      setData(columnsArr);
    }
  };

  React.useEffect(() => {
    console.log('query', props?.location?.query);
    if (props?.location?.query.id || props?.id) {
      getListData(props?.location?.query.id || props.id);
    }
    if (props.action === 'edit') {
      initForms(props?.location?.query.id || props.id);
    }
  }, [props?.location?.query, props]);

  // 表单提交
  const onSubmits = async (values: any) => {
    const value = Object.assign({}, forms, values);
    const result: any = {};
    result.id = value.id;
    result.num = value.num;
    // result.type = props.type;
    result.remark = value.remark;
    result.operator = value.operator;
    console.log('value', props);
    if (props.action === 'edit') {
      const res: any = await pjTenantcheckNum(result);
      if (res.code == 200) {
        page.closeModal();
        setTimeout(() => {
          history.go(0);
        }, 200);
      }
    }
  };

  interface DataType {
    index: number;
    comboType: string;
    cooperationBeginTime: string;
    cooperationEndTime: string;
    createTime: string;
  }
  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (text: ReactNode, record: any): ReactNode[] => [<>{record.index}</>],
    },
    {
      title: '原数量',
      width: 80,
      dataIndex: 'oldNum',
    },
    {
      title: '充值数量',
      dataIndex: 'rechargeNum',
      width: 80,
    },
    {
      title: '充值时间',
      width: 150,
      dataIndex: 'rechargeTime',
    },
    {
      title: '操作者',
      dataIndex: 'operator',
      width: 80,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 80,
    },
  ];
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
    <>
      <BaseEdit
        mode={props.mode}
        rowCol={rowCol}
        fixedSubmit={props.fixedSubmit}
        submitTarget={props.submitTarget}
        submitter={
          // (check('/ticket/tenant/bgd/commit') === false && props.type === 'bgd') ||
          check('/ticket/tenant/scan/commit') === false ? false : true
        }
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
      <Table columns={columns} dataSource={data} scroll={{ y: 220 }} />
    </>
  );
};

export default Page;
