import React from "react";
import {BaseProps} from "@/interface/base";
import {View, Text} from "@tarojs/components";
import './Guide.scss';
import routerUtil from "@/utils/router";

interface GuideProps extends BaseProps {
  iconName: string;
  guideName: string;
  title: string;
  desc: string;
}

const Guide: React.FC<GuideProps> = ({iconName, title, desc, guideName}) => {
  return (
    <View className='guide-box flex-align'
      onClick={() => {routerUtil.goto(guideName)}}
    >
      <View>
        <Text className='guide-title'>{title}</Text>
        <Text className='guide-desc'>{desc}</Text>
      </View>
      <Text className={`iconfont ${iconName} guide-icon color-S3`} />
    </View>
  )
}

export default Guide;
