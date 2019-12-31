const router = require('koa-router')()
const response = require('./utils/response')

router.prefix('/v1/tag')

router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        title: 'Hello Koa 2!'
    })
})

router.post('/add', async (ctx, next) => {
    ctx.body = response.success(ctx.request.body)
})

module.exports = router
