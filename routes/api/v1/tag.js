const router = require('koa-router')()
const response = require('./tools/response')
const auth_manager = require('./../../../manager/auth/auth_manager')
const param_utils = require('./tools/param')

router.prefix('/api/v1/tag')

router.post('/list', async (ctx, next) => {
    ctx.body = response.success(ctx.request.body)
    console.log(ctx.headers)
    const user_id = ctx.headers.id
    const user_key = ctx.headers.key
    if(param_utils.isEmpty(user_id) || param_utils.isEmpty(user_key)){
        ctx.body = response.auth_error('尚未登陆，请先登录')
        return
    }
    if (!auth_manager.is_auth(user_id, user_key)){
        ctx.body = response.auth_error('登录信息过期，请重新登录')
        return
    }
    ctx.body = response.success('登录成功，功能开发中...')
})

router.post('/add', async (ctx, next) => {
    ctx.body = response.success(ctx.request.body)
})

router.post('/modify', async (ctx, next) => {
    ctx.body = response.success(ctx.request.body)
})

router.post('/delete', async (ctx, next) => {
    ctx.body = response.success(ctx.request.body)
})

module.exports = router
