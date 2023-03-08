import {View, Text} from '@tarojs/components';
import React from 'react';
import routerUtil from "@/utils/router";

import './index.scss';

const Index: React.FC = () => {
  return (
    <View
      className='container flex-column success-box'
    >
      <Text className='iconfont cm-iconSuccessFilled success-icon color-S3' />
      <Text className='success-title'>提交成功</Text>
      <Text className='success-tip'>将于三个工作日内联系到您</Text>
      <Text className='success-tip'>请留意电话短信等通知</Text>
      <View className='flex-align-justify paddingX20 margin-top100'>
        <View
          className='common-btn width100'
          onClick={() => {routerUtil.goto('mine')}}
        >
          个人中心
        </View>
      </View>
    </View>
  );
};

export default Index;
