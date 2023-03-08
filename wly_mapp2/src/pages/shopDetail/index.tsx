import React from 'react';
import { ShopItemResponse} from "@/interface/data";
import {Image, View, Text, Swiper, SwiperItem} from "@tarojs/components";
import {useRequest} from "@/utils/request";
import {useRouter} from "@tarojs/runtime";
import {getShopDetail} from "@/api/shop";
import loadimgUtil from "@/utils/loadimg";
import IconName from "@/components/IconName";
import Taro from "@tarojs/taro";
import Title from "@/components/Common/Title";
import Commodity from "@/components/Shop/Commodity";

import './index.scss';
import {openMap} from "@/utils/wx";

const commonStyle = {
  fontSize: Taro.pxTransform(24),
  lineHeight: Taro.pxTransform(33),
  color: '#aaa',
  marginTop: 0,
}


const Index: React.FC = () => {
  const { params = {}} = useRouter() || {};
  const [detail] = useRequest<ShopItemResponse>(() => getShopDetail(params?.id))
  const images = detail?.shop_gallery?.split(',')?.filter(item => !!item) || [];
  return (
    <View className='container shop-detail'>
      <Swiper className='shop-banner-box' nextMargin='20px'>
        {
          detail && [...images, detail?.shop_image]?.map((banner, index) => (
            <SwiperItem key={`key_${banner}_${index}`} className='banner-item'>
              <Image
                className='detail-image'
                src={loadimgUtil(banner)}
              />
            </SwiperItem>
          ))
        }
      </Swiper>
      <View className='paddingX20'>
        <View className='flex-align-spacebetween margin-bottom10'>
          <Text className='color-M1 bold font-size8 line-height50'>{detail?.shop_name}</Text>
        </View>
        {
          detail?.shop_content
          &&
          <View className='margin-bottom60'>
            <View className='color-M1 bold margin-bottom10'>商家简介</View>
            <View className='color-M4 line-height30'>{detail?.shop_content}</View>
          </View>
        }
        <View className='flex-align-spacebetween margin-bottom10'>
          <View className='flex1'>
            <View className='color-M1 line-height33'>地址：{detail?.address}</View>
            {
              (detail?.linkman_mobile|| detail?.hotline)
                &&
              <View className='color-M4 line-height30 margin-top6'>联系电话：{detail?.linkman_mobile|| detail?.hotline}</View>
            }
          </View>
          <View className='flex-align'>
            <IconName
              className='paddingX10'
              name='导航'
              iconName='cm-iconEnvironmentFilled'
              nameStyle={commonStyle}
              iconSize={44}
              onClick={() => {
                const [longitude,latitude] = detail?.lnglat?.split(',') || []
                openMap({
                  latitude: Number(latitude),
                  longitude: Number(longitude),
                  name: detail?.shop_name,
                  address: detail?.address,
                })}
              }
            />
            {
              (detail?.linkman_mobile || detail?.hotline)
              &&
              <IconName
                className='paddingX10'
                name='电话'
                iconName='cm-icona-lujing1'
                nameStyle={commonStyle}
                iconSize={44}
                onClick={(e) => {
                  e.stopPropagation();
                  Taro.makePhoneCall({phoneNumber: detail?.linkman_mobile || detail?.hotline})
                }}
              />
            }
          </View>
        </View>
        <Title name='推荐商品' className='margin-bottom30' />
        <div className='flex-align-spacebetween flex-wrap'>
          {
            detail?.top_goods_list?.map(item =><Commodity key={item.goods_id} commodity={item} />)
          }
        </div>
      </View>
    </View>
  );
};

export default Index;
