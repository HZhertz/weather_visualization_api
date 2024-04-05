import Router from 'koa-router'
import DataController from '../controller/dataController.js'

const router = new Router()

router.get('/data/scatter/aqi', DataController.getAqiScatterData)
// router.get('/data/suggest',DataController.getSuggest)

export default router
