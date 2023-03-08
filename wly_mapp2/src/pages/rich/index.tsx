import {RichText, View} from '@tarojs/components';
import React, {useEffect} from 'react';
import Taro from '@tarojs/taro'
import {useRequest} from "@/utils/request";
import {getNewInfo} from "@/api/common";
import {Cache, CacheKey} from "@/utils";

import './index.scss';

const Index: React.FC = () => {
  const outDetail = Cache.get(CacheKey.RICH);
  const [detail] = useRequest(getNewInfo)
  useEffect(() => {
    if (outDetail?.title) {
      Taro.setNavigationBarTitle({title: outDetail?.title})
    } else {
      detail?.title && Taro.setNavigationBarTitle({title: detail?.title})
    }
    return () => Cache.remove(CacheKey.RICH)
  }, [])
  return (
    <View className='container padding30 bgcolor-M9'>
      <RichText nodes={outDetail?.detail || detail?.detail} />
    </View>
  );
};

export default Index;
