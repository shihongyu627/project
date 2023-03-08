import React, {useState} from 'react';
import useList from "@/components/Common/List/useList";
import List from "@/components/Common/List";
import {getHotelList} from "@/api/hotel";
import {Image} from "@tarojs/components";
import {HotelItemProps} from "@/interface/data";
import loadimgUtil from "@/utils/loadimg";
import HotelItem from "@/components/Hotel/Item";
import HotelSearchCard from "@/components/Hotel/Card";
import Title from "@/components/Common/Title";
import HotelImage from '@/assets/image/hotelBanner.png'
import {HotelContext, HotelSelectProps} from '@/utils/context'
import moment from "moment";

import './index.scss';

const Index: React.FC = () => {
  const {loadMore, refreshing, list, total, filterFunction} = useList<HotelItemProps>({
    getList: getHotelList
  })

  const [hotelSelect, setHotelSelect] = useState<HotelSelectProps>({
    start: moment().format('YYYY-MM-DD'),
    end: moment().add(1, 'days').format('YYYY-MM-DD'),
  });
  return (
    <HotelContext.Provider value={{hotelSelect, refreshHotelSelect: setHotelSelect}}>
      <List
        loadMore={loadMore}
        refreshing={refreshing}
        isLast={total === list.length}
        className='container-no-height'
        renderHeader={(
          <Image
            className='hotel-banner'
            src={loadimgUtil(HotelImage)}
          />
        )}
      >
        <div className='paddingX20'>
          <HotelSearchCard  filterFunction={filterFunction} />
          <Title name='推荐酒店' className='margin-bottom30' />
          {
            list.map(item =><HotelItem key={item.hotel_id} hotel={item} />)
          }
        </div>
      </List>
    </HotelContext.Provider>

  );
};

export default Index;
