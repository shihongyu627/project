import React from 'react';
import { Row, Col } from 'antd';
import FormBody from '../FormBody';
import type { ProFormInstance } from '@ant-design/pro-form';
import { FooterToolbar } from '@ant-design/pro-layout';
import ProForm from '@ant-design/pro-form';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ReactDOM from 'react-dom';

export type Props = {
  mode?: 'page' | 'drawer' | 'modal'; // 呈现类型
  items: any[]; // 表格列配置
  forms: object; // 表单数据
  width?: string | number; // 表格宽度
  rowCol?: number; // 行列数 默认为1
  fixedSubmit?: boolean; // 提交按钮固定
  submitter?: boolean;
  submitTarget?: Element | string; // 提交按钮挂载目标
  getSubmitDom?: (element: any, dom: any) => any; // 父级获取提交按钮
  formLayoutType: 'horizontal' | 'vertical' | 'inline'; // 表单布局
  onFinish?: (value: any) => void; // 提交表单
  onValuesChange?: (changedValues: any, value: any) => void; // 数据变化
};
const LogTag = 'BaseForm';

// 格式化表单数据
const formatValues = (_items: any[], _forms: any) => {
  for (let index = 0; index < (_items.length || 0); index++) {
    const _item = _items[index];
    switch (_item?.type) {
      // 表单-对象
      case 'form':
      case 'object':
        // !转换成数组
        if (_forms?.[_item.name]) {
          if (!_forms[_item.name]?.[0]) {
            _forms[_item.name] = [_forms[_item.name]];
          }
        }
        break;
      // 列表-数组
      case 'list':
      case 'array':
        const nnValue = [];
        for (let ii = 0; ii < _item.items?.length; ii++) {
          nnValue.push(formatValues(_item.items[ii], _forms[_item.name][ii]));
        }
        _forms[_item.name] = nnValue;
        break;
      default:
        break;
    }
  }
  return _forms;
};

// 反格式化表单数据
const backFormatValues = (_items: any[], _forms: any) => {
  for (let index = 0; index < (_items.length || 0); index++) {
    const _item = _items[index];
    switch (_item?.type) {
      // 表单-对象
      case 'form':
      case 'object':
        // !转换成数组
        if (_forms?.[_item.name]) {
          _forms[_item.name] = _forms[_item.name]?.[0];
        }
        break;
      // 列表-数组
      case 'list':
      case 'array':
        const nnValue = [];
        for (let ii = 0; ii < _item.items?.length; ii++) {
          nnValue.push(formatValues(_item.items[ii], _forms[_item.name][ii]));
        }
        _forms[_item.name] = nnValue;
        break;
      default:
        break;
    }
  }
  return _forms;
};

const BaseForm: React.FC<Props> = (props) => {
  const [forms, setForms] = React.useState(formatValues(props.items, props.forms));

  // 绑定一个 ProFormInstance 实例
  const formRef = React.useRef<ProFormInstance<any>>();

  React.useEffect(() => {
    if (props.forms) {
      // 格式化数据
      const newForms = formatValues(props.items, props.forms);
      setForms(newForms);
      formRef?.current?.setFieldsValue(newForms);
      // console.log(LogTag, 'formatValues Forms', props.forms, newForms);
    }
  }, [props.forms, props.items]);

  return (
    <ProForm
      formRef={formRef}
      layout={props.formLayoutType}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onFinish={async (values: any) => {
        // 验证数据后返回
        const val = await formRef.current?.validateFieldsReturnFormatValue?.();
        // console.log(LogTag, 'onFinish', values, val);
        if (props.onFinish) {
          // 反格式化数据
          const newForms = backFormatValues(props.items, val);
          await props.onFinish(newForms);
        }
      }}
      initialValues={{
        ...forms,
      }}
      onInit={(form: any) => {
        console.log(LogTag, 'onInit', form);
      }}
      request={async (values: any) => {
        // 刷新初始化数据
        console.log(LogTag, 'request', values);
        return await forms;
      }}
      submitter={
        props?.submitter === false
          ? false
          : {
              render: (_: any, dom: any[]) => {
                if (props?.submitTarget) {
                  // 如果有父组件需要展示，则推到目标展示
                  // 反转显示，否则会错位
                  const _dom = [...dom.reverse()];
                  const _ll = _dom?.map((dd: any) => {
                    return dd;
                  });
                  const _nodes = (
                    <Row justify={'end'}>
                      {_ll?.map((dd: any, index: number) => {
                        return (
                          <Col style={{ marginRight: '8px' }} key={index}>
                            {dd}
                          </Col>
                        );
                      })}
                    </Row>
                  );
                  // 目标渲染
                  if (props.submitTarget) {
                    // 动态位置
                    const xx = ReactDOM.createPortal(_nodes, document.body);
                    if (typeof props.submitTarget === 'string') {
                      ReactDOM.render(
                        <>{xx.children}</>,
                        document.getElementById(props.submitTarget),
                      );
                    } else {
                      ReactDOM.render(<>{xx.children}</>, props.submitTarget);
                    }
                  }

                  return [];
                } else if (props?.fixedSubmit === true) {
                  // 全局底部固定显示
                  // 反转显示，否则会错位
                  return <FooterToolbar>{[...dom.reverse()]}</FooterToolbar>;
                } else {
                  // 反转显示，否则会错位
                  return [...dom.reverse()];
                }
              },
            }
      }
      // submitter={{
      //   render: (_: any, dom: any[]) => {
      //     if (props?.submitTarget) {
      //       // 如果有父组件需要展示，则推到目标展示
      //       // 反转显示，否则会错位
      //       const _dom = [...dom.reverse()];
      //       const _ll = _dom?.map((dd: any) => {
      //         return dd;
      //       });
      //       const _nodes = (
      //         <Row justify={'end'}>
      //           {_ll?.map((dd: any, index: number) => {
      //             return (
      //               <Col style={{ marginRight: '8px' }} key={index}>
      //                 {dd}
      //               </Col>
      //             );
      //           })}
      //         </Row>
      //       );
      //       // 目标渲染
      //       if (props.submitTarget) {
      //         // 动态位置
      //         const xx = ReactDOM.createPortal(_nodes, document.body);
      //         if (typeof props.submitTarget === 'string') {
      //           ReactDOM.render(<>{xx.children}</>, document.getElementById(props.submitTarget));
      //         } else {
      //           ReactDOM.render(<>{xx.children}</>, props.submitTarget);
      //         }
      //       }

      //       return [];
      //     } else if (props?.fixedSubmit === true) {
      //       // 全局底部固定显示
      //       // 反转显示，否则会错位
      //       return <FooterToolbar>{[...dom.reverse()]}</FooterToolbar>;
      //     } else {
      //       // 反转显示，否则会错位
      //       return [...dom.reverse()];
      //     }
      //   },
      // }}
      onValuesChange={async (changedValues: any, values: any) => {
        // console.log(LogTag, 'onValuesChange', changedValues, values);
        if (props.onValuesChange) {
          await props.onValuesChange(changedValues, values);
        }
      }}
    >
      <FormBody rowCol={props.rowCol} items={props.items} forms={props.forms} />
    </ProForm>
  );
};

export default BaseForm;
