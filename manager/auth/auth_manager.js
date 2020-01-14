// LruCache， Key為UserID, Value為登錄ID
// 记住键值都为字符串！这个是区分类型的！
function AuthManager(){
    const LurCache = require('lru-cache')
    const UUID = require('uuid')

    const KEYS = 'keys' // 數組
    const AUTH_TIME = 'auth_time'

    const AUTH_TIMEOUT = 1000*60*60*24*7
    const MAX_AUTH_COUNT = 3 // 最多同時在綫數量

    let auth_cache = new LurCache(1024)

    return {
        is_auth : function(userID, key){
            userID = userID.toString()
            key = key.toString()
            if(auth_cache.has(userID)){
                let current_time = new Date().getTime()
                let auth_user_info = auth_cache.get(userID)
                // 循環所有Key進行比對
                for(let i in auth_user_info){
                    let auth_item = auth_user_info[i]
                    let auth_item_key = auth_item[KEYS]
                    let auth_item_time = auth_item[AUTH_TIME]
                    if(auth_item_key === key && typeof auth_item_time === 'number' && current_time - auth_item_time < AUTH_TIMEOUT){
                        // 更新時間
                        auth_item[AUTH_TIME] = current_time
                        auth_cache.set(userID, auth_user_info)
                        return true
                    }
                }
                return false
            }else{
                return false
            }
        },

        add_auth : function(userID){
            userID = userID.toString()
            const key = UUID.v1().toString()
            const current_time = new Date().getTime()
            if(auth_cache.has(userID)){
                // 已存在，想增加新的登錄Key
                let auth_user_info = auth_cache.get(userID)
                if(auth_user_info.length - 1 >= MAX_AUTH_COUNT){ // 如果超過最大允許登錄的Key限制數量，則刪掉一個
                    auth_user_info.pop()
                }
                let auth_item_data = {}
                auth_item_data[KEYS] = key
                auth_item_data[AUTH_TIME] = current_time
                auth_user_info.push(auth_item_data)
                auth_cache.set(userID, auth_user_info)
            }else{
                // 不存在，創建并且寫入這個Key
                let auth_item = []
                let auth_item_data = {}
                auth_item_data[KEYS] = key
                auth_item_data[AUTH_TIME] = current_time
                auth_item.push(auth_item_data)
                auth_cache.set(userID, auth_item)
            }
            return key
        },

        print : function () {
            let data = []
            for(let i=0; i<auth_cache.length; i++){
                let user_id = auth_cache.keys()[i]
                data.push({
                    id : user_id,
                    keys : auth_cache.get(user_id)
                })
            }
            return data
        }
    }
}

module.exports = exports = new AuthManager()