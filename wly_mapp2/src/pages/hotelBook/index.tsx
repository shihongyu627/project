import {Input, Picker, View, Text} from '@tarojs/components';
import React, {useState} from 'react';
import {HotelBookRequest} from "@/interface/data";
import {useRouter} from "@tarojs/runtime";
import routerUtil from "@/utils/router";
import {postHotelOrder} from "@/api/hotel";
import checkParams, {CheckStringType} from "@/utils/check";

import './index.scss';

const range: string[] = [];
for (let i = 0; i < 24; i++) {
  range.push(`${i < 10 ? '0' + i : i}:00`);
}

const Index: React.FC = () => {
  const { params = {}} = useRouter() || {};
  const {room_id, hotel_id, start, end} = params as any;
  const [info, setInfo] = useState<HotelBookRequest>({
    room_id,
    hotel_id,
  })
  const [timeIndex, setTimeIndex] = useState<number>(-1);
  const time = timeIndex > -1 ?  range[timeIndex] : '';
  const submit = async () => {
    if (
      checkParams([
        {value: info.linkman_name, type: CheckStringType.EMPTY, name: '住客姓名'},
        {value: info.linkman_mobile, type: CheckStringType.EMPTY, name: '联系电话'},
        {value: info.num, type: CheckStringType.EMPTY, name: '房间人数量'},
        {value: time, type: CheckStringType.EMPTY, name: '预计到店时间'},
      ])
    ) {
      const timeDate =   new Date(`${start.replace(/-/g, '/')} ${time}`)
      const resp = await postHotelOrder({
        ...info,
        time: timeDate.getTime() / 1000,
        start_time: start,
        end_time: end,
      })
      resp && routerUtil.goto('success')
    }
  }
  return (
    <View className='container hotel-book'>
      <View className='common-card'>
        <View className='input-item'>
          <View className='input-label'>住客姓名</View>
          <Input
            placeholder='请输入住客姓名'
            onInput={(event) => {
              setInfo({...info, linkman_name: event.detail.value})
            }}
          />
        </View>
        <View className='input-item'>
          <View className='input-label'>联系电话</View>
          <Input
            placeholder='请输入联系电话'
            onInput={(event) => {
              setInfo({...info, linkman_mobile: event.detail.value})
            }}
          />
        </View>
        <View className='input-item'>
          <View className='input-label'>房间人数量</View>
          <Input
            placeholder='请输入房间人数量'
            type='number'
            onInput={(event) => {
              setInfo({...info, num: Number(event.detail.value)})
            }}
          />
        </View>
        <View className='input-item'>
          <View className='input-label'>入住与离店时间</View>
          <View className='input-label'>{start} - {end}</View>
        </View>

        <Picker
          mode='selector'
          range={range}
          onChange={(e) => {
            setTimeIndex(Number(e.detail.value))
          }}
          value={timeIndex}
        >
          <View className='input-item'>
            <View className='input-label'>预计到达时间</View>
            <View className='input-label'>
              {time || <Text className='iconfont cm-iconRightOutlined color-M2' />}
            </View>
          </View>
        </Picker>
      </View>
      <View className='flex-align-justify paddingX20'>
        <View
          className='common-btn width100'
          onClick={submit}
        >
          提交
        </View>
      </View>
    </View>
  );
};

export default Index;
