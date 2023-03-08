import {CommonEventFunction, ScrollView, View} from '@tarojs/components';
import React from 'react';
import {BaseProps} from "@/interface/base";

// import './index.scss';

interface ListProps  extends BaseProps{
  refresh?: CommonEventFunction;
  loadMore: CommonEventFunction;
  refreshing?: boolean;
  isLast?: boolean;
  renderHeader?: React.ReactNode;
}

const List: React.FC<ListProps> = ({
                                     refresh,
                                     renderHeader,
                                     loadMore,
                                     refreshing,
                                     children,
                                     isLast,
                                     className = 'container',
                                   }) => {
  return (
    <ScrollView
      scrollY
      className={className}
      onScrollToUpper={refresh}
      onScrollToLower={loadMore}
    >
      {refreshing && <View className='flex-align-justify color-M4 line-height40'>刷新中...</View>}
      {renderHeader}
      {
        children
      }
      <View className='flex-align-justify color-M4 line-height40'>{isLast ? '加载完成' : '加载中...'}</View>
    </ScrollView>
  );
};

export default List;
