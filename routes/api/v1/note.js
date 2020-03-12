const router = require('koa-router')()
const response = require('./tools/response')

router.prefix('/api/v1/note')

router.post('/list', async (ctx, next) => {

})

router.post('/add/text-plain', async (ctx, next) => {
    ctx.body = response.success(ctx.request.body)
    const user_id = ctx.headers.id
    const user_key = ctx.headers.key
    const title = ctx.request.body.title
    const type = ctx.request.body.type
    const data = ctx.request.body.data
})

router.post('/delete', async (ctx, next) => {

})

module.exports = router
