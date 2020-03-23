const router = require('koa-router')()
const response = require('./tools/response')
const note_manager = require('./../../../manager/database/note_manager')
const param_utils = require('./../../../utils/param_utils')
const auth_manager = require('./../../../manager/auth/auth_manager')

router.prefix('/api/v1/note')

router.post('/list', async (ctx, next) => {
    const user_id = ctx.headers.id
    const user_key = ctx.headers.key
    const filter_tag_id = ctx.request.body.tag
    const filter_category_id = ctx.request.body.category
    const filter_keyword = ctx.request.body.keyword
    // 参数组成以及检查
    if(param_utils.isEmpty(user_id) || param_utils.isEmpty(user_key)){
        ctx.body = response.auth_error('尚未登陆，请先登录')
        return
    }
    if (!auth_manager.is_auth(user_id, user_key)){
        ctx.body = response.auth_error('登录信息过期，请重新登录')
        return
    }
    // 查数据库
    let note_list = await note_manager.query_note(user_id, null, null, null)
    let result_note_list = []
    for(let i=0; i<note_list.length; i++){
        let note_database_item = note_list[i]
        result_note_list.push({
            id : note_database_item[note_manager.KEY_USER_ID],
            title : note_database_item[note_manager.KEY_TITLE],
            archive : note_database_item[note_manager.KEY_ARCHIVE],
            pinned : note_database_item[note_manager.KEY_PINNED],
            create_time : note_database_item[note_manager.KEY_CREATE_TIME],
            modify_time : note_database_item[note_manager.KEY_MODIFY_TIME],
            type : note_database_item[note_manager.KEY_TYPE],
            data : note_database_item[note_manager.KEY_DATA],
        })
    }
    ctx.body = response.success(result_note_list)
    console.log(note_list)
})

router.post('/add/text-plain', async (ctx, next) => {
    const user_id = ctx.headers.id
    const user_key = ctx.headers.key
    const note_id = ctx.request.body.id
    const note_title = ctx.request.body.title
    const note_content = ctx.request.body.content

    // 参数组成以及检查
    if(param_utils.isEmpty(user_id) || param_utils.isEmpty(user_key)){
        ctx.body = response.auth_error('尚未登陆，请先登录')
        return
    }
    if (!auth_manager.is_auth(user_id, user_key)){
        ctx.body = response.auth_error('登录信息过期，请重新登录')
        return
    }

    // 添加到数据库
    let result = await note_manager.add_note(user_id, note_manager.TYPE_PLAIN_TEXT, note_title, note_content)

    console.log(result)

    if(result){
        ctx.body = response.success()
    }else{
        ctx.body = response.error_params('参数不合法, '+result)
    }

    console.log(ctx.request.body)
})

router.post('/delete', async (ctx, next) => {

})



module.exports = router
