import React from "react";
import {BaseProps} from "@/interface/base";
import {View, Image, Text} from "@tarojs/components";
import {BookItem} from "@/interface/data";
import loadimgUtil from "@/utils/loadimg";
import './OrderItem.scss'

interface OrderItemProps extends BaseProps{
  book: BookItem;
}

const OrderItem: React.FC<OrderItemProps> = ({book}) => {
  const {shop_info, hotel_info,num,linkman_mobile, room_name, time } = book;
  return (<View className='order-hotel-box flex-align'>
    <Image className='order-hotel-image' src={loadimgUtil(hotel_info?.image || shop_info?.shop_image)} />
    <View className='order-hotel-info'>
      <View className='flex-align-spacebetween'>
        <Text className='hotel-name'>{hotel_info?.title || shop_info?.shop_name}</Text>
        <Text className='order-status'>{book.status_name}</Text>
      </View>
      {
        room_name &&
        <View className='hotel-room'>{room_name}</View>
      }
      <View className='info-line'>
        <Text className='info-title'>预约人数：</Text>
        <Text className='info-content'>{num}人</Text>
      </View>
      <View  className='info-line'>
        <Text className='info-title'>预留电话：</Text>
        <Text className='info-content'>{linkman_mobile}</Text>
      </View>
      <View className='info-line'>
        <Text className='info-title'>预定时间：{time}</Text>
      </View>
    </View>
  </View>);
}

export default OrderItem;
