import React from "react";
import {BaseProps} from "@/interface/base";
import {Text, View} from "@tarojs/components";
import routerUtil from "@/utils/router";

import './index.scss'

interface SearchGuideProps extends BaseProps {
  guideName: string;
}

const SearchGuide: React.FC<SearchGuideProps> = ({className, guideName}) => {
  return (
    <View
      className={`${className} search-guide flex-align-spacebetween`}
      onClick={() => {routerUtil.goto(guideName)}}
    >
      <View className='flex-align'>
        <Text className='iconfont cm-iconlujing color-M9 margin-right10 font-size4' />
        <Text>搜索</Text>
      </View>
      <Text className='iconfont font-size4 cm-iconEnvironmentFilled color-M9' />
    </View>
  )
}

export default SearchGuide;
