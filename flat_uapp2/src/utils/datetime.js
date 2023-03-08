import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
// 全局语言
dayjs.locale('zh-cn')
// 格式化时间
const time = {
  dayjs: dayjs,
  // 当前时间
  now: function() {
    let timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000
    return this.format(timestamp)
  },
  // 格式化
  format: function(timestamp, style) {
    if (style === null || style === '' || style === undefined) {
      style = 'YYYY-MM-DD HH:mm:ss'
    }
    const datetime = new Date()
    datetime.setTime(timestamp * 1000)
    const tt = dayjs(datetime).format(style)
    // console.log('time format', tt)
    return tt
  },
  // 时间戳和日期转换
  invert: function(time) {
    if (typeof time === 'string') {
      let timestamp = Date.parse(new Date(time))
      timestamp = timestamp / 1000
      return timestamp
    }
    if (typeof time === 'number') {
      time = time / 1000
      return this.format(time)
    }
  },
  // 时间戳
  timestamp: function(time) {
    if (typeof time === 'string') {
      let timestamp = Date.parse(new Date(time))
      timestamp = timestamp / 1000
      return timestamp
    }
    if (!time) {
      let timestamp = Date.parse(new Date())
      timestamp = timestamp / 1000
      return timestamp
    }
    return time
  },
}
export default time
