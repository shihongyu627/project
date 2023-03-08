import React, {useEffect} from 'react';
import useList from "@/components/Common/List/useList";
import List from "@/components/Common/List";
import ShopItem from "@/components/Shop/Item";
import {getShopList} from "@/api/shop";
import {Image, Swiper, SwiperItem} from "@tarojs/components";
import {ShopItemResponse, ShopType} from "@/interface/data";
import {useRequest} from "@/utils/request";
import {getBanner} from "@/api/common";
import {getMyPosition} from "@/utils/wx";
import loadimgUtil from "@/utils/loadimg";

import './index.scss';

const Index: React.FC = () => {
  const { loadMore, refreshing, list, total, filterFunction} = useList<ShopItemResponse>({getList: getShopList, filterInit: {shop_type: ShopType.catering}})
  const [banners] = useRequest(getBanner)
  useEffect(() => {
    getMyPosition(false, (lngLat) => {
      filterFunction({lnglat: lngLat})
    });
  }, [])
  return (
    <List
      className='container-no-height'
      loadMore={loadMore}
      refreshing={refreshing}
      isLast={total === list.length}
      renderHeader={(
        <Swiper className='catering-banner-box' nextMargin='14px'>
          {
            banners?.map((banner, index) => (
              <SwiperItem key={`key_${banner}_${index}`}>
                <Image
                  className='catering-banner-image'
                  src={loadimgUtil(banner.image)}
                />
              </SwiperItem>
            ))
          }
        </Swiper>
      )}
    >
      <div className='paddingX20'>
        {
          list.map(item =><ShopItem key={item.shop_id} shop={item} />)
        }
      </div>
    </List>
  );
};

export default Index;
