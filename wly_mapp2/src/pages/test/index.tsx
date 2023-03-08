import { View } from '@tarojs/components';
import React, {useState} from 'react';
import './index.scss';


const Index: React.FC = () => {
  const [result, setResult] =  useState<string>('')
  return (
    <View className='container padding30 bgcolor-M9'>
      <View
        className='padding30'
        onClick={() => {
        // @ts-ignore
        wx.ready((e) => {
          console.log('readyreadyreadyreadyreadyready', e)
          // @ts-ignore
          wx.scanQRCode({
            needResult: 0,
            success: (info) => {
              console.log('info', info)
            }
          });
        })
      }}
      >
        扫一扫
      </View>
      <View
        className='padding30'
        onClick={() => {
        // @ts-ignore
        wx.ready((e) => {
          console.log('readyreadyreadyreadyreadyready', e)
          // @ts-ignore
          wx.scanQRCode({
            needResult: 1,
            success: (info) => {
              setResult(JSON.stringify(info))
            },
            fail: (error) => {
              setResult(JSON.stringify(error))
            }
          });
        })
      }}
      >
        扫一扫1
      </View>
      <View>结果：{result}</View>
    </View>
  );};

export default Index;
