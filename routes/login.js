const router = require('koa-router')()

router.get('/login', async (ctx, next) => {
  await ctx.render('login/login', {
    title: 'Hello Koa 2!'
  })
})

module.exports = router