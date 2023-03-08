import React from "react";
import {BaseProps} from "@/interface/base";
import {View} from "@tarojs/components";

import './index.scss'

interface TableProps extends BaseProps {
  list: string[][];
}

const Table: React.FC<TableProps> = ({list, className}) => {
  return (
    <View
      className={`table-box ${className}`}
    >
      {
        list.map((item, i) => (
          <View className={`table-item-line flex ${i%2 && 'table-item-line-color'}`}
            key={`key_table_line_${i}`}
          >
          {
            item.map((name, j) => (
              <View
                className='flex1 flex-align-justify'
                key={`key_table_line_${i}_${j}`}
              >
                {name}
              </View>
            ))
          }
        </View>))
      }
    </View>
  )
}

export default Table;
