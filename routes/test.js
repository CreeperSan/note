const router = require('koa-router')()
const auth_manager = require('./../manager/auth/auth_manager')

router.get('/test', async (ctx, next) => {
    await ctx.render('test', {
        title: 'Hello Koa 2!'
    })
})

router.post('/auth', async (ctx, next) => {
    ctx.body = auth_manager.print()
})

module.exports = router