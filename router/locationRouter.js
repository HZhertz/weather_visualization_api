import Router from 'koa-router'
import LocationController from '../controller/locationController.js'

const router = new Router()

router.get('/location/geo', LocationController.getLocationGeo)
router.get('/location/basel', LocationController.getLocationBasel)
router.get('/location/lifeindex', LocationController.getLocationLifeindex)
router.get('/location/warninfo', LocationController.getLocationWarninfo)
router.get('/location/eledetail', LocationController.getLocationEleDetail)
router.get('/location/aqiquality', LocationController.getLocationAqiQuality)

export default router
