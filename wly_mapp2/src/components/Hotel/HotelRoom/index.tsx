import React, { useContext } from "react";
import { Image, Swiper, SwiperItem, View } from "@tarojs/components";
import { RoomItemProps } from "@/interface/data";
import routerUtil from "@/utils/router";
import { AtFloatLayout } from "taro-ui";
import loadimgUtil from "@/utils/loadimg";
import { BaseProps } from "@/interface/base";
import { HotelContext } from "@/utils/context";

import "./index.scss";

interface HotelRoomProps extends BaseProps {
  room: RoomItemProps | null;
  hotel_id?: number;
  cancel: () => void;
}

const HotelRoom: React.FC<HotelRoomProps> = ({ room, cancel, hotel_id }) => {
  const { hotelSelect } = useContext(HotelContext);
  const { start, end } = hotelSelect;
  return (
    <AtFloatLayout isOpened={!!room?.room_id} onClose={cancel}>
      {room && (
        <View className="hotel-room-detail">
          <View className="bold font-size8 line-height50 marginY20 paddingX20 roomName">
            {room.name}
          </View>
          <Swiper className="hotel-room-banner">
            {room.gallery?.split(",")?.map((banner, index) => (
              <SwiperItem
                key={`key_${banner}_${index}`}
                className="banner-item"
              >
                <Image className="detail-image" src={loadimgUtil(banner)} />
              </SwiperItem>
            ))}
          </Swiper>
          <View className="hotel-room-Info marginY40">
            <View className="room-title">房间信息</View>
            <View className="marginY20 room-contentBox">
              <View className="room-contentItem marginY10 font-size-4">
                面积：{room.area}
              </View>
              <View className="room-contentItem marginY10 font-size-4">
                可住人数：{room.max_man}
              </View>
              <View className="room-contentItem marginY10 font-size-4">
                床位：{room.bed}
              </View>
            </View>
          </View>
          <View className="hotel-room-Info marginY40">
            <View className="room-title">配套服务</View>
            <View className="marginY20 room-contentBox">
              {room.tags?.split(",")?.map((item, index) => (
                <View
                  className="room-tabItem marginY10 font-size-4"
                  key={index}
                >
                  {item}
                </View>
              ))}
            </View>
          </View>
          <View className="hotel-room-Info marginY40">
            <View className="room-title">房屋简介</View>
            <View className="room-content font-size-4 marginY20">
              {room.content}
            </View>
          </View>
          {/* <View className="hotel-room-banner marginY20">
            <RichText nodes={room.detail} />
          </View> */}
          <View
            className="flex-align-justify footerBtn"
            onClick={() => {
              routerUtil.goto("hotelBook", {
                room_id: room.room_id,
                start,
                end,
                hotel_id
              });
            }}
          >
            <View className="common-btn">立即预定</View>
          </View>
        </View>
      )}
    </AtFloatLayout>
  );
};

export default HotelRoom;
