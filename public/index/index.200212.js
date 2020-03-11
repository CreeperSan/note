// ////////////////////////////////////////////////////
// //  引用到 request.js
// ////////////////////////////////////////////////////
//
// /**
//  *  获取分类信息部分
//  */
// async function getTagList() {
//    return await post('/api/v1/tag/list', null)
// }
//
// async function deleteTag(tagID){
//     return await post('/api/v1/tag/delete', {
//         tag_id : tagID
//     })
// }
//
// /**
//  *  获取标签信息部分
//  */
// async function getCategory() {
//     return await post('/api/v1/category/list')
// }
//
// async function deleteCategory(categoryID) {
//     return post('/api/v1/category/delete', {
//         id : categoryID
//     })
// }
//
//
// /**
//  *  获取笔记信息部分
//  */
//
//
// /**
//  *  UI部分
//  */
//
// // 下面是UI模板
//
//
// // 下面是UI界面的处理
//
// function clearTagList() {
//     document.getElementById('tag-div').innerHTML = ''
// }
//
// function clearCategoryList() {
//     document.getElementById('category-div').innerHTML = ''
// }
//
// function createTagDiv() {
//     let element = document.querySelector('#category-item')
//     return element.content.cloneNode(true)
// }
//
// function _showDialogBackgroundDiv() {
//     document.getElementById('dialog-div').style.display = 'flex'
// }
//
// function _hideDialogBackgroundDiv() {
//     document.getElementById('dialog-div').style.display = 'none'
// }
//
// function showCreateCategoryDialog() {
//     _showDialogBackgroundDiv()
//
//     document.getElementById('dialog-div').append(
//         stringTemplateToHtml(templateDialogCreateCategory({
//
//         }))
//     )
//
//     document.getElementById('dialog-create-category-cancel').onclick = function(){
//
//     }
//     document.getElementById('dialog-create-category-create').onclick = function(){
//         alert('click')
//     }
// }
//
// /**
//  *  通用处理函数
//  */
// function stringTemplateToHtml(htmlString) {
//     return new DOMParser().parseFromString(htmlString,'text/html').body.childNodes[0]
// }

let app = new Vue({
    delimiters: ['[[', ']]'],
    el : '#app',
    data : {
        /** 一些常量 **/
        DIALOG_NONE : 0,
        DIALOG_MESSAGE : 1000,
        DIALOG_EDIT_TAG : 1001,
        DIALOG_EDIT_CATEGORY : 1002,
        DIALOG_LOADING : 1003,
        /** 下面是控制UI相关的变量 **/
        flag_dialog : 0,         // 是否正在显示对话框（对话框背景是否展示）
        /** 下面是控制数据相关的变量 **/
        tag_list : [],                  // 标签列表 对应的键有 id, name, create_time
        category_list : [],             // 分类列表 对应的键有 id, name, create_time
    },
    created : function(){
        const self = this
        // 获取所有标签
        this.refresh_tag_list()
        // 获取所有分类
        this.refresh_category_list()
    },
    methods : {
        /** 刷新标签列表 **/
        refresh_tag_list : async function () {
            const self = this
            let response = await post('/api/v1/tag/list')
            if(response.success && response.data !== undefined && response.data.list !== undefined){
                let response_data_list = response.data.list
                let data_list = []
                for(let i=0; i<response_data_list.length; i++){
                    let item = response_data_list[i]
                    data_list.push({
                        id : item._id,
                        name : item.name,
                        create_time : item.create_time,
                    })
                }
                self.tag_list = data_list
                console.log(data_list)
            }else{
                console.log('获取标签列表失败！请重试！')
            }
        },
        /** 刷新分类列表 **/
        refresh_category_list : async function () {
            const self = this
            let response = await post('/api/v1/category/list')
            if(response.success && response.data !== undefined && response.data.list !== undefined){
                let response_data_list = response.data.list
                let data_list = []
                for(let i=0; i<response_data_list.length; i++){
                    let item = response_data_list[i]
                    data_list.push({
                        id : item._id,
                        name : item.name,
                        create_time : item.create_time,
                    })
                }
                self.category_list = data_list
                console.log(data_list)
            }else{
                console.log('获取分类列表失败！请重试！')
            }
        },
        /** 显示创建标签对话框 **/
        show_create_tag_dialog : function (tag_model) {
            const self = this
            self.flag_dialog = self.DIALOG_EDIT_TAG
            // getElementByID
            let element_title = document.getElementById('dialog-tag-create-title')
            let element_name = document.getElementById('dialog-tag-create-name')
            let element_id = document.getElementById('dialog-tag-create-id')
            let element_create_time = document.getElementById('dialog-tag-create-create-time')
            let element_btn_cancel = document.getElementById('dialog-tag-create-btn-cancel')
            let element_btn_confirm = document.getElementById('dialog-tag-create-btn-confirm')
            let element_btn_delete = document.getElementById('dialog-tag-create-btn-delete')
            //  初始化数据
            console.log(tag_model)
            if(tag_model === null || tag_model === undefined){
                // 说明是创建标签
                element_title.innerText = '创建标签'
                element_name.value = ''
                element_id.innerText = '尚未创建'
                element_create_time.innerText = '尚未创建'
                element_btn_delete.style.display = 'none'
            }else{
                // 说明是编辑标签
                element_title.innerText = '编辑标签'
                element_name.value = tag_model.name
                element_id.innerText = '#' + tag_model.id
                element_create_time.innerText = tag_model.create_time
                element_btn_delete.style.display = 'block'
            }
            // 按钮的点击事
            element_btn_cancel.onclick = function () {
                self.flag_dialog = self.DIALOG_NONE
            }
            element_btn_delete.onclick = function () {
                self.show_message_dialog('删除标签', '你确定要删除"'+tag_model.name+'"吗？此操作不可逆！', function () {
                    self.show_loading_dialog('正在删除标签', true)
                }, function () {
                    self.close_dialog()
                })
            }
            element_btn_confirm.onclick = function () {
                self.show_loading_dialog('正在保存标签', true)
            }
        },
        /* 显示消息对话框 */
        show_message_dialog : function (title, message, positive_callback, negative_callback) {
            const self = this
            let element_title = document.getElementById('dialog-message-title')
            let element_message = document.getElementById('dialog-message-message')
            let element_btn_cancel = document.getElementById('dialog-message-cancel')
            let element_btn_confirm = document.getElementById('dialog-message-confirm')
            // 设置内容
            element_title.innerText = title
            element_message.innerText = message
            element_btn_confirm.onclick = positive_callback
            element_btn_cancel.onclick = negative_callback
            self.flag_dialog = self.DIALOG_MESSAGE
        },
        /* 显示加载中对话框 */
        show_loading_dialog : function(content, cancelable){
            const self = this
            let element_message = document.getElementById('dialog-loading-message')
            element_message.innerText = content
            self.flag_dialog = self.DIALOG_LOADING
        },
        /* 关闭所有对话框 */
        close_dialog : function () {
            const self = this
            self.flag_dialog = self.DIALOG_NONE
        }
    },
})
