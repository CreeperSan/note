const router = require('koa-router')()
const response = require('./tools/response')
const note_manager = require('./../../../manager/database/note_manager')

router.prefix('/api/v1/note')

router.post('/list', async (ctx, next) => {

})

router.post('/add/text-plain', async (ctx, next) => {
    ctx.body = response.success(ctx.request.body)
    const user_id = ctx.headers.id
    const user_key = ctx.headers.key
    const note_id = ctx.request.body.id
    const note_title = ctx.request.body.title
    const note_content = ctx.request.body.content

    // 参数组成以及检查


    let result = await note_manager.add_note(user_id, note_manager.TYPE_PLAIN_TEXT, note_title, note_content)

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
