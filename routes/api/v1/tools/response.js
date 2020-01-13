module.exports = {

    response : function(code, message, data){
        const response_data = {
            'code' : code,
            'message' : message
        }

        if(data != null && data != undefined && data != ''){
            response_data.data = data
        }

        return JSON.stringify(response_data)
    },

    success : function(data){
        return this.response(200, '操作成功', data)
    },

    request_error : function(message){
        return this.response(400, message)
    },
    
    auth_error : function(message){
        return this.response(401, message)
    },

    forbidden_error : function(message){
        return this.response(403, message)
    },

    not_found_error : function(message){
        return this.response(404, message)
    },

    server_error : function(message){
        return this.response(500, message)
    },

    server_maintaining_error : function(message){
        return this.response(503, message)
    }

}

