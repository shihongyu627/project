import React, {useEffect, useState} from 'react';
import { View} from '@tarojs/components';
import {BaseProps} from "@/interface/base";
import PhotoPicker from "@/components/PhotoPicker";

import './index.scss';

interface PhotoPickerProps extends BaseProps{
  getPaths: (paths: string) => void;
  count?: number;
}

const PhotoPickers: React.FC<PhotoPickerProps> = ({getPaths, count=3, className}) => {
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    getPaths(images.join(','))
  }, [images])
  console.log('images', images)
  return (
    <View className={`flex-align flex-wrap ${className}`}>
      {
        images.map((item,index) => (
          <PhotoPicker
            key={`image_${index}_${item}`}
            path={item}
            getPath={path => {
              setImages(prevState => {
                if (path) {
                  prevState[index] = path;
                  return [...prevState];
                } else {
                  const temp = prevState.filter((_,j) => index!==j)
                  console.log('temp', temp)
                  return [...temp]
                }
              })
            }}
          />
        ))
      }
      {
        images.length < count &&
        <PhotoPicker isBtn getPath={path => {
          console.log('path', path)
          path ? setImages([...images, path]) : setImages([])
        }}
        />
      }
    </View>

  );
};

export default PhotoPickers;
