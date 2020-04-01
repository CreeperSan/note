let app = new Vue({
    delimiters: ['[[', ']]'],
    el : '#app',
    data : {
        /** 一些常量 **/
        DIALOG_NONE : 0,
        DIALOG_MESSAGE : 1000,
        DIALOG_EDIT_TAG : 1001,
        DIALOG_LOADING : 1003,
        DIALOG_NOTE_TYPE_SELECT : 1004,
        NOTE_TYPE_PLAIN_TEXT : 1,
        NOTE_TYPE_MULTI_SELECTION : 2,
        /** 一些静态数据 **/
        const_dialog_type : [{
            type : 1,
            name : '纯文本',
            preview : '/img/img_note_type_plain_text.jpg'
        },{
            type : 2,
            name : '选项列表',
            preview : '/img/img_note_type_selection.jpg'
        }],
        /** 下面是控制UI相关的变量 **/
        flag_dialog : 0,                // 是否正在显示对话框（对话框背景是否展示）
        /** 下面是控制数据相关的变量 **/
        note_editing : null,            // 当前正在编辑的笔记，如果为null则代表正在显示列表
        tag_list : [],                  // 标签列表 对应的键有 id, name, create_time
        note_list : [],                 // 笔记列表 对应的键有 id, name
    },
    created : function(){
        const self = this
        // 获取所有标签
        this.refresh_tag_list()
        // 获取所有笔记
        this.refresh_all_note()
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
        /** 刷新所有笔记 **/
        refresh_all_note : async function(){
            let self = this
            let response = await post('/api/v1/note/list', {

            })

            if(response.success){
                self.note_list = response.data
            }else{
                self.show_fail_dialog('获取所有笔记失败', 2000)
            }

            console.log(response)
        },
        /** 刷新 **/
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
            // 按钮的点击事件
            element_btn_cancel.onclick = function () {
                self.flag_dialog = self.DIALOG_NONE
            }
            // 删除标签
            element_btn_delete.onclick = function () {
                self.show_message_dialog('删除标签', '你确定要删除"'+tag_model.name+'"吗？此操作不可逆！',  async function () {
                    self.show_loading_dialog('正在删除标签', true)
                    let response = await post('/api/v1/tag/delete', {
                        id : tag_model.id
                    })
                    if (response.success){
                        self.show_success_dialog('标签 "'+tag_model.name + '" 已删除', 2000)
                        await self.refresh_tag_list()
                    }else{
                        self.show_fail_dialog('删除失败，' + response.message, 2000)
                    }
                }, function () {
                    self.close_dialog()
                })
            }
            // 创建/保存 标签
            element_btn_confirm.onclick = async function () {
                self.show_loading_dialog('正在创建标签', true)
                let tag_name = element_name.value
                if(!tag_name || tag_name.length <= 0){
                    self.show_fail_dialog('标签名称不能为空！', 2000)
                }else{
                    let response = await post('/api/v1/tag/add', {
                        name : tag_name
                    })
                    if (response.success){
                        self.show_success_dialog('创建标签成功', 2000)
                        await self.refresh_tag_list()
                    }else{
                        self.show_success_dialog('创建标签失败，' + response.message, 2000)
                    }
                }
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
        /* 显示对话框 */
        _show_loading_dialog : function(img, content, dismiss_time){
            const self = this
            let element_message = document.getElementById('dialog-loading-message')
            let element_img = document.getElementById('dialog-loading-img')
            element_img.src = img
            element_message.innerText = content
            self.flag_dialog = self.DIALOG_LOADING
            // 自动关闭
            if (dismiss_time !== undefined && dismiss_time !== null && dismiss_time > 0){
                setTimeout(function () {
                    self.close_dialog()
                }, dismiss_time)
            }
        },
        /* 显示加载中对话框 */
        show_loading_dialog : function(content){
            const self = this
            document.getElementById('dialog-loading-img').className = 'animation-rotate' // 设置旋转动画
            self._show_loading_dialog('/icon/ic_loading.png', content, 0)
        },
        /* 显示成功的对话框 */
        show_success_dialog : function(content, dismiss_time){
            const self = this
            if(dismiss_time === undefined || dismiss_time === null){
                dismiss_time = 2000
            }
            document.getElementById('dialog-loading-img').className = '' // 取消旋转动画
            self._show_loading_dialog('/icon/ic_success.png', content, dismiss_time)
        },
        /* 显示失败的对话框 */
        show_fail_dialog : function(content, dismiss_time){
            const self = this
            if(dismiss_time === undefined || dismiss_time === null){
                dismiss_time = 2000
            }
            document.getElementById('dialog-loading-img').className = '' // 取消旋转动画
            self._show_loading_dialog('/icon/ic_fail.png', content, dismiss_time)
        },
        show_select_note_type_dialog : function(){
            const self = this
            self.flag_dialog = self.DIALOG_NOTE_TYPE_SELECT
        },
        /* 关闭所有对话框 */
        close_dialog : function () {
            const self = this
            self.flag_dialog = self.DIALOG_NONE
        },
        /* 按下了编写新的笔记 */
        on_write_new_note_click : function () {
            const self = this
            self.show_select_note_type_dialog()
        },
        /* 指定了写哪一种类型的笔记 */
        on_write_new_note_with_type_click : function(type){
            const self = this
            switch(type){
                case self.NOTE_TYPE_PLAIN_TEXT : {
                    self.close_dialog()
                    self.note_editing = {
                        type : self.NOTE_TYPE_PLAIN_TEXT
                    }
                    break;
                }
                case self.NOTE_TYPE_MULTI_SELECTION : {
                    self.close_dialog()
                    self.note_editing = {
                        type : self.NOTE_TYPE_MULTI_SELECTION
                    }
                    break;
                }
            }
        },
        /* 按下取消 编辑/创建 笔记按钮 */
        on_cancel_note_edit_click : function(){
            const self = this
            self.note_editing = null
        },
        /* 按下了保存笔记按钮 */
        on_save_note_click : async function () {
            const self = this
            // 如果没有类型，则退出
            if(
                self.note_editing === undefined ||
                self.note_editing === null ||
                self.note_editing.type === undefined ||
                self.note_editing.type === null
            ){
                alert('no type')
                return
            }
            // 保存数据
            switch (self.note_editing.type) {
                // 保存为 纯文本
                case self.NOTE_TYPE_PLAIN_TEXT:{
                    let element_title = document.getElementById('note-edit-text-plain-title')
                    let element_content = document.getElementById('note-edit-text-plain-content')
                    let title_str = element_title.value
                    let content_str = element_content.value
                    self.show_loading_dialog('正在创建笔记')
                    self.note_editing = null
                    let response = await post('/api/v1/note/add/text-plain', { // todo 发送网络请求
                        title : title_str,
                        content : content_str,
                        type : self.NOTE_TYPE_PLAIN_TEXT
                    })
                    if(response.success){
                        self.show_success_dialog('创建笔记成功', 2000)
                        await self.refresh_all_note()
                    }else{
                        self.show_fail_dialog('创建笔记失败，' + response.message, 2000)
                    }
                    break
                }
                // 保存为 多选项
                case self.NOTE_TYPE_MULTI_SELECTION:{
                    self.note_editing = null
                    break
                }
                // 保存为 其他类型
                default : {
                    self.show_fail_dialog('未知类型', 2000)
                    self.note_editing = null
                    break;
                }
            }
        },
    },
})
