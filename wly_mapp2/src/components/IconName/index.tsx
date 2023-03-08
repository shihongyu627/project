import React from "react";
import {BaseProps} from "@/interface/base";
import {Text, View, Image} from "@tarojs/components";
import routerUtil from "@/utils/router";
import loadimgUtil from "@/utils/loadimg";
import Taro from "@tarojs/taro";
import In from '@/assets/image/in.png'
import Shop from '@/assets/image/shop.png'
import Good from '@/assets/image/good.png'
import New from '@/assets/image/new.png'

const images = {
  'in': In,
  'shop': Shop,
  'good': Good,
  'new': New,
}
interface IconNameProps extends BaseProps {
  name: string;
  iconName: string;
  guideName?: string;
  iconSize?: number;
  nameStyle?: any;
  onClick?: (e?:any) => void;
}

const IconName: React.FC<IconNameProps> = (props) => {
  const {
    name,
    iconName,
    guideName,
    iconSize = 96,
    nameStyle,
    className,
    onClick
  } = props;
  const isImage = ['in', 'shop', 'good', 'new'].includes(iconName)
  return (
    <View
      className={`flex-column-center ${className}`}
      onClick={guideName ? () => {routerUtil.goto(guideName)} : onClick}
    >
      {
        isImage ?
          <Image src={loadimgUtil(images[iconName])}
            style={{width: Taro.pxTransform(iconSize), height: Taro.pxTransform(iconSize)}}
          />
          :
          <Text className={`iconfont ${iconName} color-S3 line-height${iconSize}`} style={{fontSize: Taro.pxTransform(iconSize)}} />
      }
      <Text className='font-size0 line-height40 margin-top12 bold' style={nameStyle}>{name}</Text>
    </View>
  )
}

export default IconName;
