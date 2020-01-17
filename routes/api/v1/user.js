const router = require('koa-router')()
const log = require('../../../utils/log_utils')
const response = require('./tools/response')
const param_utils = require('./tools/param')
const auth = require('./../../../manager/auth/auth_manager')

const user_sql = require(process.cwd() + '/manager/database/user_manager')
require(process.cwd() + '/manager/database/note_manager')

router.prefix('/api/v1/user')

router.post('/login', async(ctx, next) => {
    const request_param = ctx.request.body
    // 獲取基本信息
    let email = param_utils.getOrDefault(request_param['email'], '')
    let password = param_utils.getOrDefault(request_param['password'], '')
    let id = param_utils.getOrDefault(ctx.headers['id'], 0)
    let key = param_utils.getOrDefault(ctx.headers['key'], 0)
    // 邏輯處理 
    log.i('[登录请求] email:' + email + '  password:' + password + '   id:' + id)

    let query_result = await user_sql.query_user(email, password)
    query_result = query_result[0]

    if(param_utils.isNotEmpty(query_result)){
        // 查询到用户存在
        let user_id = query_result[user_sql.KEY_ID]
        let user_key = ''
        if(auth.is_auth(id, key)){
            user_key = key
        }else{
            user_key = auth.add_auth(user_id)
        }
        ctx.body = response.success({
            'id' : query_result._id,
            'key' : user_key.toString()
        })
    }else{
        // 没有对应的用户
        ctx.body = response.auth_error('用户名或密码错误')
    }


})

router.post('/auth', async (ctx, next) => {
    const user_id = ctx.headers.id
    const user_key = ctx.headers.key

    ctx.body = response.success({
        id : user_id,
        key : user_key,
        is_auth : auth.is_auth(user_id, user_key)
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
