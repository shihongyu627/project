import {Input, Textarea, View} from '@tarojs/components';
import React, {useState} from 'react';
import PhotoPickers from "@/components/PhotoPickers";
import routerUtil from "@/utils/router";
import {postFeedback} from "@/api/common";
import checkParams, {CheckStringType} from "@/utils/check";

import './index.scss';

const Index: React.FC = () => {
  const [info, setInfo] = useState<{
    contact?: string;
    content?: string;
    gallery?: string;
  }>({})
  const submit = async () => {
    if (checkParams([
      {type: CheckStringType.EMPTY, value: info.content, name: '问题描述'},
      {type: CheckStringType.EMPTY, value: info.contact, name: '联系方式'},
    ])) {
      const resp = await postFeedback(info);
      resp && routerUtil.goBack()
    }
  }
  return (
    <View className='container'>
      <View className='feedback-box-base bgcolor-M9'>
          <View className='feedback-title'>请详细描述问题并上传问题截图</View>
        <View className='feedback-input bgcolor-M7 padding20'>
          <Input
            placeholder='您的建议将使我们做的更好（30字以内）'
            maxlength={30}
            onInput={event => {
              setInfo({...info, content: event.detail.value})
            }}
          />
          <PhotoPickers getPaths={gallery => {
            setInfo({...info, gallery})
          }}
            className='margin-top40'
          />
        </View>
      </View>
      <View className='feedback-box-base bgcolor-M9'>
        <View className='feedback-title'>请填写您的联系方式方便我们回复</View>
        <View className='feedback-input feedback-input-b bgcolor-M7 padding20'>
          <Textarea
            placeholder='您的手机或者邮箱、微信、QQ（选填）'
            onInput={event => {
              setInfo({...info, contact: event.detail.value})
            }}
          />
        </View>
      </View>
      <View className='common-btn marginX20' onClick={submit}>提交</View>
    </View>
  );
};

export default Index;
