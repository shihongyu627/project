import React, {useEffect, useState} from 'react';
import {getHotelDetail} from "@/api/hotel";
import {HotelItemProps, RoomItemProps} from "@/interface/data";
import {Image,View, Text, RichText} from "@tarojs/components";
import {useRequest} from "@/utils/request";
import {useRouter} from "@tarojs/runtime";
import RoomList from "@/components/Hotel/Room";
import Titles from "@/components/Common/Titles";
import Taro from "@tarojs/taro";
import {openMap} from "@/utils/wx";
import loadimgUtil from "@/utils/loadimg";
import HotelRoom from "@/components/Hotel/HotelRoom";
import HotelTime from "@/components/Hotel/HotelTime";
import {HotelContext, HotelSelectProps} from "@/utils/context";

import './index.scss';


const HotelDetail: React.FC = () => {
  const { params = {}} = useRouter() || {};
  const [detail, getDetail] = useRequest<HotelItemProps>((f) => getHotelDetail({
    hotel_id: params?.id as number,
    start: params.start,
    end: params.end,
    ...f
  }))
  const [room, setRoom] = useState<RoomItemProps | null>(null);
  const [hotelSelect, setHotelSelect] = useState<HotelSelectProps>({
    start: params.start as string,
    end: params.end as string,
  });
  const {start, end} = hotelSelect;
  useEffect(() => {
    start && end && getDetail({start, end})
  }, [start, end])
  return (
    <HotelContext.Provider value={{hotelSelect, refreshHotelSelect: setHotelSelect}}>
      <View className='container hotel-detail'>
        <Image
          className='hotel-detail-image'
          src={loadimgUtil(detail?.image || '')}
        />
        <View className='hotel-detail-card'>
          <View className='flex-align-spacebetween margin-bottom10'>
            <View className='margin-bottom20'>
              <View className='hotel-title'>
                {detail?.title}
              </View>
              <View className='flex-align'>
                <Text>{detail?.stitle}</Text>
              </View>
            </View>
            {
              (detail?.linkman_mobile || detail?.hotline)
              &&
              <View className='flex-column-center color-S3 padding-right20'
                onClick={(e) => {
                      e.stopPropagation();
                      Taro.makePhoneCall({phoneNumber: detail?.linkman_mobile || detail?.hotline})
                    }}
              >
                <Text className='iconfont font-size4 cm-icona-lujing1' />
                <Text  className='hotel-share'>电话</Text>
              </View>
            }
          </View>
          <View className='flex-align-spacebetween'>
            <View className='hotel-detail-info-card flex-column-justify'>
              <Text>{detail?.star_name}</Text>
              <Text>{detail?.star}分</Text>
            </View>
            <View className='hotel-detail-info-card-b flex-align-spacebetween'>
              <View className='flex1 overflow-hidden'>
                <View className='line-ellipsis line-height50 bold line-ellipsis'>{detail?.address}</View>
                <View className='color-M3 line-height40'>距离您直线距离{detail?.distance || 0}米</View>
              </View>
              <View
                className='flex-column-center color-S3'
                onClick={() => {
                  const [longitude,latitude] = detail?.lnglat?.split(',') || []
                  openMap({
                    latitude: Number(latitude),
                    longitude: Number(longitude),
                    name: detail?.title,
                    address: detail?.address,
                  })}
                }
              >
                <Text className='iconfont font-size4 cm-iconEnvironmentFilled' />
                <Text  className='hotel-share nowrap'>导航</Text>
              </View>
            </View>
          </View>
        </View>
        <RoomList className='margin-top30'
          hotel_id={detail?.hotel_id}
          room_list={detail?.room_list || []}
          onClick={(r) => {setRoom(r)}}
        >
          <HotelTime className='hotel-time-reset' />
        </RoomList>
        <HotelRoom room={room}
          hotel_id={detail?.hotel_id}
          cancel={() => {setRoom(null)}}
        />
        <View className='hotel-info-card'>
          <Titles
            names={['酒店详情','酒店政策']}
            renderContent={(index) =>
              <div className='margin-top30'>
                <RichText nodes={!index ? detail?.detail : detail?.policy} />
              </div>
            }
          />
        </View>
      </View>
    </HotelContext.Provider>
  );
};

export default HotelDetail;
