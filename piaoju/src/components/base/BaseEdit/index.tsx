import type { ReactNode } from 'react';
import React from 'react';
import BasePage from '../BasePage';
import BaseForm from '../../form/BaseForm';
import { message } from 'antd';
// import styles from './index.less';

export type Props = {
  mode?: 'page' | 'drawer' | 'modal'; // 呈现类型
  action: 'add' | 'edit' | 'view'; // 操作类型
  rowCol?: number; // 行列数 默认为1
  items: any[]; // 字段配置
  forms: object; // 表单数据
  formLayoutType: 'horizontal' | 'vertical' | 'inline'; // 表单布局
  fixedSubmit?: boolean; // 提交按钮固定submitter
  submitter?: boolean; // 提交按钮固定submitter
  submitTarget?: Element | string; // 提交按钮挂载目标
  getSubmitDom?: (element: any, dom: any) => any; // 父级获取提交按钮
  initItems?: (value: any) => void; // 初始化字段数据
  initForms?: (value: any) => void; // 初始化表单数据
  formatItems?: (value: any) => void; // 格式化字段数据
  formatForms?: (value: any) => void; // 式化表单数据
  changeItems?: (changedValues: any, value: any) => void; // 字段数据变化
  changeForms?: (changedValues: any, value: any) => void; // 表单数据变化
  onSubmits?: (value: any) => void; // 提交表单
  onCancel?: () => void; // 取消表单
  onReset?: () => void; // 重置表单
  title?: ReactNode | string; // 标题
  tooltip?: string; // 提示语
  extra?: ReactNode | string; // 扩展按钮
  renderHeader?: () => React.ReactNode; // 渲染头部
  renderFooter?: () => React.ReactNode; // 渲染底部
};
const LogTag = 'BaseEdit';
const BaseEdit: React.FC<Props> = (props) => {
  const [items, setItems] = React.useState(props.items);
  const [forms, setForms] = React.useState(props.forms);

  // 初始化数据
  React.useEffect(() => {
    // console.log(LogTag, 'initItems items', props.items);
    if (props.initItems) {
      props.initItems(props.items);
    } else {
      // todo默认字段数据处理
    }

    // console.log(LogTag, 'initForms forms', props.forms);
    if (props.initForms) {
      props.initForms(props.forms);
    } else {
      // todo默认表单数据处理
    }
  }, []);

  // 属性值变化数据
  React.useEffect(() => {
    // console.log(LogTag, 'propsChange items', props.items);
    if (props.items) {
      setItems(props.items);
    }
  }, [props.items]);

  React.useEffect(() => {
    // console.log(LogTag, 'propsChange forms', props.forms);
    if (props.forms) {
      setForms(props.forms);
    }
  }, [props.forms]);

  // // 字段数据变化
  // React.useEffect(() => {
  //   console.log(LogTag, 'changeItems items', items);
  //   // todo默认字段数据处理

  //   if (props.changeItems) {
  //     props.changeItems(items);
  //   }
  // }, [items]);

  // // 表单数据变化
  // React.useEffect(() => {
  //   console.log(LogTag, 'changeForms forms', forms);
  //   // todo默认数据数据处理

  //   if (props.changeForms) {
  //     props.changeForms(forms);
  //   }
  // }, [forms]);

  // 表单提交
  const onSubmit = async (values: any) => {
    // console.log(LogTag, 'onSubmit:', values);
    // console.log(LogTag, 'onSubmit:', forms);
    Object.assign(forms, values);
    if (props.onSubmits) {
      props.onSubmits(forms);
      // console.log('onSubmit:', forms);
    } else {
      // todo通用提交方法
      message.success('提交成功');
    }
  };

  // 表单数据变化
  const onValuesChange = (changedValues: any, values: any) => {
    if (changedValues) {
      console.log(LogTag, 'onValuesChange:', changedValues, values);
      if (props.changeForms) {
        props.changeForms(changedValues, values);
      }
    }
  };

  // 渲染表单
  const renderForms = () => {
    return (
      <BaseForm
        mode={props.mode}
        rowCol={props.rowCol}
        formLayoutType={props.formLayoutType}
        fixedSubmit={props.fixedSubmit}
        submitTarget={props.submitTarget}
        submitter={props.submitter}
        getSubmitDom={props.getSubmitDom}
        items={items}
        forms={forms}
        onFinish={onSubmit}
        onValuesChange={onValuesChange}
      />
    );
  };

  return (
    <BasePage mode={props.mode}>
      {props.renderHeader && props.renderHeader()}
      {renderForms()}
      {props.children}
      {props.renderFooter && props.renderFooter()}
    </BasePage>
  );
};

export default BaseEdit;
