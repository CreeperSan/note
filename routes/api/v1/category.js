const router = require('koa-router')()
const response = require('./tools/response')
const auth_manager = require('./../../../manager/auth/auth_manager')
const param_utils = require('./tools/param')
const category_manager = require('./../../../manager/database/category_manager')

router.prefix('/api/v1/category')

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
        list : await category_manager.query_category(user_id)
    })
})

router.post('/add', async (ctx, next) => {
    const user_id = ctx.headers.id
    const user_key = ctx.headers.key
    const category_name = ctx.request.body.name
    if(param_utils.isEmpty(user_id) || param_utils.isEmpty(user_key)){
        ctx.body = response.auth_error('尚未登陆，请先登录')
        return
    }
    if (!auth_manager.is_auth(user_id, user_key)){
        ctx.body = response.auth_error('登录信息过期，请重新登录')
        return
    }
    let result = await category_manager.create_category(user_id, category_name, '#000000', '#66ccff' )
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
    const param_delete_category_id = ctx.request.body.id
    if(param_utils.isEmpty(param_delete_category_id)){
        ctx.body = response.request_error('缺少分类 ID')
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
        category_id : param_delete_category_id,
        is_success : await category_manager.delete_category(user_id, param_delete_category_id)
    })
})

module.exports = router
