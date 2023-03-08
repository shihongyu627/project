import React from 'react';
import {
  ProFormGroup,
  ProFormList,
  ProFormFieldSet,
  ProFormText,
  ProFormSelect,
  ProFormRadio,
  ProFormTextArea,
  ProFormSwitch,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';

export type Props = {
  items: any[]; // 表格列配置
  forms: object; // 表单数据
  width?: string | number; // 表格宽度
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LogTag = 'RenderItemForm';
const RenderItemForm: React.FC<Props> = (props) => {
  // 渲染表单组件
  const renderItem = (item: any, key: any) => {
    switch (item.type) {
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
          <ProFormFieldSet key={key} name={item.name} label={item.label} type="space">
            {item.items.map((tt: any, ii: number) => {
              return renderItem(tt, ii);
            })}
          </ProFormFieldSet>
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
            width={props.width}
            name={item.name}
            label={item.label}
            disabled={item.disabled}
            placeholder={item.placeholder || ''}
            fieldProps={{ ...item, ...item.fieldProps }}
          />
        );
      case 'select': // 下拉框
        return (
          <ProFormSelect
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
                return item.dropList || [];
              }
            }}
            fieldProps={item.fieldProps}
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
            radioType="button"
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
      case 'empty':
      case 'black':
      default:
        return null;
    }
  };

  return (
    <>
      {props.items.map((item, index) => {
        return renderItem(item, index);
      })}
    </>
  );
};

export default RenderItemForm;
