import {
  pjModeladd,
  pjModelData,
  pjModeledit,
  // pjComboLogadd,
} from '@/services/ant-design-pro/contract';
import {
  BaseEdit,
  findIndexItems,
  // findIndexItems
} from '@kafudev/ui-kit';
import { Button, Col, Row } from 'antd';
import ContractModalAll from './contractAllGoods'; //hetong quanbu
import openModal from '@/utils/page';
// import moment from 'moment';
import React from 'react';
import { history } from 'umi';

const Page: React.FC<any> = (props) => {
  const [layout, setLayout] = React.useState<'horizontal' | 'vertical' | 'inline'>('horizontal');
  const [forms, setForms] = React.useState<any>({ defaultStatus: 0, status: 1 });
  const [context, setcontext] = React.useState<any>('');
  const [items, setItems] = React.useState<any>([
    { label: '模板信息', desc: '', type: 'header' },
    {
      label: '模板名称',
      name: 'code',
      type: 'input',
      width: 'sm',
      placeholder: '请输入模板名称',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '模板内容',
      name: 'context',
      type: 'editor',
      uploadUrl: '/admin/sys/common/upload',
      toolbarConfig: {
        toolbarKeys: [
          // 菜单 key
          'headerSelect', //标题
          // 分割线
          // '|',
          // 菜单 key
          'bold', //加粗
          'italic', //斜体
          'fontSize', //字号
          'color', //颜色
          'lineHeight', //行高
          // 菜单组，包含多个菜单
          // {
          //   key: 'group-more-style', // 必填，要以 group 开头
          //   title: '更多样式', // 必填
          //   iconSvg: '<svg>....</svg>', // 可选
          //   menuKeys: ['through', 'code', 'clearStyle'], // 下级菜单 key ，必填
          // },
          // 继续配置其他菜单...
        ],
        excludeKeys: ['through', 'bgColor', 'clearStyle'],
      },
      // style: {
      //   width: '887px',
      //   border: 'none',
      //   'overflow-y': 'hidden',
      // },
      uploadResult: async (res: any) => {
        if (res?.code == 200) {
          return { url: res.result };
        }
        return {};
      },
    },
    {
      label: '默认模板',
      name: 'defaultStatus',
      type: 'radio',
      width: 'md',
      options: [
        { label: '否', value: 0 },
        { label: '是', value: 1 },
      ],
    },
    {
      label: '是否生效',
      name: 'status',
      type: 'radio',
      width: 'md',
      options: [
        { label: '否', value: 0 },
        { label: '是', value: 1 },
      ],
    },
    {
      label: '备注',
      name: 'remark',
      type: 'textarea',
      // fieldProps: { maxLength: 100 },
      // rules: [{ type: 'string', max: 100, message: '超过最大长度' }],
    },
  ]);

  React.useEffect(() => {
    console.log('query', props);
    if (props?.action === 'edit') {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      getData(props?.id);
      items[findIndexItems('defaultStatus', items)].disabled = 'disabled';
      items[findIndexItems('status', items)].disabled = 'disabled';
    }
  }, [props, items]);

  const getData = async (id: any) => {
    if (id) {
      const result: any = await pjModelData(id);
      const formresult = result.result;
      setForms(formresult);
    }
  };

  // 表单提交
  const onSubmit = async (values: any) => {
    // 合并接口数据和表单数据
    const value = Object.assign({}, forms, values);
    // console.log('onSubmit:', value);
    if (props?.action === 'edit') {
      const res: any = await pjModeledit(value);
      if (res.code == 200) {
        history.go(0);
      }
    }
    if (props?.action === 'add') {
      const dd: any = {};
      dd.name = value.name;
      const res: any = await pjModeladd(value);
      if (res.code == 200) {
        history.go(0);
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

  const onValuesChange = (changedValues: any, values: any) => {
    // console.log('onValuesChange:', changedValues, values);
    for (const key in changedValues) {
      if (Object.prototype.hasOwnProperty.call(changedValues, key)) {
        const value = changedValues[key];
        if (key === 'context') {
          setcontext(value);
        }
        switch (key) {
          case 'status':
            // if (value == true) {
            //   items[findIndexItems('image', items)].mode = 'edit';
            //   items[findIndexItems('gallery', items)].mode = 'edit';
            //   items[findIndexItems('gallery', items)].fieldProps = {
            //     disabled: false,
            //   };
            //   items[findIndexItems('area', items)].mode = 'edit';
            //   items[findIndexItems('area2', items)].mode = 'edit';
            //   setItems([...items]);
            // } else {
            //   items[findIndexItems('image', items)].mode = 'read';
            //   items[findIndexItems('gallery', items)].mode = 'read';
            //   items[findIndexItems('gallery', items)].fieldProps = {
            //     disabled: true,
            //   };
            //   items[findIndexItems('area', items)].mode = 'read';
            //   items[findIndexItems('area2', items)].mode = 'read';
            //   setItems([...items]);
            // }
            // 循环设置items
            // items.map((item: { name: string; mode: string }) => {
            //   if (item.name !== 'status') {
            //     item.mode = value ? 'edit' : 'read';
            //   }
            // });
            setItems([...items]);

            values.status1 = value;
            setForms({ ...values });
            break;
          case 'layout':
            setLayout(value);
            break;
          default:
            break;
        }
      }
    }
  };

  return (
    <BaseEdit
      // pageProps={{
      //   title: (props.action || props?.location?.query?.action) == 'add' ? '新增客户' : '编辑客户',
      // }}
      {...props}
      // mode={'page'}
      layout={layout}
      rowCol={1}
      action={props.action || props?.location?.query?.action}
      items={items}
      values={forms}
      onValuesChange={onValuesChange}
      submitter={
        check('/ticket/contract/model/commit') === false
          ? {
              render() {
                return [];
              },
            }
          : {
              // eslint-disable-next-line @typescript-eslint/no-shadow
              render: (props, doms) => {
                console.log(props, doms);
                return (
                  <Row justify={'end'} style={{ marginTop: 20 }}>
                    <Col style={{ marginRight: '8px' }}>
                      <Button key="rest" onClick={() => props.form?.resetFields()}>
                        重置
                      </Button>
                    </Col>
                    <Col style={{ marginRight: '8px' }}>
                      <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
                        提交
                      </Button>
                    </Col>
                    <Col style={{ marginRight: '8px' }}>
                      <Button
                        type="primary"
                        key="see"
                        onClick={() => {
                          openModal.showModal(
                            <ContractModalAll
                              mode={'modal'}
                              action={'add'}
                              submitTarget={''}
                              dataInfo={{}}
                              context={context}
                            />,
                            {
                              title: '采购合同',
                              width: 1000,
                              maskClosable: false,
                              footer: null,
                            },
                          );
                        }}
                      >
                        预览
                      </Button>
                    </Col>
                  </Row>
                );
              },
            }
      }
      onSubmit={onSubmit}
    />
  );
};

export default Page;
