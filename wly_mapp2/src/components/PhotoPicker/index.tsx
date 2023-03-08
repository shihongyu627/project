import React, {useEffect, useState} from 'react';
import {Text, View} from '@tarojs/components';
import {UploadStatus} from '@/assets/data/enums';
import {chooseImage} from "@/utils/common";
import {BaseProps} from "@/interface/base";
import {uploadImage} from "@/utils/request";

import './index.scss';

interface PhotoPickerProps extends BaseProps{
  getPath?: (path: string) => void;
  path?: string;
  isBtn?: boolean;
}

const PhotoPicker: React.FC<PhotoPickerProps> = ({getPath, path, isBtn}) => {
  const [status, setStatus] = useState<UploadStatus>(!path ? UploadStatus.wait : UploadStatus.success)
  const [value, setValue] = useState<string>(path || '')
  const [fileName, setFileName] = useState<string>("");
  const isSuccess = status === UploadStatus.success;
  const choose = async () => {
    const resp = await chooseImage();
    console.log("resp", resp);
    if (resp) {
      // 获取原始文件名
      let _fileName = resp.tempFiles[0].originalFileObj?.name  || "name.jpg";
      setValue(resp.tempFilePaths[0]);
      setFileName(_fileName);
    }
  };
  useEffect(() => {
    fileName && toUploadImage();
  }, [fileName]);
  const toUploadImage = async () => {
    const res: any = await uploadImage("/api/upload/uploadimage", value, fileName);
    const resp = JSON.parse(res)
    if (resp.data) {
      getPath && getPath(resp.data.url);
      setStatus(isBtn ? UploadStatus.wait : UploadStatus.success);
      isBtn && setValue('');
      isBtn && setFileName('');
    } else {
      setStatus(UploadStatus.fail);
      setFileName('');
    }
  };
  return (
    <View
      className='upload-image margin-top20 margin-right20 margin-bottom20'
      style={{ backgroundImage: value ? `url(${value})` : 'unset' }}
      onClick={choose}
    >
      {!value && (
        <View className='upload-add flex-align-justify'>
          <Text className='upload-tip iconfont cm-iconadd' />
        </View>
      )}
      {value && status !== UploadStatus.wait && (
        <View className='flex-column flex-align-justify width100 height100 upload-image-bg'>
          <View className='upload-tip-delete iconfont cm-iconshanchu color-D3 font-size10'
            onClick={(e) => {
                  e.stopPropagation();
                  setValue('');
                  setStatus(UploadStatus.wait)
                  getPath && getPath('');
            }}
          />
          <View className='upload-tip-box'>
            <Text
              className={`iconfont upload-tip ${
                isSuccess
                  ? 'cm-iconSuccessFilled color-success'
                  : 'cm-iconshuaxin color-M7'
              }`}
            />
          </View>
          <Text className='color-M9 font-size-4 bold'>
            {isSuccess ? '上传成功' : '上传失败'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PhotoPicker;
