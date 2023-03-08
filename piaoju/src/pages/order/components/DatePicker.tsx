import { pjOrderEditDate } from '@/services/ant-design-pro/order';
import openModal from '@/utils/page';
import ProForm, { ProFormDatePicker } from '@ant-design/pro-form';
import { Button, Col, message, Row } from 'antd';
import React from 'react';
import moment from 'moment';
export type Props = {
  type: ''; // 类型
  selectedRowsState: any[];
};

const SelectDate: React.FC<Props> = (props: any) => {
  const handleSubmit = async (values: any) => {
    //1，批量认证时间  2，批量申报时间  3，批量退税时间  4，批量付款时间
    if (!values?.dateTime) {
      return message.error('请选择时间');
    }
    try {
      const data: any = {};
      if (props?.type == 1) {
        data.authenticationTime = values?.dateTime;
      }
      if (props?.type == 2) {
        data.taxRefundTime = values?.dateTime;
      }
      if (props?.type == 3) {
        data.drawbackTime = values?.dateTime;
      }
      if (props?.type == 4) {
        data.arrearageTime = values?.dateTime;
      }
      const idArr: any = [];
      const dataArr = props?.selectedRows || [];
      dataArr.map((item: any) => {
        idArr.push(item.id);
      });
      const idStr = idArr.join(',');
      data.ids = idStr;
      const result: any = await pjOrderEditDate({ ...data });
      // console.log('pjOrderEditDate', result);
      if (result.code === 200) {
        // console.log('login', result);
        openModal.closeModal();
        props.reloadAndRest();
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ProForm<{
      name: string;
      company?: string;
      useMode?: string;
    }>
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      grid={false}
      rowProps={{
        gutter: [16, 0],
      }}
      submitter={{
        render: () => {
          return (
            <Row justify={'end'}>
              <Col style={{ marginRight: '8px' }}>
                <Button
                  onClick={() => {
                    openModal.closeModal();
                  }}
                >
                  取消
                </Button>
              </Col>
              <Col style={{ marginRight: '8px' }}>
                <Button type="primary" htmlType="submit">
                  确认
                </Button>
              </Col>
            </Row>
          );
        },
      }}
      onFinish={async (values) => {
        // console.log(values);
        await handleSubmit(values as API.LoginParams);
      }}
      params={{}}
    >
      <ProFormDatePicker
        fieldProps={{
          format: 'YYYY-MM-DD',
          disabledDate: (currentDate: any) => {
            return currentDate > moment().endOf('day');
          },
        }}
        width="md"
        name={'dateTime'}
      />
    </ProForm>
  );
};

export default SelectDate;
