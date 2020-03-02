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
        tag_list : [],  // 对应的键有 id, name,
        category_list : [{
            id : 1,
            name : '分类1'
        },{
            id : 2,
            name : '分类2'
        }],
    },
    created : function(){
        const self = this
        // 获取所有标签
        this.refresh_tag_list()
        // 获取所有分类
        this.refresh_category_list()
    },
    methods : {
        refresh_tag_list : async function () {
            const self = this
            let response = await post('/api/v1/tag/list')
            console.log(response)
            if(response.success && response.data !== undefined && response.data.list !== undefined){
                let response_data_list = response.data.list
                let data_list = []
                for(let i=0; i<response_data_list.length; i++){
                    let item = response_data_list[i]
                    data_list.push({
                        id : item._id,
                        name : item.name
                    })
                }
                self.tag_list = data_list
                console.log('aaaaaaaaaaaaaaaaa')
                console.log(data_list)
                console.log('bbbbbbbbbbbbbbbbbb')
            }else{
                console.log('获取标签列表失败！请重试！')
            }
        },
        refresh_category_list : function () {

        }
    },
})
