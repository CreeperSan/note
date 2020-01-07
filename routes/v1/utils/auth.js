const UUID = require('uuid/v4')
const LruCache = require('lru-cache')

const cache = LruCache({
    max : 1024,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    dispose: function (key, n) { 
        n.close() 
    }
})

const verify_map = {
    'test_key' : {
        user_id : '1',
        last_used_time : new Date().getTime()
    }
}

module.exports = {

    verify : function(email, password, user_manager){
        
    },

    verify : function(key){

    }

}