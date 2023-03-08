import React, {Component} from 'react'
import {View, Dimensions, DeviceEventEmitter} from 'react-native'
import {Drawer, AlbumView} from 'teaset'

let {height, width} = Dimensions.get('window')
// 加载图片
const image = {
  // 加载图片
  load: function (url, type = 0) {
    const isQiNiuThumb = true
    const thumbRule = 'imageView2/2/w/1500/h/1500/q/75'
    if (!url) {
      return ''
    }
    if (typeof url === 'string') {
      // 检测是否是data:image
      if (url && url.indexOf('data:image') >= 0) {
        if (type === 1) {
          return url
        }
        return {uri: url}
      }
      // 添加服务器root
      if (url) {
        if (url.indexOf('http') >= 0 || url.indexOf('//') == 0) {
          // 七牛图片
          if (isQiNiuThumb) {
            if (url.indexOf('?') >= 0) {
              if (url.indexOf(thumbRule) < 0) {
                url = url + '&' + thumbRule // 七牛图片压缩
              }
            } else {
              if (url.indexOf(thumbRule) < 0) {
                url = url + '?' + thumbRule // 七牛图片压缩
              }
            }
          }
          if (url.indexOf('//') == 0) {
            url = 'http:' + url
          }
          if (type === 1) {
            return url
          }
          return {uri: url}
        }
        // 如果开头/ 去掉
        if (url.indexOf('/') === 0) {
          url = url.substring(1)
        }
        // /upload/ueditor/ 去掉
        if (url.indexOf('upload/ueditor/') >= 0) {
          url = url.substring(url.indexOf('upload/ueditor/'))
        }
        url = global.img_host + '/' + url
      }
      const img = {uri: url}
      if (type === 1) {
        return url
      }
      return img
    } else {
      return url
    }
  },

  // 预览图片
  preview: function (urls, index = 0) {
    if (!urls) {
      return null
    }
    if (typeof urls === 'string') {
      urls = [urls]
    }
    console.log('image preview', urls)
    // 格式化图片
    let images = []
    if (urls) {
      for (let i = 0; i < urls.length; i++) {
        const element = urls[i]
        let img = $utils.image.load(element)
        images.push(img)
      }
    }
    let renderBox = (index) => (
      <View style={{width: width, height: height}}>
        <AlbumView
          control={true}
          index={index}
          maxScale={3}
          images={images}
          onPress={() => {
            setTimeout(() => {
              DeviceEventEmitter.emit('removeAllOverlay', {})
            }, 50)
          }}
          // thumbs={this.state.images1}
          style={{
            flex: 1,
            width: width,
            height: height,
            backgroundColor: '#000',
          }}
        />
      </View>
    )
    setTimeout(() => {
      Drawer.open(renderBox(index), 'bottom')
    }, 5)
  },
}
export default image
