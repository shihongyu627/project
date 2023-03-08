import { changeAllot, PjClientData, pjUserNoPageList } from '@/services/ant-design-pro/customer';
import { BaseEdit, page } from '@kafudev/ui-kit';
import { message } from 'antd';
import React from 'react';
// import { history } from 'umi';

const Page: React.FC<any> = (props) => {
  const [forms, setForms] = React.useState<any>({});
  // const [forms] = React.useState<any>({
  //   username: props.name,
  // });
  const [items] = React.useState<any>([
    { label: '基本信息', desc: '表单的基本信息', type: 'header' },
    {
      label: '分配客服',
      name: 'allots',
      type: 'select',
      fieldProps: {
        mode: 'multiple',
      },
      request: async function () {
        const result: any = await pjUserNoPageList();
        const columnsArr: any[] = result.result;
        const res: any = [];
        columnsArr.map((item) => {
          const temp = {
            label: item.realname,
            value: item.id,
          };
          res.push(temp);
        });
        return res;
      },
      placeholder: '请选择客服',
    },
  ]);

  React.useEffect(() => {
    // console.log('query', props?.location?.query);
    if (props.id) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      getData(props.id);
    }
  }, [props?.location?.query]);
  const getData = async (id: any) => {
    if (id) {
      const result: any = await PjClientData(id);
      // console.log('initFormsresult:', result);
      const formresult: any = {};
      if (result.result.allot) {
        const columnsArr = result.result.allot;
        const chars = columnsArr.split(',');
        formresult.allots = chars;
      }
      setForms(formresult);
    }
  };
  // 表单提交
  const onSubmit = async (value: any) => {
    if (props.action === 'add') {
      // console.log('onSubmit:', value);
      if (value.allots) {
        const str = value.allots.join(',');
        value.allot = str;
        delete value.allots;
      }
      value.clientId = props.id;
      const res: any = await changeAllot(value);
      // console.log('onSubmit:', res);
      if (res.code == 200) {
        message.success(res.message || res.msg || '操作成功');
        page.closeModal();
        // setTimeout(() => {
        //   history.go(0);
        // }, 200);
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
      {...props}
      mode={props.mode}
      action={props.action || props?.location?.query?.action}
      items={items}
      values={forms}
      submitter={
        check('/ticket/client/service/commit') === false
          ? {
              render() {
                return [];
              },
            }
          : {}
      }
      onSubmit={onSubmit}
    />
  );
};

export default Page;
