// 导入koa
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Cors from 'koa2-cors'
import Static from 'koa-static'
import path from 'path'
import { fileURLToPath } from 'url'

const app = new Koa()
app.use(bodyParser())

app.use(Cors())

const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use(Static(path.join(__dirname, './public')))

import dataRouter from './router/dataRouter.js'
app.use(dataRouter.routes())
import locationRouter from './router/locationRouter.js'
app.use(locationRouter.routes())
import searchRouter from './router/searchRouter.js'
app.use(searchRouter.routes())

app.listen(3007, () => {
  console.log('server runing at http://127.0.0.1:3007')
})
