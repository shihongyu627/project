import { BaseEdit, page } from '@kafudev/ui-kit';
import type { ReactNode } from 'react';
import React from 'react';
// import { history } from 'umi';
import {
  PjClientData,
  pjComboLogedit,
  pjComboLogNoPageList,
  pjComboNoPageList,
} from '@/services/ant-design-pro/customer';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
// import { pjComboNoPageList } from '@/services/ant-design-pro/setmeal';

const Page: React.FC<any> = (props) => {
  const [data, setData] = React.useState<DataType[]>([]);
  const [forms, setForms] = React.useState<any>({});
  const [items] = React.useState<any>([
    { label: '基本信息', desc: '表单的基本信息', type: 'header' },
    {
      label: '选择套餐',
      name: 'combo',
      type: 'select',
      width: 'md',
      request: async function () {
        const result: any = await pjComboNoPageList();
        const columnsArr: any[] = result.result;
        const res: any = [];
        columnsArr.map((item) => {
          const temp = {
            label: item.name,
            value: item.comboType,
          };
          res.push(temp);
        });
        return res;
      },
      dropList: [],
      placeholder: '请选择套餐',
      rules: [{ required: true, trigger: 'blur', type: 'select' }],
    },
    {
      label: '合作时间',
      name: 'cooperation_time',
      type: 'dateRange',
      width: 'md',
      placeholder: ['请选择套餐合作开始时间', '请选择套餐合作结束时间'],
      // rules: [{ required: true, trigger: 'blur', type: 'Array' }],
    },
    // <Button> 直接渲染组件</Button>,
  ]);

  const getInfoData = async (id: any) => {
    if (id) {
      const result: any = await PjClientData(id);
      const formresult = result.result;
      if (formresult.cooperationBeginTime && formresult.cooperationEndTime) {
        const cooperation_time = [formresult.cooperationBeginTime, formresult.cooperationEndTime];
        formresult.cooperation_time = cooperation_time;
      }
      setForms(formresult);
    }
  };

  const getListData = async (id: any) => {
    if (id) {
      const res: any = await pjComboLogNoPageList(id);
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
    // console.log('query', props?.location?.query);
    if (props?.location?.query.id || props?.id) {
      getListData(props?.location?.query.id || props.id);
    }
    if (props.action === 'edit') {
      getInfoData(props?.location?.query.id || props.id);
    }
  }, [props?.location?.query, props]);

  // 表单提交
  const onSubmit = async (values: any) => {
    const value = Object.assign({}, forms, values);
    // console.log('onSubmit:', value);
    if (value.cooperation_time) {
      const time1 = moment(value.cooperation_time[0]).format('YYYY-MM-DD');
      value.cooperation_begin_time = time1;
      const time2 = moment(value.cooperation_time[1]).format('YYYY-MM-DD');
      value.cooperation_end_time = time2;
      delete value.cooperation_time;
    }
    const result: any = {};
    result.id = value.id;
    result.combo = value.combo;
    // console.log('value', value);
    result.cooperationBeginTime = value.cooperation_begin_time;
    result.cooperationEndTime = value.cooperation_end_time;
    if (props.action === 'edit') {
      const kk: any = await pjComboNoPageList();
      const columnsArr: any[] = kk.result || [];
      const temp = {};
      columnsArr.map((item) => {
        if (item.comboType === result.combo) {
          temp.label = item.name;
          // console.log('res', temp);
        }
      });
      result.logName = temp.label;
      const res: any = await pjComboLogedit(result);
      // console.log('onSubmit:', res);
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
      title: '套餐类型',
      dataIndex: 'name',
      width: 80,
      // render: async function (text: ReactNode, record: any) {
      //   const result: any = await pjComboNoPageList();
      //   const columnsArr: any[] = result.result || [];
      //   const temp = {};
      //   columnsArr.map((item) => {
      //     if (item.comboType === record.comboType) {
      //       temp['label'] = item.name;
      //       console.log('res', temp);
      //     }
      //   });
      //   return <div>{temp.label}</div>;
      // },
    },
    {
      title: '套餐合作时间',
      dataIndex: 'cooperationBeginTime',
      width: 200,
      render: (text: ReactNode, record: any): ReactNode[] => [
        <>
          {record.cooperationBeginTime}-{record.cooperationEndTime}
        </>,
      ],
    },
    {
      title: '变更时间',
      width: 150,
      dataIndex: 'createTime',
    },
  ];
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
        {...props}
        mode={props.mode}
        action={props.action || props?.location?.query?.action}
        items={items}
        values={forms}
        submitter={
          check('/ticket/client/combo/commit') === false
            ? {
                render() {
                  return [];
                },
              }
            : {}
        }
        onSubmit={onSubmit}
      />
      <Table columns={columns} dataSource={data} scroll={{ y: 220 }} />
    </>
  );
};

export default Page;
