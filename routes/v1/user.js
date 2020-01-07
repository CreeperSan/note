const router = require('koa-router')()
const log = require('../../utils/log_utils')
const response = require('./utils/response')
const param_utils = require('./utils/param')

router.prefix('/v1/user')

router.post('/login', async(ctx, next) => {
    const request_param = ctx.request.body

    let email = param_utils.getOrDefault(request_param['email'], '')
    let password = param_utils.getOrDefault(request_param['password'], '')
    
    log.i('[登录请求] email:' + email + '  password:' + password)
    ctx.body = response.success({
        'key' : '1d1v32d4413d0a38b',
        'email' : email,
        'password' : password
    })
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
