import React from 'react';
import {getDishDetail} from "@/api/dish";
import {DishItem} from "@/interface/data";
import {Image,View, Text} from "@tarojs/components";
import {useRequest} from "@/utils/request";
import {useRouter} from "@tarojs/runtime";
import loadimgUtil from "@/utils/loadimg";
import Titles from "@/components/Common/Titles";
import Table from "@/components/Common/Table";

import './index.scss';

const Index: React.FC = () => {
  const { params = {}} = useRouter() || {};
  const [detail] = useRequest<DishItem>(() => getDishDetail(params?.id))
  return (
    <View className='container dish-detail'>
      {
        detail?.image
        &&
        <Image
          className='dish-detail-image'
          src={loadimgUtil(detail?.image)}
        />
      }
      <View className='dish-detail-card'>
        <View className='dish-title'>
          {detail?.title}
        </View>
        <View className='dish-content'>{detail?.content}</View>
      </View>
      <View className='common-card'>
        <Titles
          names={['食品配料','制作方法']}
          renderContent={(index) => {
            if (!index) {
              const list = detail?.foods_arr.map(item => [item?.name,item.spec]) || []
              return (
                <Table
                  className='marginXauto margin-top30'
                  list={[['食材','用量'], ...list]}
                />
              )
            } else {
              return (
                <View className='paddingY30'>
                  {detail?.foods_process?.map(item => (
                    <View className='margin-bottom20'>
                      <View className='bold line-height50'>{item.name}</View>
                      {item.gallery?.split(',')?.map(image => (
                        <Image src={loadimgUtil(image)} mode='widthFix' />
                      ))}
                      <View className='color-M3 line-height40 font-size-2'>
                        <Text>{item.text}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )
            }

          }}
        />
      </View>

    </View>
  );
};
export default Index;
