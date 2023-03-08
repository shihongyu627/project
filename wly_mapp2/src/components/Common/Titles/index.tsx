import React, {useState} from "react";
import {BaseProps} from "@/interface/base";
import {Text, View} from "@tarojs/components";

import './index.scss'

interface TitleProps extends BaseProps {
  names: string[];
  onChange?: (index: number) => void;
  renderContent?: (index: number) => React.ReactNode;
}

const Titles: React.FC<TitleProps> = ({names, className, onChange, renderContent}) => {
  const [current, setCurrent] = useState<number>(0);
  return (
    <View className='title-item-content'>
      <View
        className={`flex-align ${className} title-item`}
      >
        {
          names.map((name, index) => (
            <View
              className={`relative ${index && 'margin-left30'}`}
              key={`key_name_${index}`}
              onClick={() => {
                setCurrent(index);
                onChange && onChange(index)
              }}
            >
              <Text className='font-size8 line-height50 bold'>{name}</Text>
              {index === current && <View className='line' />}
            </View>
          ))
        }
      </View>
      {renderContent && renderContent(current)}
    </View>
  )
}

export default Titles;
