import React, {useState} from 'react';
import useList from "@/components/Common/List/useList";
import List from "@/components/Common/List";
import {getHotelList} from "@/api/hotel";
import {HotelItemProps} from "@/interface/data";
import HotelItem from "@/components/Hotel/Item";
import {useRouter} from "@tarojs/runtime";
import {HotelContext, HotelSelectProps} from "@/utils/context";

import './index.scss';

const Index: React.FC = () => {
  const { params = {}} = useRouter() || {};
  const {start, end} = params as any;
  const {refresh, loadMore, refreshing, list, total} = useList<HotelItemProps>({getList: getHotelList, filterInit: params})
  const [hotelSelect, setHotelSelect] = useState<HotelSelectProps>({
    start,
    end,
  });
  return (
    <HotelContext.Provider value={{hotelSelect, refreshHotelSelect: setHotelSelect}}>
      <List
        refresh={refresh}
        loadMore={loadMore}
        refreshing={refreshing}
        isLast={total === list.length}
      >
        <div className='padding20'>
          {
            list.map(item =><HotelItem key={item.hotel_id} hotel={item} />)
          }
        </div>
      </List>
    </HotelContext.Provider>
  );
};

export default Index;
