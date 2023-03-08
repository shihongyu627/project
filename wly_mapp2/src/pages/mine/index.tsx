import {Image, Text, View} from '@tarojs/components';
import React, {useEffect, useState} from 'react';
import {AtAvatar, AtListItem} from "taro-ui";
import {Cache, CacheKey} from '@/utils'
import {UserInfo} from "@/interface/user";
import Guide from "@/pages/mine/components/Guide";
import routerUtil from "@/utils/router";
import MineBg from '@/assets/image/mineBg.png'
import {getUserInfo} from "@/utils/wx";
import {getLogin} from "@/api/common";
import loadimgUtil from "@/utils/loadimg";

import './index.scss';

const Index: React.FC = () => {
  // eslint-disable-next-line no-restricted-globals
  const result = location.href.split('?') || [];
  const result2 = result[1]?.split('#/') || [];
  const paramsList = result2[0]?.split('&') || [];
  const params = {};
  paramsList.forEach(item => {
   const a = item.split('=');
    params[a[0]] = a[1];
  })
  console.log('params', params);
  const {code = ''} = params as any;
  const [userInfo, setUserInfo] = useState<UserInfo>(Cache.get(CacheKey.USER_INFO));
  const toLogin = () => {
    if (!userInfo?.user_nick) {
      const config = Cache.get(CacheKey.JSSDK_CONFIG)
      // eslint-disable-next-line no-restricted-globals
      getUserInfo(config.appId, location.href)
    }
  }
  useEffect(() => {
    code && loginRequest();
  }, [])
  const loginRequest = async () => {
    const resp: any = await getLogin({code, type: 'js'})
    if (resp) {
      setUserInfo(resp)
      Cache.set(CacheKey.TOKEN, resp.token)
      Cache.set(CacheKey.USER_INFO, resp)
      console.log('resp', resp)
      window.location.href = 'https://' + window.location.host +  '/#/pages/mine/index'
    }
  }
  return (
    <View className='container-no-height'>
      <Image
        className='mine-image'
        src={loadimgUtil(MineBg)}
      />
      <View className='mine-info'>
        <View className='flex-align user-info' onClick={toLogin}>
          <AtAvatar size='normal' image={userInfo.user_head} circle />
          <Text className='user-info-name'>{userInfo.user_nick || userInfo.uid || '立即登录'}</Text>
        </View>
        <View className='flex-align-spacebetween margin-top20'>
          <Guide title='我的预约' desc='查看预约' iconName='cm-icona-xingzhuang2' guideName='order' />
          <Guide title='商家入驻' desc='申请入驻' iconName='cm-icona-xingzhuang1' guideName='shopIn' />
        </View>
        <View className='list-guide'>
          <AtListItem
            onClick={() => {routerUtil.goto('aboutUs')}}
            iconInfo={{size: 24, className: 'color-S3 iconfont cm-icona-bianzu31' ,value: 'SuccessFilled'}}
            title='关于我们'
            arrow='right'
          />
          <AtListItem
            onClick={() => {routerUtil.goto('feedback')}}
            iconInfo={{size: 24, className: 'color-S3 iconfont cm-icona-bianzu21' ,value: 'SuccessFilled'}}
            title='意见反馈'
            arrow='right'
            hasBorder={false}
          />
        </View>
      </View>
    </View>
  );
};

export default Index;
