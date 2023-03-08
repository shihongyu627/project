import { Image, Text, View } from '@tarojs/components';
import React from 'react';
import { BaseProps } from '@/interface/base';
import {CommodityItem} from "@/interface/data";
import routerUtil from "@/utils/router";
import loadimgUtil from "@/utils/loadimg";

import './Commodity.scss';

interface CommodityProps extends BaseProps {
  commodity: CommodityItem;
}

const Commodity: React.FC<CommodityProps> = ({ commodity}) => {
  return (
    <View className='commodity-item-box'
      onClick={() => {routerUtil.goto('commodityDetail', {id: commodity.goods_id})}}
    >
      <Image src={loadimgUtil(commodity.image)} className='commodity-image' />
      <View className='commodity-place line-ellipsis'>{commodity.title}</View>
      <View className='commodity-info flex-align-spacebetween'>
        <Text className='commodity-name line-ellipsis'>{commodity.stitle}</Text>
        <View>
          <Text className='commodity-price-tip'>人均：</Text>
          <Text className='commodity-price color-S3'>￥{commodity.price}</Text>
        </View>
      </View>
    </View>
  );
};

export default Commodity;
