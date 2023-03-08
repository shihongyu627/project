import React from "react";
import { ShopItemResponse } from "@/interface/data";
import {
  Image,
  View,
  Text,
  Swiper,
  SwiperItem,
  RichText
} from "@tarojs/components";
import { useRequest } from "@/utils/request";
import { useRouter } from "@tarojs/runtime";
import { getShopDetail } from "@/api/shop";
import { AtRate } from "taro-ui";
import IconName from "@/components/IconName";
import Taro from "@tarojs/taro";
import Title from "@/components/Common/Title";
import routerUtil from "@/utils/router";
import loadimgUtil from "@/utils/loadimg";
import { openMap } from "@/utils/wx";

import "./index.scss";

const commonStyle = {
  fontSize: Taro.pxTransform(24),
  lineHeight: Taro.pxTransform(33),
  color: "#aaa",
  marginTop: 0
};

const Index: React.FC = () => {
  const { params = {} } = useRouter() || {};
  const [detail] = useRequest<ShopItemResponse>(() =>
    getShopDetail(params?.id)
  );
  const images = detail?.shop_gallery?.split(",")?.filter(item => !!item) || [];
  let htmlData = detail?.cert_detail || "";
  let richHtml = "";
  if (htmlData) {
    richHtml = htmlData.replace(/style="/g, `style="display:flex;`);
  }
  console.log(richHtml);

  return (
    <View className='container catering-detail'>
      <Swiper className='catering-banner-box' nextMargin='20px'>
        {detail &&
          [...images, detail?.shop_image]?.map((banner, index) => (
            <SwiperItem key={`key_${banner}_${index}`} className='banner-item'>
              <Image className='detail-image' src={loadimgUtil(banner)} />
            </SwiperItem>
          ))}
      </Swiper>
      <View className='paddingX20'>
        <View className='flex-align-spacebetween margin-bottom10'>
          <Text className='color-M1 bold font-size8 line-height50'>
            {detail?.shop_name}
          </Text>
          <Text className='color-S3 font-size-4'>
            {detail?.open_status_name || "营业中"}
          </Text>
        </View>
        <View className='flex-align-spacebetween margin-bottom10'>
          <View className='flex-align'>
            <Text className='color-M1 bold line-height40'>推荐指数</Text>
            <AtRate value={detail?.star} />
          </View>
          <Text className='color-M2 font-size-4'>{detail?.opentime}</Text>
        </View>
        {detail?.shop_content && (
          <View className='margin-bottom60'>
            <View className='color-M1 bold margin-bottom10'>商家简介</View>
            <View className='color-M4 line-height30'>
              {detail?.shop_content || "暂无简介"}
            </View>
          </View>
        )}
        <View className='flex-align-spacebetween margin-bottom10'>
          <View className='flex1'>
            <View className='color-M1 line-height33'>
              地址：{detail?.address}
            </View>
            <View className='color-M4 line-height30 margin-top6'>距离您</View>
          </View>
          <View className='flex-align'>
            <IconName
              className='paddingX10'
              name='导航'
              iconName='cm-iconEnvironmentFilled'
              nameStyle={commonStyle}
              iconSize={44}
              onClick={() => {
                const [longitude, latitude] = detail?.lnglat?.split(",") || [];
                openMap({
                  latitude: Number(latitude),
                  longitude: Number(longitude),
                  name: detail?.shop_name,
                  address: detail?.address
                });
              }}
            />
            {(detail?.linkman_mobile || detail?.hotline) && (
              <IconName
                className='paddingX10'
                name='电话'
                iconName='cm-icona-lujing1'
                nameStyle={commonStyle}
                iconSize={44}
                onClick={e => {
                  e.stopPropagation();
                  Taro.makePhoneCall({ phoneNumber: detail?.linkman_mobile || detail?.hotline });
                }}
              />
            )}
            <IconName
              className='paddingX10'
              name='预约'
              iconName='cm-icona-bianzu7'
              nameStyle={commonStyle}
              iconSize={44}
              onClick={() => {
                routerUtil.goto("cateringBook", { shop_id: detail?.shop_id });
              }}
            />
          </View>
        </View>
        <Title name='店家菜品' className='margin-bottom30' />
        <View className='margin-bottom60 width100 scroll-x flex-align'>
          {detail?.top_dish_list?.map(item => (
            <View
              className='margin-right20'
              key={item.dish_id}
              onClick={() => {
                routerUtil.goto("dishDetail", { id: item.dish_id });
              }}
            >
              <Image
                style={{
                  width: Taro.pxTransform(290),
                  height: Taro.pxTransform(220),
                  borderRadius: Taro.pxTransform(20)
                }}
                src={loadimgUtil(item.image)}
              />
              <View className='flex-align line-height40 color-M1 margin-top20'>
                {item.title}
              </View>
            </View>
          ))}
        </View>
        <Title name='安全档案' className='margin-bottom30' />
        {richHtml && (
          <View className='common-richcard'>
            <RichText className='commodity-rich' nodes={richHtml} />
          </View>
        )}
        {/* {detail?.cert_img1 && <Image src={detail?.cert_img1} className='cert-img' />}
        {detail?.cert_img2 && <Image src={detail?.cert_img2} className='cert-img' />} */}
        {/*{*/}
        {/*  detail?.shop_soruce_list?.map(item => {*/}
        {/*    if (item.type === 'gallery') {*/}
        {/*      return  item.gallery.split(',').map(img => <Image mode='widthFix' src={img}   />)*/}
        {/*    } else if (item.type === 'text') {*/}
        {/*      return <Text>{item.text}</Text>*/}
        {/*    } else if (item.type === 'content') {*/}
        {/*      return <RichText nodes={item.text} />*/}
        {/*    }*/}
        {/*  })*/}
        {/*}*/}
      </View>
    </View>
  );
};

export default Index;
