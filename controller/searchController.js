import axios from 'axios'
import { formatDate } from '../utils/index.js'

class SearchController {
  async getSearchHot(ctx) {
    try {
      const res = await axios.get('https://data.cma.cn/dataGis/static/gridgis/data/hotCity.json')
      ctx.body = {
        status: 200,
        type: 'success',
        message: '获取热门城市信息成功',
        data: res.data,
      }
    } catch (error) {
      ctx.body = {
        type: 'error',
        message: '获取热门城市信息失败',
        error: error,
      }
    }
  }
  async getSearchSuggest(ctx) {
    try {
      const { keywords } = ctx.request.query
      console.log(keywords)
      const res = await axios.get(
        `https://restapi.amap.com/v3/assistant/inputtips?s=rsv3&key=57d8585115185a07a62887c4aee7b4de&jscode=d80301867e61ef7b66fd92960af68053&keywords=${keywords}`
      )
      const result = res.data.tips.filter((item) => {
        return item.location.length != 0
      })
      ctx.body = {
        status: 200,
        type: 'success',
        message: '获取搜索结果成功',
        data: result,
      }
    } catch (error) {
      ctx.body = {
        type: 'error',
        message: '获取搜索结果失败',
        error: error,
      }
    }
  }
}
export default new SearchController()
