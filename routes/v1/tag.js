const router = require('koa-router')()
const response = require('./utils/response')

router.prefix('/v1/tag')

router.get('/add', async (ctx, next) => {
    ctx.body = response.success()
})

router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        title: 'Hello Koa 2!'
    })
})

router.get('/string', async (ctx, next) => {
    ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
    ctx.body = {
        title: 'koa2 json'
    }
})

module.exports = router
