////////////////////////////////////////////////////
//  引用到 request.js
////////////////////////////////////////////////////

/**
 *  获取分类信息部分
 */
async function getTagList() {
   return await post('/api/v1/tag/list', null)
}

async function deleteTag(tagID){
    return await post('/api/v1/tag/delete', {
        tag_id : tagID
    })
}

/**
 *  获取标签信息部分
 */
async function getCategory() {
    return await post('/api/v1/category/list')
}

async function deleteCategory(categoryID) {
    return post('/api/v1/category/delete', {
        id : categoryID
    })
}


/**
 *  获取笔记信息部分
 */


/**
 *  UI部分
 */

// 下面是UI模板


// 下面是UI界面的处理

function clearTagList() {
    document.getElementById('tag-div').innerHTML = ''
}

function clearCategoryList() {
    document.getElementById('category-div').innerHTML = ''
}

function createTagDiv() {
    let element = document.querySelector('#category-item')
    return element.content.cloneNode(true)
}

function _showDialogBackgroundDiv() {
    document.getElementById('dialog-div').style.display = 'flex'
}

function _hideDialogBackgroundDiv() {
    document.getElementById('dialog-div').style.display = 'none'
}

function showCreateCategoryDialog() {
    _showDialogBackgroundDiv()
    document.getElementById('dialog-div').append(
        stringTemplateToHtml(templateDialogCreateCategory({

        }))
    )
}

/**
 *  通用处理函数
 */
function stringTemplateToHtml(htmlString) {
    return new DOMParser().parseFromString(htmlString,'text/html').body.childNodes[0]
}
