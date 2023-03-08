import {Image, Swiper, SwiperItem, View} from '@tarojs/components';
import React, {useEffect} from 'react';
import IconName from "@/components/IconName";
import Title from "@/components/Common/Title";
import {getCommerceIndex} from "@/api/common";
import ShopItem from "@/components/Shop/Item";
import Commodity from "@/components/Shop/Commodity";
import {useRequest} from "@/utils/request";
import {IndexData} from "@/interface/data";
import SearchGuide from "@/components/Common/SearchGuide";
import {AtNoticebar} from 'taro-ui'
import routerUtil from "@/utils/router";
import {Cache, CacheKey} from "@/utils";
import {getMyPosition} from "@/utils/wx";
import loadimgUtil from "@/utils/loadimg";

import './index.scss';

const Index: React.FC = () => {
  const [indexData] = useRequest<IndexData>(getCommerceIndex)
  const toDetail = () => {
    if (indexData?.notices?.length) {
      Cache.set(CacheKey.RICH, indexData?.notices[0])
      routerUtil.goto('rich')
    }
  }

  useEffect(() => {
    getMyPosition();
  }, [])

  return (
    <View className='container-no-height commerce-box'>
      <SearchGuide guideName='search' />
      <Swiper className='banner-box'>
        {
          indexData && indexData?.banners?.map(banner => (
            <SwiperItem key={banner.id} className='banner-item-box'>
              <Image
                className='commerce-image'
                src={loadimgUtil(banner.image)}
              />
              <View className='commerce-image-info'>
                <View className='commerce-image-info-title'>{banner.title}</View>
                <View className='commerce-image-info-tip'>{banner.stitle}</View>
              </View>
            </SwiperItem>
          ))
        }
      </Swiper>
      <View className='flex-align-spacebetween paddingX24'>
        <IconName iconName='new' guideName='rich' name='新手指南' />
        <IconName iconName='in' guideName='shopIn' name='商家入驻' />
        <IconName iconName='good' name='精选商品' guideName='commodity' />
        <IconName iconName='shop' name='精选商家' guideName='shop' />
      </View>
      <View onClick={toDetail}>
        <AtNoticebar
          className='notice-box flex-align'
          icon='iconfont cm-icona-xingzhuang4 color-S3 font-size6'
          single
        >
          {indexData?.notices?.length &&indexData?.notices[0]?.title}
        </AtNoticebar>
      </View>
      <View className='paddingX20'>
        <Title name='推荐商家' guideName='shop' className='marginY30' />
        {
          indexData?.top_shop2_list?.map(item =><ShopItem key={`key_shop_${item.shop_id}`} shop={item} />)
        }
        <Title name='推荐商品' guideName='commodity' className='marginY30'  />
        <div className='flex-align-spacebetween flex-wrap'>
          {
            indexData?.top_goods_list?.map(item =><Commodity key={item.goods_id} commodity={item} />)
          }
        </div>

      </View>
    </View>
  );
};

export default Index;
