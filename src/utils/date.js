import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh'

/**
 * ...多久之前
 * @param {*} targetTime 之前的时间
 * @returns 系统时间到之前指定时间的距离值
 */
export const timeAgo = (targetTime) => {
  // 格式化时间
  dayjs.extend(relativeTime)
  dayjs.locale('zh')
  var a = dayjs()
  var b = dayjs(targetTime)
  return a.to(b) // 返回多久之前
}

// 格式化时间 xxxx-xx-xx
export const timeFormat = (time) => dayjs(time).format('YYYY-MM-DD')
