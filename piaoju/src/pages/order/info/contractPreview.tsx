import React, { useRef, useState } from 'react';
import { Row, Col, Button } from 'antd';
import ProForm from '@ant-design/pro-form';
import openModal from '@/utils/page';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { downloadPDF } from '@/utils/padf';
export type TableListItem = {
  key: number;
  name: string;
  status: string;
  updatedAt: number;
  createdAt: number;
  progress: number;
  money: number;
};
type DataSourceType = {
  id: React.Key;
  title?: string;
  readonly?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  update_at?: string;
  children?: DataSourceType[];
};

export type Props = {
  headerData: any[]; // 状态
};
const Header: React.FC<Props> = (props) => {
  console.log(props);
  const defaultData: DataSourceType[] = [
    {
      id: 1,
      title: '活动名称一',
      readonly: '活动名称一',
      decs: '这个活动真好玩',
      state: 'open',
      created_at: '2020-05-26T09:42:56Z',
      update_at: '2020-05-26T09:42:56Z',
    },
    {
      id: 2,
      title: '活动名称二',
      readonly: '活动名称二',
      decs: '这个活动真好玩',
      state: 'closed',
      created_at: '2020-05-26T08:19:22Z',
      update_at: '2020-05-26T08:19:22Z',
    },
  ];
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      // 第一行不允许编辑
      readonly: true,
      width: 60,
    },
    {
      title: '文件',
      dataIndex: 'readonly',
      readonly: true,
      width: 100,
    },
    {
      title: '上传日期',
      dataIndex: 'created_at',
      readonly: true,
      width: 100,
    },
    {
      title: '收到日期',
      dataIndex: 'update_at',
      valueType: 'date',
      width: 100,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 130,
      align: 'center',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const pdf = useRef(null);
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
                <Button
                  onClick={() => {
                    // openModal.closeModal();
                    downloadPDF(pdf.current);
                  }}
                >
                  导出
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
      <div ref={pdf}>
        <EditableProTable<DataSourceType>
          rowKey="id"
          scroll={{
            x: 700,
          }}
          recordCreatorProps={false}
          loading={false}
          style={{ marginTop: 20 }}
          columns={columns}
          request={async () => ({
            data: defaultData,
            total: 3,
            success: true,
          })}
          value={dataSource}
          onChange={setDataSource}
        />
      </div>
    </ProForm>
  );
};
export default Header;
