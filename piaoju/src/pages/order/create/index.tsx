import { pjClientList, pjOrderAdd } from '@/services/ant-design-pro/order';
import openModal from '@/utils/page';
import ProForm, { ProFormRadio, ProFormSelect } from '@ant-design/pro-form';
import { Button, Col, Row } from 'antd';
// import { history } from 'umi';
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
const handleSubmit = async (values: API.LoginParams) => {
  const result: any = await pjOrderAdd({ ...values });
  if (result.code === 200) {
    openModal.closeModal();
    setTimeout(() => {
      const data =
        window.location.protocol +
        '//' +
        window.location.host +
        '/order/info?action=edit&id=' +
        result.result;
      window.open(data);
      // history.push(`/order/info?action=add&id=${result.result}`);
    }, 500);
    return;
  }
};
export default () => {
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
                  下一步
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
      request={async () => {
        await waitTime(100);
        return {
          name: '蚂蚁设计有限公司',
          useMode: 'chapter',
        };
      }}
    >
      <ProFormRadio.Group
        label="选择客户类型："
        name="clientType"
        valueEnum={{
          1: '贸易型企业',
          2: '生产型企业',
        }}
        rules={[{ required: true, message: '请选择客户类型' }]}
      />
      <ProFormSelect
        name="clientId"
        label="选择企业"
        showSearch
        debounceTime={300}
        width="sm"
        dependencies={['clientType']}
        request={async (params) => {
          const dd: any = {};
          if (params.clientType) {
            dd.clientType = Number(params.clientType);
            // console.log(params.clientType);
            // console.log(dd);
          }
          const result: any = await pjClientList(dd);
          const columnsArr: any[] = result.result || [];
          const res: any = [];
          columnsArr.map((item) => {
            const temp: any = {};
            temp.label = item.name;
            temp.value = item.id;
            res.push(temp);
          });
          // console.log('PjCarousel', res);
          return res;
        }}
        // options={columnsArr}
        rules={[{ required: true, message: '请选择企业' }]}
      />
    </ProForm>
  );
};
