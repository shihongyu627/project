import React, {useContext, useEffect, useState} from 'react';
import { Picker, View} from "@tarojs/components";
import {BaseProps} from "@/interface/base";
import moment from "moment";
import {HotelContext} from "@/utils/context";

import './index.scss';

interface HotelTimeProps extends BaseProps {
  getStartEnd?: (start, end) => void;
}

const HotelTime: React.FC<HotelTimeProps> = ({ className}) => {
  const {hotelSelect, refreshHotelSelect} = useContext(HotelContext);
  const {start, end} = hotelSelect;
  const [distance ,setDistance] = useState<number>(1);
  const handleTimeChange = (e) => {
    refreshHotelSelect({...hotelSelect,start: e.detail.value})
  }
  const handleTimeChangeB = (e) => {
    refreshHotelSelect({...hotelSelect,end: e.detail.value})
  }
  useEffect(() => {
    start && end && setDistance(moment(end).diff(moment(start), 'day'))
  }, [start, end])
  return (
    <View className={`hotel-search-card-time border-bottom ${className}`}>
      <Picker
        mode='date'
        onChange={handleTimeChange}
        value={start}
        start={moment().format('YYYY-MM-DD')}
        className='hotel-search-card-time-item'
      >
        <View className='hotel-search-card-time-title'>入住时间</View>
        <View className='hotel-search-card-time-value'>
          {start}
        </View>
      </Picker>
      <View className='hotel-search-card-time-tip'>至</View>
      <Picker
        mode='date'
        onChange={handleTimeChangeB}
        value={end}
        start={moment(start).add(1, 'days').format('YYYY-MM-DD')}
        className='hotel-search-card-time-item'
      >
        <View className='hotel-search-card-time-title'>离店时间</View>
        <View className='hotel-search-card-time-value'>
          {end}
        </View>
      </Picker>
      <View className='hotel-search-card-time-tip'>共{distance}晚</View>
    </View>
  );
};

export default HotelTime;
