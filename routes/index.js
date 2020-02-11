const router = require('koa-router')()
const auth_manager = require('./../manager/auth/auth_manager')

router.get('/', async (ctx, next) => {
  // 如果cookie不存在，则为undefined
  let userID = ctx.cookies.get('UserID')
  let key = ctx.cookies.get('key')
  // 逻辑判断
  if(userID === undefined || key === undefined){ // 未登录
    await ctx.render('index-login') // 登录页
  }else{ // 登陆过，有保存记录
    if (auth_manager.is_auth(userID, key)){
      await ctx.render('index', {
        title: 'Hello Koa 2!'
      })
    }else{
      ctx.cookies.set('UserID', undefined)
      ctx.cookies.set('key', undefined)
      await ctx.render('index-login', {
        hint: '登录信息已过期，请重新登录'
      })
    }
  }
  console.log(ctx.cookies.get('NotExists'))

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
