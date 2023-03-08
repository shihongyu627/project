import { Text, View } from '@tarojs/components';
import React, {useContext, useEffect, useState} from 'react';
import { BaseProps } from '@/interface/base';
import routerUtil from "@/utils/router";
import {getMyPosition, openMap} from "@/utils/wx";
import {getLocation} from "@/api/common";
import HotelTime from "@/components/Hotel/HotelTime";
import {HotelContext} from "@/utils/context";

import './Card.scss';

interface HotelSearchCardProps extends BaseProps {
  filterFunction: (params: any) =>  void;
}

const HotelSearchCard: React.FC<HotelSearchCardProps> = ({filterFunction}) => {
  const [position, setPosition] = useState<any>({cityname: '杭州'});
  const {hotelSelect} = useContext(HotelContext);
  const {start, end} = hotelSelect;
  useEffect(() => {
    getMyPosition(false, (lngLat) => {
      filterFunction({lngLat})
      positionInfo(lngLat);
    });
  }, [])

  const positionInfo = async (lngLat) => {
    const resp = await getLocation(lngLat)
    resp && setPosition({...resp, lnglat: lngLat})
  }
  const openPosition = () => {
    openMap({...position, success: (e) => {
        console.log('e', e);
      }})
  }
  useEffect(() => {
    start && end && filterFunction({lnglat: position.lnglat, start, end})
  }, [start, end])
  return (
    <View className='hotel-search-card'>
      <View
        onClick={openPosition}
        className='hotel-search-card-place flex-align-spacebetween border-bottom'
      >
        <Text className='bold font-size6 line-height48 color-M1'>{position.cityname}</Text>
        <View className='flex-align' onClick={() => {
          getMyPosition(true, (lngLat) => {
            positionInfo(lngLat);
          })
        }}
        >
          <Text className='iconfont cm-iconbianzu color-M3 font-size2' />
          <Text className='color-M3 font-size0 margin-left4'>我的位置</Text>
        </View>
      </View>
      <HotelTime />
      <View className='common-btn margin-top30 marginX20' onClick={() => {
        routerUtil.goto('hotelSearch', {
          start,
          end,
          lnglat: position.lnglat,
        })
      }}
      >
        查找
      </View>
    </View>
  );
};

export default HotelSearchCard;
