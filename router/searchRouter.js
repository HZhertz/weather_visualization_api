import Router from 'koa-router'
import SearchController from '../controller/searchController.js'

const router = new Router()

router.get('/search/hot', SearchController.getSearchHot)
router.get('/search/suggest', SearchController.getSearchSuggest)

export default router
