import {Input, View, Image} from '@tarojs/components';
import React, {useEffect, useState} from 'react';
import {ShopApplyRequest, ShopType} from "@/interface/data";
import routerUtil from "@/utils/router";
import PhotoPickers from "@/components/PhotoPickers";
import {getSearchHot, postApplyShop} from "@/api/common";
import checkParams, {CheckStringType} from "@/utils/check";

import './index.scss';

const tags = ['餐饮', '电商', '酒店']
const tagTypes = [ShopType.catering, ShopType.commerce, ShopType.hotel]

const Index: React.FC = () => {
  const [info, setInfo] = useState<ShopApplyRequest>({})
  const [current, setCurrent] = useState<number>(0)
  const [image, setImage] = useState<string>('')
  const submit = async () => {
    if (checkParams([
      {type: CheckStringType.LENGTH, value: info.shop_name, name: '店铺名称'},
      {type: CheckStringType.LENGTH, value: info.linkman_name, name: '联系人'},
      {type: CheckStringType.EMPTY, value: info.linkman_mobile, name: '联系电话'},
      {type: CheckStringType.LENGTH, value: info.shop_address, name: '店铺地址'},
      {type: CheckStringType.EMPTY, value: info.cert_img1, name: '营业执照'},
      ])) {
      const resp = await postApplyShop({...info, shop_type: tagTypes[current]})
      resp && routerUtil.goto('success')
    }
  }
  const getImage = async () => {
    const resp = await getSearchHot()
    if (resp && resp.shop_apply_tempcert) {
      setImage(resp.shop_apply_tempcert.value)
    }
  }
  useEffect(() => {
    getImage();
  }, [])
  return (
    <View className='container shop-in'>
      <View className='bgcolor-M9 padding30'>
        <View className='input-item'>
          <View className='input-label'>店铺名称</View>
          <Input
            placeholder='请输入店铺名称'
            onInput={(event) => {
              setInfo({...info, shop_name: event.detail.value })
            }}
          />
        </View>
        <View className='input-item'>
          <View className='input-label'>联系人</View>
          <Input
            placeholder='请输入联系人'
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
          <View className='input-label'>店铺地址</View>
          <Input
            placeholder='请输入店铺地址'
            onInput={(event) => {
              setInfo({...info, shop_address: event.detail.value})
            }}
          />
        </View>
        <View className='input-item'>
          <View className='input-label'>请选择店铺类型</View>
          <View className='flex-align'>
            {
              tags.map((item, index) => (
                <View className={`tag-item flex-align-justify ${current === index && 'tag-item-active'}`}
                  onClick={() => {setCurrent(index)}}
                  key={`key_tag_${index}`}
                >
                  {item}
                </View>)
              )
            }
          </View>
        </View>
        <View className='border-bottom paddingY20'>
          <View className='input-label bold'>营业执照</View>
          <View className='flex-align'>
            <PhotoPickers count={2} getPaths={paths => {
              const [cert_img1 = '',cert_img2 = ''] = paths.split(',') || [];
              setInfo({...info, cert_img1,cert_img2})
            }}
            />
            <View className='example-image-box flex-column-justify'>
              <Image className='example-image' src={image} />
              <View className='example-image-tip'>示例</View>
            </View>
          </View>
        </View>
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
