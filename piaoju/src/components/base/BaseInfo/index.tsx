import type { ReactNode } from 'react';
import React from 'react';
import BasePage from '../BasePage';
import InfoBody from '../../info/InfoBody';
import ProDescriptions from '@ant-design/pro-descriptions';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export type Props = {
  mode?: 'page' | 'drawer' | 'modal'; // 呈现类型
  items: any[]; // 字段配置
  datas: object; // 表单数据
  initItems?: (value: any) => void; // 初始化字段数据
  initDatas?: (value: any) => void; // 初始化数据
  title?: ReactNode | string; // 标题
  tooltip?: string; // 提示语
  extra?: ReactNode | string; // 扩展按钮
  renderHeader?: () => React.ReactNode; // 渲染头部
  renderFooter?: () => React.ReactNode; // 渲染底部
};
const LogTag = 'BaseInfo';

// 格式化项目数据
const formatItems = (_items: any[], _datas: any, _lists: any[]) => {
  let _nowIndex = 0;
  for (let index = 0; index < (_items.length || 0); index++) {
    const _item = _items[index];
    if (index === 0) {
      _nowIndex = 0;
      const tt: any = {};
      tt.label = '';
      tt.desc = '';
      tt.type = 'header';
      tt.items = [];
      _lists.push(tt);
    }
    switch (_item.type) {
      // 头部-标题
      case 'header':
        // !转换成标题
        if (index === 0) {
          _nowIndex = 0;
          const tt: any = _item;
          tt.items = [];
          _lists[_nowIndex] = tt;
        } else {
          // 创建新的标题
          _nowIndex++;
          const tt: any = _item;
          tt.items = [];
          _lists.push(tt);
        }
        break;
      // 表单-对象
      case 'form':
      case 'object':
        // todo 转换成对象
        break;
      // 列表-数组
      case 'list':
      case 'array':
        // todo 转换成数组
        break;
      default:
        _lists[_nowIndex].items.push(_item);
        break;
    }
  }
  // console.log('formatItems', _lists);
  return _lists;
};

const BaseInfo: React.FC<Props> = (props) => {
  const [lists, setLists] = React.useState(formatItems(props.items, props.datas, []));
  const [datas, setDatas] = React.useState(props.datas);

  // 初始化字段数据
  React.useEffect(() => {
    // console.log(LogTag, 'initItems items', props.items);
    if (props.initItems) {
      props.initItems(props.items);
    } else {
      // todo默认字段数据处理
    }

    console.log(LogTag, 'initDatas datas', props.datas);
    if (props.initDatas) {
      props.initDatas(props.datas);
    } else {
      // todo默认表单数据处理
    }
  }, []);

  // 属性值变化数据
  React.useEffect(() => {
    // console.log(LogTag, 'propsChange items', props.items);
    if (props.items) {
      setLists(formatItems(props.items, props.datas, []));
    }
  }, [props.items]);

  React.useEffect(() => {
    // console.log(LogTag, 'propsChange datas', props.datas);
    if (props.datas) {
      setDatas(props.datas);
    }
  }, [props.datas]);

  // 渲染数据
  const renderDatas = () => {
    return (
      <>
        {(lists || []).map((tt: Record<string, any>, ii: number) => {
          return (
            <ProDescriptions
              key={ii}
              title={
                <InfoBody
                  items={
                    (tt.items || []).length > 0 ? [{ label: tt.label, type: 'header', ...tt }] : []
                  }
                  datas={{}}
                />
              }
              dataSource={datas}
              columns={[]}
            >
              {(tt.items || []).map((item: Record<string, any>, index: number) => {
                if (item.type == 'header' || item.valueType == 'header') {
                  return null;
                }
                return (
                  <ProDescriptions.Item label={item.label} key={index}>
                    <InfoBody items={[item]} datas={{ [item.name]: datas[item.name] }} />
                  </ProDescriptions.Item>
                );
              })}
            </ProDescriptions>
          );
        })}
      </>
    );
  };

  return (
    <BasePage mode={props.mode}>
      {props.renderHeader && props.renderHeader()}
      {renderDatas()}
      {props.children}
      {props.renderFooter && props.renderFooter()}
    </BasePage>
  );
};

export default BaseInfo;
