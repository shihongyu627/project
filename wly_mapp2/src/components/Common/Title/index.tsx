import React from "react";
import {BaseProps} from "@/interface/base";
import {Text, View} from "@tarojs/components";
import routerUtil from "@/utils/router";

import './index.scss'

interface TitleProps extends BaseProps {
  name: string;
  guideName?: string;
}

const Title: React.FC<TitleProps> = ({name, className, guideName}) => {
  return (
    <View
      className={`flex-align-spacebetween ${className} title-item`}
      onClick={guideName ? () => {routerUtil.goto(guideName)} : undefined}
    >
      <View className='relative'>
        <Text className='font-size8 line-height50 bold'>{name}</Text>
        <View className='line' />
      </View>
      {
        guideName
        &&
        <Text className='iconfont cm-iconRightOutlined color-M3 font-size4' />
      }
    </View>
  )
}

export default Title;
