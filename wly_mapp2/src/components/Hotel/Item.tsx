import { Image, Text, View } from '@tarojs/components';
import React, {useContext} from 'react';
import {HotelItemProps} from "@/interface/data";
import { BaseProps } from '@/interface/base';
import routerUtil from "@/utils/router";
import loadimgUtil from "@/utils/loadimg";
import {HotelContext} from "@/utils/context";

import './Item.scss';

interface ItemProps extends BaseProps {
  hotel: HotelItemProps;
}

const HotelItem: React.FC<ItemProps> = ({ hotel }) => {
  const {hotelSelect} = useContext(HotelContext);
  const {start, end} = hotelSelect;
  return (
    <View className='hotel-item-box'
      onClick={() => {routerUtil.goto('hotelDetail', {id: hotel.hotel_id, start, end})}}
    >
      <View className='relative'>
        <Image src={loadimgUtil(hotel.image)} className='hotel-image' />
        <View className='hotel-address flex-align color-M8'>
          <Text className='iconfont color-M9 font-size-4 EnvironmentFilled' />
          <Text className='line-ellipsis flex1'>{hotel.address}</Text>
          <Text className='flex-shrink0'> | {hotel.distance || 0} m</Text>
        </View>
      </View>
      <View className='hotel-name bold'>{hotel.title}</View>
      <View className='flex-align-spacebetween paddingX16'>
        <View className='hotel-level color-S3 font-size2 line-height36'>{hotel.level}</View>
        <View className='flex-align'>
          <Text className='color-S3 font-size8 bold'>
            ￥{hotel.price_base}
          </Text>
          <Text className='font-size-4 color-M4 margin-left4'>起</Text>
        </View>
      </View>
    </View>
  );
};

export default HotelItem;
