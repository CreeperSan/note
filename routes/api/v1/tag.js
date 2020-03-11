const router = require('koa-router')()
const response = require('./tools/response')
const auth_manager = require('./../../../manager/auth/auth_manager')
const param_utils = require('./tools/param')
const tag_manager = require('./../../../manager/database/tag_manager')

router.prefix('/api/v1/tag')

router.post('/list', async (ctx, next) => {
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
    ctx.body = response.success({
        list : await tag_manager.query_tags(user_id)
    })
})

router.post('/add', async (ctx, next) => {
    ctx.body = response.success(ctx.request.body)
    const user_id = ctx.headers.id
    const user_key = ctx.headers.key
    const tag_name = ctx.request.body.name
    if(param_utils.isEmpty(user_id) || param_utils.isEmpty(user_key)){
        ctx.body = response.auth_error('尚未登陆，请先登录')
        return
    }
    if (!auth_manager.is_auth(user_id, user_key)){
        ctx.body = response.auth_error('登录信息过期，请重新登录')
        return
    }
    let result = await tag_manager.add_tags(user_id, tag_name, '#66ccff', '#000000')
    if(result){
        ctx.body = response.success()
    }else{
        ctx.body = response.error_params('参数不合法')
    }
})

router.post('/delete', async (ctx, next) => {
    ctx.body = response.success(ctx.request.body)
    const user_id = ctx.headers.id
    const user_key = ctx.headers.key
    const param_delete_tag_id = ctx.request.body.id
    if(param_utils.isEmpty(param_delete_tag_id)){
        ctx.body = response.request_error('缺少TagID')
        return
    }
    if(param_utils.isEmpty(user_id) || param_utils.isEmpty(user_key)){
        ctx.body = response.auth_error('尚未登陆，请先登录')
        return
    }
    if (!auth_manager.is_auth(user_id, user_key)){
        ctx.body = response.auth_error('登录信息过期，请重新登录')
        return
    }
    ctx.body = response.success({
        tag_id : param_delete_tag_id,
        is_success : await tag_manager.delete_tag(user_id, param_delete_tag_id)
    })
})

module.exports = router
