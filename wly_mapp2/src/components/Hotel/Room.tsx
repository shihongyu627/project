import {Image, View} from '@tarojs/components';
import React, {useContext, useEffect, useState} from 'react';
import {RoomItemProps, RoomTypeItemProps} from "@/interface/data";
import {BaseProps} from '@/interface/base';
import routerUtil from "@/utils/router";
import loadimgUtil from "@/utils/loadimg";
// import {Cache, CacheKey} from '@/utils/cache'
import {HotelContext} from "@/utils/context";

import './Room.scss';

interface RoomListProps extends BaseProps {
  room_list: RoomTypeItemProps[];
  hotel_id?: number;
  onClick: (room: RoomItemProps) => void;
}

const RoomList: React.FC<RoomListProps> = ({ room_list, onClick, children, hotel_id }) => {
  const [current, setCurrent] = useState<number>()
  useEffect(() => {
    room_list?.length && setCurrent(room_list[0].type_id)
  }, [room_list])
  const {hotelSelect} = useContext(HotelContext);
  const {start, end} = hotelSelect;

  return (
    <View className='room-item-list marginXauto'>
      {children}
      <View className='margin-top24 margin-bottom24 room-item-tab flex-align'>
        {room_list?.map((item, index) => (
          <View
            className={`type-item flex-align-justify ${current === item.type_id && 'type-item-selected'}`}
            key={`key_type_${index}`}
            onClick={() => {setCurrent(item.type_id)}}
          >
            {item.type_name}
          </View>
        ))}
      </View>
      {
        room_list
          ?.filter(item => item.type_id === current)
          ?.map(itemType => itemType.list.map(item =>             <View
              key={item.room_id}
              className='room-item flex-align'
              onClick={() => {
                onClick(item)
                // Cache.set(CacheKey.ROOM_ITEM,item)
                // routerUtil.goto('hotelRoom')
              }}
          >
              <Image src={loadimgUtil(item.image)} className='room-item-image margin-right10 margin-bottom20' />
              <View className='room-item-info line-ellipsis'>
                <View className='line-height40 bold margin-bottom6'>{item.name}</View>
                <View className='line-height28 font-size-4 color-M3 margin-bottom12 line-ellipsis'>{item.sname}</View>
                <View className='line-height28 font-size-4 color-M3 margin-bottom12 line-ellipsis'>{item.tags}</View>
                <View className='line-height50 color-S3'>￥{item.price}</View>
              </View>
              <View
                className='room-item-book bgcolor-S3 color-M9 flex-align-justify'
                onClick={(e) => {
                  e.stopPropagation();
                  routerUtil.goto('hotelBook', {room_id: item.room_id, hotel_id, start, end})
                }}
              >
                预定
              </View>
            </View>
          ))
      }
    </View>
  );
};

export default RoomList;
