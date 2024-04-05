import axios from 'axios'
import { formatDate } from '../utils/index.js'

class DataController {
  async getAqiScatterData(ctx) {
    try {
      const { type } = ctx.request.query
      const ago = new Date(new Date().getTime() - 1 * 60 * 60 * 1000)
      const time = formatDate(ago, 'YYYYMMDDHH0000')
      const res = await axios.get(
        `https://data.cma.cn/dataGis/multiSource/getAirQuality?time=${time}&type=${type}`
      )
      ctx.body = {
        status: 200,
        type: 'success',
        message: `获取${type}散点数据成功`,
        data: res.data.data,
      }
    } catch (error) {
      ctx.body = {
        type: 'error',
        message: `获取${type}散点数据失败`,
        error: error,
      }
    }
  }
}
export default new DataController()
