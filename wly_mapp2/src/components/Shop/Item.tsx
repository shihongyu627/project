import { Image, Text, View } from '@tarojs/components';
import React from 'react';
import { AtRate } from 'taro-ui';

import { BaseProps } from '@/interface/base';
import {ShopItemResponse, ShopType} from "@/interface/data";
import routerUtil from "@/utils/router";
import loadimgUtil from "@/utils/loadimg";
import Taro from "@tarojs/taro";

import './Item.scss';

interface ItemProps extends BaseProps {
  shop: ShopItemResponse;
}

const DetailType = {
  [ShopType.catering]: 'cateringDetail',
  [ShopType.hotel]: 'hotelDetail',
  [ShopType.commerce]: 'shopDetail',
}

const ShopItem: React.FC<ItemProps> = (props) => {
  const {shop, className} = props;

  return (
    <View className={`shop-item-box ${className}`} onClick={() => {
      routerUtil.goto(DetailType[shop.shop_type], {id: shop.shop_id})
    }}
    >
      <Image src={loadimgUtil(shop.shop_image)} className='shop-image' />
      <View className='shop-info'>
        <View className='shop-info-top flex-align-spacebetween'>
          <View className='shop-info-top-left flex-align'>
            <Text className='shop-info-name'>{shop.shop_name}</Text>
            <AtRate value={shop.star} />
          </View>
          {
            shop.linkman_mobile
            &&
            <Text
              className='iconfont cm-icona-lujing1 color-S3 font-size10'
              onClick={(e) => {
                e.stopPropagation();
                Taro.makePhoneCall({phoneNumber: shop.linkman_mobile
                })}}
            />
          }

        </View>
        <View className='margin-bottom10'>
          <Text className='shop-price-tip color-M2'>人均：</Text>
          <Text className='shop-price-tip color-S3'>￥{shop.per_cost}</Text>
          <Text className='shop-price-tip color-M2'> 起</Text>
        </View>
        <View className='flex-align-spacebetween'>
          <Text className='shop-place line-ellipsis'>地址：{shop.address}</Text>
          {
            !!shop.park_num
            &&
            <View>
              <Text className='shop-place-distance'>距离您 {shop.park_num} m</Text>
              <Text className='iconfont cm-iconEnvironmentFilled color-S3 font-size4 margin-left4' />
            </View>
          }
        </View>
      </View>
    </View>
  );
};

export default ShopItem;
