import {RichText, View} from '@tarojs/components';
import React from 'react';
import {getAboutUs} from "@/api/common";
import {useRequest} from "@/utils/request";
import './index.scss';


const Index: React.FC = () => {
  const [detail] = useRequest(getAboutUs)
  return (
    <View className='container padding30 bgcolor-M9'>
      <RichText nodes={detail?.detail} />
    </View>
  );};

export default Index;
