const router = require('koa-router')()

router.get('/test', async (ctx, next) => {
    await ctx.render('test', {
        title: 'Hello Koa 2!'
    })
})

module.exports = router