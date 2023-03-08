import ProCard from '@ant-design/pro-card';
import type { ProFormInstance } from '@ant-design/pro-components';
import ProForm, {
  ProFormDatePicker,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { Col, message, Row } from 'antd';
import moment from 'moment';
import type { PropsWithChildren } from 'react';
import React, { useImperativeHandle, useRef } from 'react';
export interface Props extends PropsWithChildren<any> {
  dataInfo: {}; // 状态
  syncCount: number;
}
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};
const OtherData: React.FC<Props> = React.forwardRef((props, ref) => {
  const formRef = useRef<ProFormInstance<{}>>();
  useImperativeHandle(ref, () => ({
    getFieldsValue: () => {
      return formRef.current.getFieldsValue();
    },
    getFieldsFormatValue: () => {
      return formRef.current.getFieldsFormatValue();
    },
    setFieldsValue: (value: any) => {
      return formRef.current.setFieldsValue(value);
    },
  }));
  React.useEffect(() => {
    formRef?.current?.setFieldsValue(props?.dataInfo);
  }, [props?.dataInfo]);
  const userInfo = `${localStorage.getItem('userInfo')}`;
  const datasuserInfo = JSON.parse(userInfo);
  return (
    <ProCard
      colSpan={{ sm: 4, md: 6, lg: 6, xl: 6 }}
      headerBordered={true}
      title={
        <span id="order_other" style={{ fontWeight: 'bold' }}>
          其他信息
        </span>
      }
      bordered
      direction="column"
      style={{ marginTop: 20 }}
      layout="center"
    >
      <ProForm<{
        name: string;
      }>
        {...formItemLayout}
        layout={'horizontal'}
        onFinish={async (values) => {
          await waitTime(2000);
          console.log(values);
          message.success('提交成功');
        }}
        params={{}}
        submitter={false}
        grid={true}
        initialValues={{ ...props?.dataInfo }}
        labelCol={{ span: 6 }}
        size="middle"
        labelAlign="right"
        formRef={formRef}
      >
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} xl={8} xxl={8}>
            <ProFormText
              // labelCol={{ span: 8 }}
              // wrapperCol={{ span: 14 }}
              width="sm"
              name="fobMoney"
              label="FOB金额"
              disabled
              // hidden={false}
              placeholder="请输入"
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={8} xxl={8}>
            <ProFormText
              // labelCol={{ span: 8 }}
              // wrapperCol={{ span: 14 }}
              width="sm"
              name="sumPrice"
              label={'商品总价(' + (props.dataInfo.unit || '/') + ')'}
              disabled
              // hidden={false}
              placeholder="请输入"
            />
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={8}
            xxl={8}
            style={{
              display: props.dataInfo.comboType === 'A' ? 'none' : '',
            }}
          >
            <ProFormText
              // labelCol={{ span: 10 }}
              // wrapperCol={{ span: 14 }}
              width="sm"
              name="exportInvoiceMoney"
              label="出口发票金额"
              disabled
              placeholder="请输入"
            />
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={8}
            xxl={8}
            style={{
              display: props.dataInfo.comboType === 'A' ? 'none' : '',
            }}
          >
            <ProFormText
              // labelCol={{ span: 8 }}
              // wrapperCol={{ span: 14 }}
              width="sm"
              name="monthExchange"
              label="月汇率"
              disabled
              placeholder="请输入"
            />
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={8}
            xxl={8}
            style={{
              display: props.dataInfo.comboType === 'A' ? 'none' : '',
            }}
          >
            <ProFormText
              // labelCol={{ span: 8 }}
              // wrapperCol={{ span: 14 }}
              width="sm"
              name="drawbackMoney"
              label="退税金额"
              disabled
              placeholder="请输入"
            />
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={8}
            xxl={8}
            style={{
              display:
                props.dataInfo.clientType === 2 || props.dataInfo.comboType === 'A' ? 'none' : '',
            }}
          >
            <ProFormText
              width="sm"
              name="inputInvoiceMoney"
              label="进项发票总额"
              disabled
              placeholder="请输入"
            />
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={8}
            xxl={8}
            style={{
              display: props.dataInfo.comboType === 'A' ? 'none' : '',
            }}
          >
            <ProFormDatePicker
              fieldProps={{
                format: 'YYYY-MM-DD',
                disabledDate: (currentDate) => {
                  // console.log(currentDate);
                  return currentDate > moment().endOf('day');
                  // return _disabledDate(currentDate);
                },
              }}
              width="sm"
              name="drawbackTime"
              label="退税时间"
            />
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={8}
            xxl={8}
            style={{
              display: props.dataInfo.comboType === 'A' ? 'none' : '',
            }}
          >
            <ProFormDatePicker
              fieldProps={{
                format: 'YYYY-MM-DD',
                disabledDate: (currentDate) => {
                  // console.log(currentDate);
                  return currentDate > moment().endOf('day');
                  // return _disabledDate(currentDate);
                },
              }}
              width="sm"
              name="taxRefundTime"
              label="退税申报时间"
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={8} xxl={8}>
            <ProFormDigit
              // labelCol={{ span: 8 }}
              // wrapperCol={{ span: 14 }}
              width="sm"
              name="expressFee"
              label="快递费"
              fieldProps={{ precision: 2 }}
              placeholder="请输入"
            />
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={8}
            xxl={8}
            style={{
              display: datasuserInfo.roleCode === 'client' ? 'none' : '',
            }}
          >
            <ProFormDigit
              // labelCol={{ span: 8 }}
              // wrapperCol={{ span: 14 }}
              width="sm"
              name="serviceCharge"
              label="服务费"
              fieldProps={{ precision: 2 }}
              placeholder="请输入"
            />
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={8}
            xxl={8}
            style={{
              display: datasuserInfo.roleCode === 'client' ? 'none' : '',
            }}
          >
            <ProFormDatePicker
              // labelCol={{ span: 10 }}
              // wrapperCol={{ span: 14 }}
              fieldProps={{
                format: 'YYYY-MM-DD',
                disabledDate: (currentDate) => {
                  // console.log(currentDate);
                  return currentDate > moment().endOf('day');
                  // return _disabledDate(currentDate);
                },
              }}
              width="sm"
              name="arrearageTime"
              label="付款时间"
            />
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={8}
            xxl={8}
            style={{
              display:
                props.dataInfo.clientType === 2 || props.dataInfo.comboType === 'A' ? 'none' : '',
            }}
          >
            <ProFormDatePicker
              // labelCol={{ span: 10 }}
              // wrapperCol={{ span: 14 }}
              fieldProps={{
                format: 'YYYY-MM-DD',
                disabledDate: (currentDate) => {
                  // console.log(currentDate);
                  return currentDate > moment().endOf('day');
                  // return _disabledDate(currentDate);
                },
              }}
              width="sm"
              name="authenticationTime"
              label="进项票认证时间"
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={8} xxl={8}>
            <ProFormTextArea
              // labelCol={{ span: 8 }}
              // wrapperCol={{ span: 14 }}
              width="sm"
              name="remark"
              label="备注"
              // hidden={false}
              placeholder="请输入"
            />
          </Col>
        </Row>
      </ProForm>
    </ProCard>
  );
});
export default OtherData;
