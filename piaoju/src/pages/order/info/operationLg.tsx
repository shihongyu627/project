import { pjOrderLogList } from '@/services/ant-design-pro/order';
import ProCard from '@ant-design/pro-card';
import { Timeline } from 'antd';
import React, { useEffect, useState } from 'react';
export type Props = {
  headerData: any[]; // 状态
  queryId: any;
  syncCount: number;
};
const Header: React.FC<Props> = (props) => {
  const [LogList, setLogList] = useState([]);
  // 获取套餐列表
  const _pjOrderLogList = async () => {
    try {
      const kk: any = {};
      kk.sourceId = props.queryId;
      const res = await pjOrderLogList(kk);
      if (res?.code == 200) {
        const dd = res?.result || [];
        setLogList(dd);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    _pjOrderLogList();
  }, [props.syncCount]);
  return (
    <ProCard
      colSpan={{ sm: 4, md: 6, lg: 6, xl: 6 }}
      headerBordered={true}
      title={<span style={{ fontWeight: 'bold' }}>操作日志</span>}
      bordered
      direction="column"
      style={{ marginTop: 20 }}
    >
      <Timeline style={{ height: 200, overflowX: 'hidden', paddingTop: 20, marginBottom: 20 }}>
        {(LogList || []).map((item: any, index) => {
          return (
            <Timeline.Item key={index + 1}>
              <div style={{ paddingRight: 20 }}>
                <a type={'text'} style={{ marginRight: 10 }}>
                  {item.name}
                </a>
                <span> {item.content}</span>
              </div>
              <div>{item.createTime}</div>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </ProCard>
  );
};

export default Header;
