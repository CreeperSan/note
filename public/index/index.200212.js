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
        DIALOG_NOTE_TYPE_SELECT : 1004,
        NOTE_TYPE_PLAIN_TEXT : 1,
        /** 一些静态数据 **/
        const_dialog_type : [{
            type : 0,
            name : '纯文本',
            preview : '/img/img_note_type_plain_text.jpg'
        },{
            type : 1,
            name : '选项列表',
            preview : '/img/img_note_type_selection.jpg'
        }],
        /** 下面是控制UI相关的变量 **/
        flag_dialog : 0,                // 是否正在显示对话框（对话框背景是否展示）
        flag_note_type : 0,             // 编辑笔记的类型
        /** 下面是控制数据相关的变量 **/
        note_editing : null,            // 当前正在编辑的笔记，如果为null则代表正在显示列表
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
        /** 显示创建分类对话框 **/
        show_create_category_dialog : function(category_model){
            const self = this
            self.flag_dialog = self.DIALOG_EDIT_CATEGORY
            // getElementByID
            let element_title = document.getElementById('dialog-category-create-title')
            let element_name = document.getElementById('dialog-category-create-name')
            let element_id = document.getElementById('dialog-category-create-id')
            let element_create_time = document.getElementById('dialog-category-create-create-time')
            let element_btn_cancel = document.getElementById('dialog-category-create-btn-cancel')
            let element_btn_confirm = document.getElementById('dialog-category-create-btn-confirm')
            let element_btn_delete = document.getElementById('dialog-category-create-btn-delete')
            // 初始化数据
            if(category_model === undefined || category_model === null){
                // 说明是创建分类
                element_title.innerText = '创建分类'
                element_name.value = ''
                element_id.innerText = '尚未创建'
                element_create_time.innerText = '尚未创建'
                element_btn_delete.style.display = 'none'
            }else{
                // 说明是编辑分类
                element_title.innerText = '编辑分类'
                element_name.value = category_model.name
                element_id.innerText = '#' + category_model.id
                element_create_time.innerText = category_model.create_time
                element_btn_delete.style.display = 'block'
            }
            // 按钮的点击事件
            element_btn_cancel.onclick = function () {
                self.flag_dialog = self.DIALOG_NONE
            }
            // 删除分类
            element_btn_delete.onclick = function () {
                self.show_message_dialog('删除分类', '你确定要删除"'+category_model.name+'"吗？此操作不可逆！',  async function () {
                    self.show_loading_dialog('正在删除分类', true)
                    let response = await post('/api/v1/category/delete', {
                        id : category_model.id
                    })
                    if (response.success){
                        self.show_success_dialog('分类 "'+category_model.name + '" 已删除', 2000)
                        await self.refresh_category_list()
                    }else{
                        self.show_fail_dialog('删除失败，' + response.message, 2000)
                    }
                }, function () {
                    self.close_dialog()
                })
            }
            // 创建/保存 分类
            element_btn_confirm.onclick = async function () {
                self.show_loading_dialog('正在创建分类', true)
                let category_name = element_name.value
                if(!category_name || category_name.length <= 0){
                    self.show_fail_dialog('分类名称不能为空！', 2000)
                }else{
                    let response = await post('/api/v1/category/add', {
                        name : category_name
                    })
                    if (response.success){
                        self.show_success_dialog('创建分类成功', 2000)
                        await self.refresh_category_list()
                    }else{
                        self.show_success_dialog('创建分类失败，' + response.message, 2000)
                    }
                }
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
            document.getElementById('dialog-loading-img').className = '' // 取消旋转动画
            self._show_loading_dialog('/icon/ic_success.png', content, dismiss_time)
        },
        /* 显示失败的对话框 */
        show_fail_dialog : function(content, dismiss_time){
            const self = this
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
        /* 按下了保存笔记按钮 */
        on_save_note_click : function () {
            const self = this
            self.note_editing = null
            switch (self.flag_note_type) {
                // 保存为 纯文本
                case self.NOTE_TYPE_PLAIN_TEXT:{
                    let element_title = document.getElementById('note-title')
                    let element_content = document.getElementById('note-text-plain-content')
                    let title_str = element_title.value
                    let content_str = element_content.value
                    self.show_fail_dialog('保存失败', 2000)
                    break
                }
                // 保存为 其他类型
                default : {
                    break;
                }
            }
        },
    },
})
