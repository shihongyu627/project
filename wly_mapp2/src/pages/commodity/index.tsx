import React from 'react';
import useList from "@/components/Common/List/useList";
import List from "@/components/Common/List";
import Commodity from "@/components/Shop/Commodity";
import {getCommodityList} from "@/api/good";
import {CommodityItem} from "@/interface/data";
import './index.scss';

const Index: React.FC = () => {
  const {refresh, loadMore, refreshing, list, total} = useList<CommodityItem>({getList: getCommodityList})
  return (
    <List refresh={refresh} loadMore={loadMore} refreshing={refreshing} isLast={total === list.length}>
      <div className='flex-align-spacebetween flex-wrap padding20'>
        {
          list.map(item =><Commodity key={item.goods_id} commodity={item} />)
        }
      </div>

    </List>
  );
};

export default Index;
