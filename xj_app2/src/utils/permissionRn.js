import {Platform, Alert, Linking} from 'react-native'
import Permissions, {
  PERMISSIONS,
  PermissionStatus,
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions'


const types = {
  // 通用
  common: {
    photo: {
      type: Platform.select({
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      }),
      name: '相册',
    },
    camera: {
      type: Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      }),
      name: '相机',
    },
    location: {
      type: Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
        android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      }),
      name: '定位权限',
    },
    microphone: {
      type: Platform.select({
        ios: PERMISSIONS.IOS.MICROPHONE,
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      }),
      name: '麦克风',
    },
    contacts: {
      type: Platform.select({
        ios: PERMISSIONS.IOS.CONTACTS,
        android: PERMISSIONS.ANDROID.READ_CONTACTS,
      }),
      name: '联系人',
    },
  },
  // ios系统
  ios: {
    bluetooth: {
      type: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
      name: '蓝牙',
    },
    reminder: {
      type: PERMISSIONS.IOS.REMINDERS,
      name: '提醒',
    },
    notification: {
      type: PERMISSIONS.IOS.iOSPushNotifications,
      name: '通知',
      params: Platform.select({
        ios: {
          type: ['alert', 'badge', 'sound'],
        },
      }),
    },
    speechRecognition: {
      type: PERMISSIONS.IOS.SPEECH_RECOGNITION,
      name: '语音识别',
    },
    mediaLibrary: {
      type: PERMISSIONS.IOS.MEDIA_LIBRARY,
      name: '媒体中心',
    },
    motion: {
      type: PERMISSIONS.IOS.MOTION,
      name: '健康数据',
    },
  },
  // android系统
  android: {
    storage: {
      type: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      name: '存储卡',
    },
    callPhone: {
      type: PERMISSIONS.ANDROID.CALL_PHONE,
      name: '电话呼叫',
    },
    readSms: {
      type: PERMISSIONS.ANDROID.READ_SMS,
      name: '读取短信',
    },
    sendSms: {
      type: PERMISSIONS.ANDROID.SEND_SMS,
      name: '发送短信',
    },
    receiveSms: {
      type: PERMISSIONS.ANDROID.RECEIVE_SMS,
      name: '接收短信',
    },
  },
}

// 权限
const permissionRn = {
  // 请求
  request: async function (permission) {
    let response = await Permissions.request(permission.type, permission.params)
    console.log(response);
    if (response) {
      // Response is one of:  'unavailable' | 'denied' | 'blocked' | 'granted'
      if (
        response === 'denied' ||
        response === 'blocked' ||
        response === 'unavailable'
      ) {
        // return Promise.reject(
        //   new Error('您没有授权此App访问您的' + permission.name),
        // )
        $utils.toast.text('您没有授权应用访问您的' + permission.name);
        return Promise.resolve(false)
      } else if (response === 'granted') {
        return Promise.resolve(1)
      } else {
        return Promise.resolve(false)
      }
    } else {
      return Promise.resolve(false)
    }
  },
  camera: async function () {
    return await this.request(types.common.camera)
  },
  photo: async function () {
    return await this.request(types.common.photo)
  },
  location: async function () {
    return await this.request(types.common.location)
  },
  microphone: async function () {
    return await this.request(types.common.microphone)
  },
  contacts: async function () {
    return await this.request(types.common.contacts)
  },
  iOSPushNotifications: async function () {
    return await this.request(types.ios.notification)
  },
  androidStorage: async function () {
    return await this.request(types.android.storage)
  },
  openSetting: function () {
    Promise.all([
      this.request(types.common.camera),
      this.request(types.common.microphone),
    ]).catch(() => {
      Alert.alert(
        '无麦克风/相机访问权限',
        '需要您的设备开启麦克风/相机访问权限，请您前往设置中开启权限',
        [
          {
            text: '取消',
            style: 'cancel',
            onPress: () => null,
          },
          {
            text: '去设置',
            onPress: () => {
              Linking.openURL('app-settings:').catch((err) =>
                console.log('open app-settings error:', err.message),
              )
            },
          },
        ],
        {
          cancelable: false,
        },
      )
    })
  },
  checkNotification: async function (props) {
    return checkNotifications().then(({status, settings}) => {
      console.log('permission checkNotification:', status, settings)
      if (
        status === 'denied' ||
        status === 'blocked' ||
        status === 'unavailable'
      ) {
        // $toast.text('您没有授权此App接收通知')
        return Promise.resolve(false)
      } else if (status === 'granted') {
        return Promise.resolve(1)
      } else {
        return Promise.resolve(false)
      }
    })
  },
  requestNotification: async function (props) {
    return requestNotifications(['alert', 'sound']).then(
      ({status, settings}) => {
        console.log('permission requestNotifications:', status, settings)
        if (
          status === 'denied' ||
          status === 'blocked' ||
          status === 'unavailable'
        ) {
          // $toast.text('您没有授权此App接收通知')
          return Promise.resolve(false)
        } else if (status === 'granted') {
          return Promise.resolve(1)
        } else {
          return Promise.resolve(false)
        }
      },
    )
  },
}

export default permissionRn
