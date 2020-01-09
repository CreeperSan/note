const router = require('koa-router')()
const log = require('../../utils/log_utils')
const response = require('./utils/response')
const param_utils = require('./utils/param')

const user_sql = require(process.cwd() + '/manager/database/user_manager')
require(process.cwd() + '/manager/database/note_manager')

router.prefix('/v1/user')

router.post('/login', async(ctx, next) => {
    const request_param = ctx.request.body

    let email = param_utils.getOrDefault(request_param['email'], '')
    let password = param_utils.getOrDefault(request_param['password'], '')
    let id = param_utils.getOrDefault(ctx.headers['id'], 0)
    
    
    log.i('[登录请求] email:' + email + '  password:' + password + '   id:' + id)

    let query_result = await user_sql.query_user(email, password)
    query_result = query_result[0]
    
    console.log(JSON.stringify(query_result))

    if(param_utils.isNotEmpty(query_result)){
        // 查询到用户存在

        ctx.body = response.success({
            'key' : '1d1v32d4413d0a38b',
            'email' : query_result.email,
            'password' : query_result.password,
            'id' : query_result._id
        })
    }else{
        // 没有对应的用户
        ctx.body = response.auth_error('用户名或密码错误')
    }


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
