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
      className={`${className} search-guide flex-align`}
      onClick={() => {routerUtil.goto(guideName)}}
    >
      <Text className='iconfont cm-iconlujing color-M9 margin-right10 font-size4' />
      <Text>搜索</Text>
    </View>
  )
}

export default SearchGuide;
