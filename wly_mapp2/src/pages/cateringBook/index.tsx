import { Input, Textarea, View } from "@tarojs/components";
import React, { useState } from "react";
import { ShopOrderRequest } from "@/interface/data";
import { useRouter } from "@tarojs/runtime";
import routerUtil from "@/utils/router";
import { postShopOrder } from "@/api/shop";
import checkParams, { CheckStringType } from "@/utils/check";
import Picker from "@/components/Picker";

import "./index.scss";

const Index: React.FC = () => {
  const { params = {} } = useRouter() || {};
  const { shop_id } = params as any;
  const [info, setInfo] = useState<ShopOrderRequest>({
    shop_id
  });
  const [time, setTime] = useState<string>("");
  // const [timeTwo, setTimeTwo] = useState<string>("12:00");
  const submit = async () => {
    if (
      checkParams([
        { value: time, type: CheckStringType.EMPTY, name: "到店时间" },
        // { value: timeTwo, type: CheckStringType.EMPTY, name: "到店时间" },
        { value: info.num, type: CheckStringType.EMPTY, name: "预约人数" },
        {
          value: info.linkman_name,
          type: CheckStringType.EMPTY,
          name: "联系人"
        },
        {
          value: info.linkman_mobile,
          type: CheckStringType.EMPTY,
          name: "联系电话"
        }
      ])
    ) {
      const timeDate = new Date(time.replace(/-/g, '/'));
      const resp = await postShopOrder({
        ...info,
        time: timeDate.getTime() / 1000
      });
      resp && routerUtil.goto("success");
    }
  };
  return (
    <View className='container hotel-book'>
      <View className='common-card'>
        <View className='input-item'>
          <View className='input-label'>到店时间</View>
          <View className='input-label'>
            <Picker
              typeInfo={time}
              title='请选择时间'
              getDateTime={data => {
                setTime(data);
              }}
            ></Picker>
          </View>
        </View>
        {/* <Picker
          mode='date'
          onChange={(e) => {setTime(e.detail.value)}}
          value={time}
        >
          <View className='input-item'>
            <View className='input-label'>选择到店日期</View>
            <View className='input-label'>
              {time || <Text className='iconfont cm-iconRightOutlined color-M2' />}
            </View>
          </View>
        </Picker>
        <Picker
          mode='time'
          onChange={(e) => {setTimeTwo(e.detail.value)}}
          value={timeTwo}
        >
          <View className='input-item'>
            <View className='input-label'>选择到店时间</View>
            <View className='input-label'>
              {timeTwo || <Text className='iconfont cm-iconRightOutlined color-M2' />}
            </View>
          </View>
        </Picker> */}
        <View className='input-item'>
          <View className='input-label'>预约人数</View>
          <Input
            placeholder='请输入预约人数'
            type='number'
            onInput={event => {
              setInfo({ ...info, num: Number(event.detail.value) });
            }}
          />
        </View>
        <View className='input-item'>
          <View className='input-label'>联系人</View>
          <Input
            placeholder='请输入联系人'
            onInput={event => {
              setInfo({ ...info, linkman_name: event.detail.value });
            }}
          />
        </View>
        <View className='input-item'>
          <View className='input-label'>联系电话</View>
          <Input
            placeholder='请输入联系电话'
            onInput={event => {
              setInfo({ ...info, linkman_mobile: event.detail.value });
            }}
          />
        </View>
      </View>
      <View className='common-card'>
        <View className='color-M1 bold line-height40 margin-bottom20'>
          备注
        </View>
        <Textarea
          className='common-textarea'
          placeholder='填写包厢，套餐菜品等其他信息'
          onInput={event => {
            setInfo({ ...info, text: event.detail.value });
          }}
        />
      </View>
      <View className='flex-align-justify paddingX20'>
        <View className='common-btn width100' onClick={submit}>
          提交
        </View>
      </View>
    </View>
  );
};

export default Index;
