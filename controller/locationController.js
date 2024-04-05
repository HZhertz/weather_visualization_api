import axios from 'axios'
import { formatDate } from '../utils/index.js'

class LocationController {
  async getLocationGeo(ctx) {
    try {
      const { lat, lon } = ctx.request.query

      let url = 'https://api.tianditu.gov.cn/geocoder'
      let params = {
        postStr: JSON.stringify({ lon: lon, lat: lat, ver: 1 }),
        type: 'geocode',
        tk: '5a1d34815475f88e6d8802da6be832ae',
      }
      let headers = {
        Cookie:
          'HWWAFSESID=31e3b51a0e9b03db795; HWWAFSESTIME=1712131229626; TDTSESID=ce3f0a35467060cbd715ff40461fd629|e3a685faf3d6f307e30c6070682303b5',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      }
      const tdRes = await axios.get(url, { params, headers })
      const amRes = await axios.get(
        `https://restapi.amap.com/v3/geocode/regeo?key=57d8585115185a07a62887c4aee7b4de&s=rsv3&language=zh_cn&location=${lon},${lat}&jscode=d80301867e61ef7b66fd92960af68053`
      )

      let type
      let data
      if (tdRes.data.status === '0' && tdRes.data.result.formatted_address) {
        data = tdRes.data.result
        if (tdRes.data.result.addressComponent.nation === '中国') {
          type = 'domestic'
        } else {
          type = 'abroad'
        }
      } else if (amRes.data.status === '1' && amRes.data.regeocode.formatted_address.length !== 0) {
        type = 'seaArea'
        data = amRes.data.regeocode
      } else {
        type = 'point'
        data = {
          location: amRes.data.regeocode.addressComponent.streetNumber.location,
        }
      }
      ctx.body = {
        status: 200,
        type: 'success',
        message: '获取地理位置信息成功',
        infoType: type,
        data: data,
      }
    } catch (error) {
      ctx.body = {
        type: 'error',
        message: '获取地理位置信息失败',
        error: error,
      }
    }
  }
  async getLocationBasel(ctx) {
    try {
      const { lat, lon } = ctx.request.query
      const [contentRes, uviRes] = await Promise.all([
        axios.get(`https://data.cma.cn/dataGis/multiSource/getAPILiveDataInfo?lat=${lat}&lon=${lon}`),

        axios.get(
          `https://data.cma.cn/onemap/jc/metadata/omservicemanager/onemap_proxy/query/uvi?ONEMAP-TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2V4dHJhX2luZm8iOiLlrp7lhrXlsI_nqIvluo8iLCJ1c2VyX3R5cGUiOiIxIiwidXNlcl9pZCI6InNreGN4IiwidXNlcl9uYW1lIjoi5a6e5Ya15bCP56iL5bqPIiwibm9uY2UiOiIxNzAyMjc5NTEzMDg1In0.rqUDCif9M4j71nIbclGQHb5OpY5h_qx6SsHiq9sM0q8&lat=${lat}&lon=${lon}`
        ),
      ])

      ctx.body = {
        status: 200,
        type: 'success',
        message: '获取天气要素信息成功',
        data: {
          uvi: uviRes.data.data,
          list: contentRes.data.list,
        },
      }
    } catch (error) {
      ctx.body = {
        type: 'error',
        message: '获取天气要素信息失败',
        error: error,
      }
    }
  }
  async getLocationLifeindex(ctx) {
    try {
      const { lat, lon } = ctx.request.query
      let now = new Date()
      const timeStr = formatDate(now, 'YYYYMMDDHHmmss')
      console.log(lat, lon, timeStr)
      const res = await axios.get(
        `https://data.cma.cn/dataGis/meteLive/getLifeLiveInfo?timeStr=${timeStr}&lat=${lat}&lon=${lon}&dataType=LIFELIVE`
      )
      ctx.body = {
        status: 200,
        type: 'success',
        message: '获取生活指数信息成功',
        data: res.data,
      }
    } catch (error) {
      ctx.body = {
        type: 'error',
        message: '获取生活指数信息失败',
        error: error,
      }
    }
  }
  async getLocationWarninfo(ctx) {
    try {
      const { lat, lon } = ctx.request.query
      const areaRes = await axios.get(
        `https://data.cma.cn/onemap/jc/metadata/omservicemanager/onemap_proxy/location/admin?lon=${lon}&lat=${lat}`
      )

      const countyCode = areaRes.data.data.countyCode
      const cityCode = areaRes.data.data.cityCode
      const provinceCode = areaRes.data.data.provinceCode

      const now = new Date()
      const ago = new Date(now.getTime() - 12 * 60 * 60 * 1000)
      const startTime = formatDate(ago, 'YYYY-MM-DD+HH:mm:ss')
      const endTime = formatDate(now, 'YYYY-MM-DD+HH:mm:ss')
      console.log(lat, lon, startTime, endTime)
      const res = await axios.get(
        `https://data.cma.cn/dataGis/disasterWarning/getWarningDataByCnty?startTime=${startTime}&endTime=${endTime}&SpecialType=0%252C1%252C2`
      )
      const result = res.data.filter((item) => {
        return item.areaId === countyCode || item.areaId === cityCode || item.areaId === provinceCode
      })

      ctx.body = {
        status: 200,
        type: 'success',
        message: '获取预警信息成功',
        data: result,
      }
    } catch (error) {
      ctx.body = {
        type: 'error',
        message: '获取预警信息失败',
        error: error,
      }
    }
  }
  async getLocationEleDetail(ctx) {
    try {
      const { lat, lon } = ctx.request.query
      const staRes = await axios.get(
        `https://data.cma.cn/server/weather_content3.php?stationName=none&location=1&apiTp=1&lat=${lat}&lag=${lon}&dist=13`
      )
      const staId = staRes.data.DS.stationId
      if (staId) {
        const [skRes, ycRes] = await Promise.all([
          axios.post(
            `https://data.cma.cn/dataGis/exhibitionData/getSKStationInfo?staId=${staId}&funitemmenuid=115990101&typeCode=NWST`
          ),
          axios.post(
            `https://data.cma.cn/dataGis/exhibitionData/getStationInfo?staId=${staId}&funitemmenuid=115990101&typeCode=NWST`
          ),
        ])
        ctx.body = {
          status: 200,
          type: 'success',
          message: '获取要素详情成功',
          data: {
            sk: skRes.data,
            yc: ycRes.data,
          },
        }
      } else {
        ctx.body = {
          type: 'error',
          message: '获取要素详情失败',
          error: error,
        }
      }
      // const skRes = await axios.post(
      //   `https://data.cma.cn/dataGis/exhibitionData/getSKStationInfo?staId=${staId}&funitemmenuid=115990101&typeCode=NWST`
      // )

      // const ycRes = await axios.post(
      //   `https://data.cma.cn/dataGis/exhibitionData/getStationInfo?staId=${staId}&funitemmenuid=115990101&typeCode=NWST`
      // )
    } catch (error) {
      ctx.body = {
        type: 'error',
        message: '获取要素详情失败',
        error: error,
      }
    }
  }
  async getLocationAqiQuality(ctx) {
    try {
      const { lat, lon } = ctx.request.query
      const time = formatDate(new Date(), 'YYYYMMDDHH0000')
      const aqiRes = await axios.get(
        `https://data.cma.cn/dataGis/multiSource/getAirQualityByLatLon?time=${time}&lat=${lat}&lon=${lon}`
      )
      ctx.body = {
        status: 200,
        type: 'success',
        message: '获取空气质量成功',
        data: aqiRes.data,
      }
    } catch (error) {
      ctx.body = {
        type: 'error',
        message: '获取空气质量失败',
        error: error,
      }
    }
  }
}
export default new LocationController()
