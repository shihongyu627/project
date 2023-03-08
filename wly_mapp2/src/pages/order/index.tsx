import {View} from '@tarojs/components';
import React, {useState} from 'react';
import {AtTabs,AtTabsPane} from "taro-ui";
import OrderItem from "@/pages/order/components/OrderItem";
import useList from "@/components/Common/List/useList";
import {getBookList} from "@/api/common";
import {BookItem} from "@/interface/data";

import './index.scss';


const Index: React.FC = () => {
  const [current, setCurrent] = useState<number>(0)
  const {list} = useList<BookItem>({getList: getBookList, filterInit: {type: 2}})
  const {list: cateringBooks} = useList<BookItem>({getList: getBookList, filterInit: {type: 1}})
  return (
    <View className='container'>
      <AtTabs
        tabList={[
          { title: '住宿预约' },
          { title: '包厢预约' },
        ]}
        onClick={(value) => {setCurrent(value)}}
        current={current}
      >
      <AtTabsPane current={current} index={0}>
        {
          list?.map(item => (
            <OrderItem
              key={item.book_no}
              book={item}
            />
          ))
        }
      </AtTabsPane>
      <AtTabsPane current={current} index={1}>
        {
          cateringBooks?.map(item => (
            <OrderItem
              key={item.book_no}
              book={item}
            />
          ))
        }
      </AtTabsPane>
      </AtTabs>
    </View>
  );
};

export default Index;
