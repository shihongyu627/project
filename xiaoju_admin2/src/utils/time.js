import moment from 'moment'
// 格式化时间
let time = {
  moment: moment,
  // 当前时间
  now: function () {
    let timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000
    return this.format(timestamp)
  },
  // 格式化
  format: function (timestamp, style) {
    if (style === null || style === '' || style === undefined) {
      style = 'YYYY-MM-DD HH:mm:ss'
    }
    if(!timestamp){
      timestamp = Date.parse(new Date())
      timestamp = timestamp / 1000
    }
    let datetime = new Date()
    datetime.setTime(timestamp * 1000)
    return moment(datetime).format(style)
  },
  // 时间戳和日期转换
  invert: function (time) {
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
  timestamp: function (time) {
    if (typeof time === 'string') {
      let timestamp = Date.parse(new Date(time))
      timestamp = timestamp / 1000
      return timestamp
    }
    return time
  }
}
// 全局语言
time.moment.locale('zh')
export default time
