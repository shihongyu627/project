import React from "react";
import { getCommodityDetail } from "@/api/good";
import { CommodityItem } from "@/interface/data";
import { Image, View, Text, RichText } from "@tarojs/components";
import { useRequest } from "@/utils/request";
import { useRouter } from "@tarojs/runtime";
import loadimgUtil from "@/utils/loadimg";
// import {shareToPerson} from "@/utils/wx";

import "./index.scss";

const Index: React.FC = () => {
  const { params = {} } = useRouter() || {};
  const [commodity] = useRequest<CommodityItem>(() =>
    getCommodityDetail(params?.id)
  );
  let htmlData = commodity?.detail || "";
  let richHtml = "";
  if (htmlData) {
    richHtml = htmlData.replace(/style="/g, `style="display:flex;`);
  }
  return (
    <View className='container commodity-detail'>
      {commodity?.image && (
        <Image className='commodity-detail-image' src={loadimgUtil(commodity?.image)} />
      )}
      <View className='commodity-detail-card'>
        <View className='flex-align-spacebetween margin-bottom10'>
          <Text className='commodity-title'>{commodity?.title}</Text>
          {/*<View className='flex-align color-S3' onClick={() => {*/}
          {/*  shareToPerson({*/}
          {/*    title: commodity?.title || '',*/}
          {/*    desc: commodity?.content || '',*/}
          {/*    link: window.location.href,*/}
          {/*    imgUrl: commodity?.image || '',*/}
          {/*  })*/}
          {/*}}*/}
          {/*>*/}
          {/*  <Text  className='commodity-share'>分享</Text>*/}
          {/*  <Text className='iconfont font-size4 cm-icona-lujing4' />*/}
          {/*</View>*/}
        </View>
        <View className='color-S3 line-height66 bold font-size18'>
          ￥{commodity?.price || 0}
        </View>
        <Text className='commodity-content'>{commodity?.content}</Text>
        <View className='flex-align-spacebetween font-size-2 line-height36 color-M5'>
          <Text>共{commodity?.click_count || 0}+推荐</Text>
          <Text>销量{commodity?.sale_count || 0}+</Text>
        </View>
      </View>
      {richHtml && (
        <View className='common-richcard'>
          <RichText className='commodity-rich' nodes={richHtml} />
        </View>
      )}
    </View>
  );
};

export default Index;
