import React from 'react';
import { Switch } from 'antd';
import Field from '@ant-design/pro-field';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './index.less';

export type Props = {
  items: any[]; // 表格列配置
  datas: object; // 表单数据
  width?: string | number; // 表格宽度
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LogTag = 'InfoBody';
const InfoBody: React.FC<Props> = (props) => {
  // 渲染表单组件
  const renderItem = (item: any, key: number) => {
    switch (item.type) {
      case 'header': // !表单头部
        return (
          <div
            key={key}
            style={{
              borderLeft: '3px',
              borderLeftStyle: 'solid',
              borderLeftColor: item.borderColor || '#bbb',
              overflow: 'hidden',
              marginBottom: '2px',
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
      // 以下是普通组件
      case 'switch': // 开关
        return (
          <Switch
            key={key}
            checked={props.datas[item.name]}
            checkedChildren={item.trueText || item.checkedChildren || ''}
            unCheckedChildren={item.falseText || item.unCheckedChildren || ''}
            disabled={true}
          />
        );
      case 'image': // 图片
        return (
          <Field {...item} key={key} text={props.datas[item.name]} valueType="image" mode="read" />
        );
      case 'gallery': // 图集
        return <div key={key}>{'暂未实现'}</div>;
      case 'empty':
      case 'black':
        return null;
      default:
        return (
          <Field
            {...item}
            key={key}
            text={props.datas[item.name]}
            valueType={item.type || item.valueType}
            request={async () => {
              if (item.request) {
                // todo请求远程下拉数据
                const list = await item.request();
                return list || [];
              } else {
                return item.options || item.dropList || [];
              }
            }}
            mode="read"
          />
        );
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

export default InfoBody;
