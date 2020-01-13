const router = require('koa-router')()
const response = require('./tools/response')

router.prefix('/api/v1/tag')

router.post('/list', async (ctx, next) => {
    ctx.body = response.success(ctx.request.body)
})

router.post('/add', async (ctx, next) => {
    ctx.body = response.success(ctx.request.body)
})

router.post('/modify', async (ctx, next) => {
    ctx.body = response.success(ctx.request.body)
})

router.post('/delete', async (ctx, next) => {
    ctx.body = response.success(ctx.request.body)
})

module.exports = router
