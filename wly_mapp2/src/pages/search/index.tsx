import {View} from '@tarojs/components';
import React, {useEffect, useState} from 'react';
import {AtSearchBar, AtTabs, AtTabsPane} from "taro-ui";
import useList from "@/components/Common/List/useList";
import {CommodityItem, HotelItemProps, ShopItemResponse, ShopType} from "@/interface/data";
import {getShopList} from "@/api/shop";
import {getHotelList} from "@/api/hotel";
import {getCommodityList} from "@/api/good";
import {getSearchHot} from "@/api/common";
import ShopItem from "@/components/Shop/Item";
import HotelItem from "@/components/Hotel/Item";
import Commodity from "@/components/Shop/Commodity";
import {Cache, CacheKey} from "@/utils";
import {useRequest} from "@/utils/request";

import './index.scss';

const Index: React.FC = () => {
  const [current, setCurrent] = useState<number>(0)
  const [searchKey, setSearchKey] = useState<string>('')
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const searchList = Cache.get(CacheKey.SEARCH_KEY);
  const [config] = useRequest(getSearchHot)
  const {list: shops, filterFunction: getShops} = useList<ShopItemResponse>(
    {getList: getShopList, isLoadFirst: false, filterInit: {shop_type: ShopType.commerce}}
  )
  const {list: caterings, filterFunction: getCaterings} = useList<ShopItemResponse>(
    {getList: getShopList, isLoadFirst: false, filterInit: {shop_type: ShopType.catering}}
  )
  const {list: hotels, filterFunction: getHotels} = useList<HotelItemProps>(
    {getList: getHotelList, isLoadFirst: false}
  )
  const {list: goods, filterFunction: getGoods} = useList<CommodityItem>(
    {getList: getCommodityList, isLoadFirst: false}
  )
  useEffect(() => {
    getCurrentList();
  }, [current])
  useEffect(() => {
    !searchKey && setShowSearch(false);
  }, [searchKey])
  const getCurrentList = () => {
    switch (current) {
      case 0:
        getShops({search: searchKey});
        break;
      case 1:
        getCaterings({search: searchKey});
        break;
      case 2:
        getHotels({search: searchKey});
      case 3:
        getGoods({search: searchKey});
        break;
    }
  }
  const toSearch = () => {
    getCurrentList()
    setShowSearch(true)
    const list = [...new Set([searchKey,...searchList])]
    searchKey && Cache.set(CacheKey.SEARCH_KEY, list)
  }
  return (
    <View
      className='container-no-height search-page'
      style={{backgroundColor: '#ffffff'}}
    >
      <AtSearchBar value={searchKey}
        onChange={(_, event) => {
                     setSearchKey(event.detail.value)
                   }}
        onActionClick={toSearch}
      />
      {
        showSearch ?
          <AtTabs
            tabList={[
              { title: '电商' },
              { title: '餐饮' },
              { title: '酒店' },
              { title: '商品' },
            ]}
            onClick={(value) => {setCurrent(value)}}
            current={current}
          >
            <AtTabsPane current={current} index={0} className='bgcolor-M9'>
              <View className='paddingX20'>
                {
                  shops.map(item => (<ShopItem shop={item} key={item.shop_id} />))
                }
              </View>
            </AtTabsPane>
            <AtTabsPane current={current} index={1}>
              <View className='paddingX20'>
                {
                  caterings.map(item => (<ShopItem shop={item} key={item.shop_id} />))
                }
              </View>
            </AtTabsPane>

            <AtTabsPane current={current} index={2}>
              <View className='paddingX20'>
                {
                  hotels.map(item => (<HotelItem hotel={item} key={item.hotel_id} />))
                }
              </View>
            </AtTabsPane>
            <AtTabsPane current={current} index={3}>
              <View className='paddingX20'>
                {
                  goods.map(item => <Commodity commodity={item} key={item.goods_id} />)
                }
              </View>
            </AtTabsPane>
          </AtTabs>
          :
          <View className='bgcolor-M9'>
            {
              !!searchList?.length
              &&
              <View className='padding30'>
                <View className='common-title'>历史搜索</View>
                <View className='flex-align'>{
                  searchList.map((item, index) =>
                    <View className='common-tag flex-align-justify'
                      key={`key_tag_${index}`}
                      onClick={() => {setSearchKey(item)}}
                    >
                      {item}
                    </View>
                  )}
                </View>
              </View>
            }
            {
              !!config?.search_hot_tags?.value
              &&
              <View className='padding30'>
                <View className='common-title'>热门搜索</View>
                <View className='flex-align'>{
                  config?.search_hot_tags?.value?.split(',').map((item, index) =>
                    <View className='common-tag flex-align-justify'
                      key={`key_tag_${index}`}
                      onClick={() => {setSearchKey(item)}}
                    >
                      {item}
                    </View>
                  )}
                </View>
              </View>
            }
          </View>
      }
    </View>
  );
};

export default Index;
