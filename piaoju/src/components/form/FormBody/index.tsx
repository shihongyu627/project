/* eslint-disable @typescript-eslint/no-unused-vars */
import ProCard from '@ant-design/pro-card';
import Field from '@ant-design/pro-field';
import ProForm, {
  ProFormDigit,
  ProFormFieldSet,
  ProFormGroup,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Col, Row } from 'antd';

export type Props = {
  rowCol?: number; // 行列数 默认为1
  items: any[]; // 表格列配置
  forms: object; // 表单数据
  width?: string | number; // 表格宽度
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LogTag = 'FormBody';
const FormBody: React.FC<Props> = (props) => {
  const [itemList, setItemList] = React.useState<any[]>([]);
  // 渲染表单组件
  const renderItem = (item: any, key: any) => {
    // 组件有渲染函数直接渲染
    if (item?.render) {
      return item.render(item, key);
    }
    if (typeof item?.type === 'object') {
      // 组件直接渲染
      if (item?.type?.$$typeof == "Symbol('react.forward_ref')") {
        return item;
      }
    }
    switch (item?.type) {
      case 'header': // !表单头部
        return (
          <div
            key={key}
            style={{
              borderLeft: '3px',
              borderLeftStyle: 'solid',
              borderLeftColor: item.borderColor || '#2d8cf0',
              overflow: 'hidden',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                marginLeft: '10px',
                fontWeight: 'bold',
                color: 'rgb(70, 76, 91)',
                float: 'left',
                fontSize: '14px',
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                marginLeft: '10px',
                fontWeight: 'normal',
                color: 'rgb(101, 113, 128)',
                float: 'left',
                fontSize: '12px',
                marginTop: '2px',
              }}
            >
              {item.desc}
            </div>
          </div>
        );
      case 'group': // !表单组合-字段
        return (
          <>
            <ProForm.Item
              key={key}
              colon={item?.label || false}
              {...item}
              label={item?.label || ' '}
            >
              <ProFormGroup key="group">
                {item.items.map((tt: any, ii: number) => {
                  return renderItem(tt, ii);
                })}
              </ProFormGroup>
            </ProForm.Item>
          </>
        );
      case 'set': // !表单set
        return (
          <ProFormFieldSet
            key={key}
            name={item.name}
            label={item.label}
            // 支持 两种方式，type="group" 会用input.group 包裹
            // 如果不配置 默认使用 space
            type="space"
            transform={(value: any) => {
              // console.log('transform', value);
              const newData = {};
              // 循环表单项
              for (let ii = 0; ii < item.items.length; ii++) {
                const tt = item.items[ii];
                // 组合数据
                newData[tt.name] = value[ii];
              }
              // console.log('transform newData', newData);
              return {
                [item.name]: newData,
              };
            }}
            convertValue={(value: any, field: any) => {
              console.log('convertValue', value, field);
              return value;
            }}
          >
            {item.items.map((tt: any, ii: number) => {
              return renderItem(tt, ii);
            })}
          </ProFormFieldSet>
        );
      case 'form': // !表单嵌套-对象
      case 'object': // !表单嵌套-对象
        return (
          <ProFormList
            key={key}
            name={item.name}
            label={item.label}
            min={1}
            max={1}
            itemRender={({ listDom, action }, { record }) => {
              return (
                <ProCard
                  bordered
                  extra={action}
                  title={record?.name}
                  style={{
                    marginBottom: 8,
                  }}
                >
                  {listDom}
                </ProCard>
              );
            }}
          >
            <ProFormGroup key="group">
              {item.items.map((tt: any, ii: number) => {
                return renderItem(tt, ii);
              })}
            </ProFormGroup>
          </ProFormList>
        );
      case 'list': // !表单列表-数组
      case 'array': // !表单列表-数组
        return (
          <ProFormList
            key={key}
            name={item.name}
            label={item.label}
            itemRender={({ listDom, action }, { record }) => {
              // 卡片呈现方式
              if (item.showType === 'card') {
                return (
                  <ProCard
                    bordered
                    extra={action}
                    title={record?.name}
                    style={{
                      marginBottom: 8,
                    }}
                  >
                    {listDom}
                  </ProCard>
                );
              }
            }}
            // itemContainerRender={(doms) => {
            //   return <ProForm.Group>{doms}</ProForm.Group>;
            // }}
          >
            <ProFormGroup key="group">
              {item.items.map((tt: any, ii: number) => {
                return renderItem(tt, ii);
              })}
            </ProFormGroup>
          </ProFormList>
        );
      // 以下是普通组件
      case 'input':
      case 'string':
      case 'text': // 输入框
        return (
          <ProFormText
            {...item}
            key={key}
            width={item.width}
            name={item.name}
            label={item.label}
            disabled={item.disabled}
            placeholder={item.placeholder || ''}
            fieldProps={{ ...item, ...item.fieldProps }}
          />
        );
      case 'digitnumber': // 数字百分比输入
        return (
          <ProFormDigit
            label={item.label}
            name={item.name}
            min={0}
            max={100}
            fieldProps={{ formatter: (value) => `${value}%` }}
          />
        );
      case 'digit': // 数字输入
        return (
          <ProFormDigit
            {...item}
            key={key}
            label={item.label}
            name={item.name}
            width={item.width}
            disabled={item.disabled}
            fieldProps={{ ...item, ...item.fieldProps }}
          />
        );

      case 'select': // 下拉框
        return (
          <ProFormSelect
            {...item}
            key={key}
            allowClear
            mode={item.mode || ''}
            width={props.width}
            name={item.name}
            label={item.label}
            disabled={item.disabled}
            placeholder={item.placeholder || ''}
            request={async () => {
              if (item.request) {
                // todo请求远程下拉数据
                const list = await item.request();
                return list || [];
              } else {
                return item.dropList || [];
              }
            }}
            // request={item.request || []}
            fieldProps={item.fieldProps}
          />
        );
      case 'treeselect': // 树状下拉框
        return (
          <ProFormTreeSelect
            {...item}
            key={key}
            name={item.name}
            placeholder={item.placeholder || ''}
            allowClear
            width={item.width}
            secondary
            request={async () => {
              if (item.request) {
                // todo请求远程下拉数据
                const list = await item.request();
                return list || [];
              } else {
                return [
                  {
                    title: '一级1',
                    value: '1',
                    children: [
                      {
                        title: '二级1',
                        value: '4',
                      },
                      {
                        title: '二级2',
                        value: '11',
                      },
                    ],
                  },
                  {
                    title: '一级2',
                    value: '2',
                    children: [
                      {
                        title: '二级3',
                        value: '5',
                      },
                      {
                        title: '二级4',
                        value: '6',
                      },
                      {
                        title: '二级5',
                        value: '7',
                      },
                    ],
                  },
                  {
                    title: '一级3',
                    value: '3',
                    children: [
                      {
                        title: '二级6',
                        value: '8',
                      },
                      {
                        title: '二级7',
                        value: '9',
                      },
                      {
                        title: '二级8',
                        value: '10',
                      },
                    ],
                  },
                ];
              }
            }}
            // tree-select args
            fieldProps={item.fieldProps}
            // fieldProps={{
            //   showArrow: false,
            //   filterTreeNode: true,
            //   showSearch: true,
            //   dropdownMatchSelectWidth: false,
            //   labelInValue: true,
            //   autoClearSearchValue: true,
            //   multiple: true,
            //   treeCheckable: true,
            //   treeNodeFilterProp: 'title',
            //   treeCheckStrictly: true,
            //   treeDefaultExpandAll: true,
            //   fieldNames: {
            //     label: 'title',
            //   },
            // }}
          />
        );
      case 'textarea': // 文本域
        return (
          <ProFormTextArea
            {...item}
            key={key}
            width={props.width}
            name={item.name}
            label={item.label}
            disabled={item.disabled}
            placeholder={item.placeholder || ''}
            fieldProps={{ showCount: true, ...item.fieldProps }}
          />
        );
      case 'switch': // 开关
        return (
          <ProFormSwitch
            {...item}
            key={key}
            width={props.width}
            name={item.name}
            label={item.label}
            disabled={item.disabled}
            placeholder={item.placeholder || ''}
            fieldProps={item.fieldProps}
          />
        );
      case 'radio': // 单选框
        return (
          <ProFormRadio.Group
            radioType={item.radioType || ''} //button 按钮型
            layout={item.layout || ''} //vertical 竖型
            {...item}
            key={key}
            width={props.width}
            name={item.name}
            label={item.label}
            disabled={item.disabled}
            placeholder={item.placeholder || ''}
            request={async () => {
              if (item.request) {
                // todo请求远程下拉数据
                const list = await item.request();
                return list || [];
              } else {
                return item.options || [];
              }
            }}
            fieldProps={item.fieldProps}
          />
        );
      case 'image': // 上传图片
        return (
          <ProFormUploadButton
            name={item.name}
            label={item.label}
            max={1}
            fieldProps={{
              name: 'file',
              maxCount: 1,
              listType: 'picture-card',
              headers: {
                'Tenant-Token': `${localStorage.getItem('token')}`,
              },
            }}
            action="/admin/sys/common/upload"
            extra={item.desc}
          />
        );
      // case 'gallery': // 上传图片
      //   return (
      //     <ProFormUploadButton
      //       name={item.name}
      //       label={item.label}
      //       fieldProps={{
      //         name: 'file',
      //         listType: 'picture-card',
      //         headers: {
      //           'Tenant-Token': `${localStorage.getItem('token')}`,
      //         },
      //       }}
      //       action="/admin/sys/common/upload"
      //       extra={item.desc}
      //     />
      //   );
      case 'empty':
      case 'black':
        return null;
      default:
        // 渲染默认的antd组件
        // console.log('type', item.type);
        return (
          <ProForm.Item key={key} {...item}>
            <Field mode={'edit'} valueType={item?.valueType || item?.type} {...item} />
          </ProForm.Item>
        );
    }
  };

  const getItemList = (): any[] => {
    const ll = props.items.map((item, index) => {
      return renderItem(item, index);
    });
    const _ll = [];
    for (let index = 0; index < ll.length; index++) {
      const item = ll[index];
      if (props?.rowCol && props?.rowCol > 1) {
        // 区分类型
        if (props.items[index]?.type == 'header') {
          // 单行显示
          _ll.push(item);
        } else {
          _ll.push(
            <Row key={index}>
              <Col span={12}>{item}</Col>
              <Col span={12}>{props.items[index + 1]?.type == 'header' ? null : ll[++index]}</Col>
            </Row>,
          );
        }
      } else {
        _ll.push(item);
      }
    }
    return _ll;
  };

  React.useEffect(() => {
    const ll: any[] = getItemList();
    setItemList(ll);
  }, []);

  React.useEffect(() => {
    const ll: any[] = getItemList();
    setItemList(ll);
  }, [props.forms, props.items]);

  return (
    <>
      {itemList.map((item) => {
        return item;
      })}
    </>
  );
};

export default FormBody;
