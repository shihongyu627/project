import { pjFileQueryById } from '@/services/ant-design-pro/order';
import openModal from '@/utils/page';
import ProCard from '@ant-design/pro-card';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProForm from '@ant-design/pro-form';
import { Button, Col, Image, Row } from 'antd';
import React, { useRef } from 'react';
export type Props = {
  headerData: any[]; // 状态
};
export type TableListItem = {
  key: number;
  name: string;
  status: string;
  updatedAt: number;
  createdAt: number;
  progress: number;
  money: number;
};
const BillPreview: React.FC<Props> = (props: any) => {
  const actionRef = useRef();
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
            <Row justify={'end'} style={{ marginTop: 20 }}>
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
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    openModal.closeModal();
                  }}
                >
                  确定
                </Button>
              </Col>
            </Row>
          );
        },
      }}
      params={{}}
    >
      <ProCard
        colSpan={{ sm: 4, md: 6, lg: 6, xl: 6 }}
        headerBordered={true}
        title={<span style={{ fontWeight: 'bold' }}>上传预览图</span>}
        bordered
        direction="column"
        layout="center"
      >
        <Image width={600} src={props.data.url} />
      </ProCard>
      <ProCard
        colSpan={{ sm: 4, md: 6, lg: 6, xl: 6 }}
        headerBordered={true}
        title={<span style={{ fontWeight: 'bold' }}>识别</span>}
        bordered
        direction="column"
      >
        <ProDescriptions
          actionRef={actionRef}
          // bordered
          column={2}
          labelStyle={{ justifyContent: 'flex-end', alignItems: 'center', minWidth: 130 }}
          formProps={{
            onValuesChange: (e, f) => console.log(f),
          }}
          request={async () => {
            const data: any = [];
            if (props.id != null) {
              const dd = {
                id: props.id,
              };
              const res: any = await pjFileQueryById(dd);
              if (res.code === 200) {
                data.result = res.result;
              }
            } else {
              data.result = null;
            }
            return Promise.resolve({
              success: true,
              data: data.result || props.data,
            });
          }}
          // editable={{}}
          columns={[
            {
              title: '开票工厂',
              key: 'factory',
              dataIndex: 'factory',
              // copyable: true,
              // ellipsis: true,
            },
            {
              title: '发票代码',
              key: 'billNum',
              dataIndex: 'billNum',
              // copyable: true,
              // ellipsis: true,
            },
            {
              title: '发票号码',
              key: 'invoiceCode',
              dataIndex: 'invoiceCode',
              // copyable: true,
              // ellipsis: true,
            },
            {
              title: '品名',
              key: 'goodName',
              dataIndex: 'goodName',
              // copyable: true,
              // ellipsis: true,
            },
            {
              title: '数量',
              key: 'goodNum',
              dataIndex: 'goodNum',
              // valueType: 'digit',
            },
            {
              title: '单位',
              key: 'unit',
              dataIndex: 'unit',
              // copyable: true,
              // ellipsis: true,
            },

            {
              title: '开票金额',
              key: 'goodPrice',
              dataIndex: 'goodPrice',
              // valueType: 'digit',
              // render: (dom, entity, index, action) => {
              //   return (
              //     <Tooltip title="点击进入编辑状态">
              //       <div
              //         onClick={() => {
              //           action?.startEditable('money');
              //         }}
              //       >
              //         {dom}
              //       </div>
              //     </Tooltip>
              //   );
              // },
            },

            {
              title: '开票日期',
              key: 'fileTime',
              dataIndex: 'fileTime',
              // valueType: 'date',
            },
          ]}
        />
      </ProCard>
    </ProForm>
  );
};
export default BillPreview;
