import React from 'react';
import useList from "@/components/Common/List/useList";
import List from "@/components/Common/List";
import ShopItem from "@/components/Shop/Item";
import {getShopList} from "@/api/shop";
import {ShopItemResponse, ShopType} from "@/interface/data";

import './index.scss';

const Index: React.FC = () => {
  const {refresh, loadMore, refreshing, list, total} = useList<ShopItemResponse>({
    getList: getShopList, filterInit: {shop_type: ShopType.commerce}
  })
  return (
    <List refresh={refresh} loadMore={loadMore} refreshing={refreshing} isLast={total === list.length}>
      <div className='paddingX20'>
        {
          list.map(item =><ShopItem key={item.shop_id} shop={item} />)
        }
      </div>
    </List>
  );
};

export default Index;
