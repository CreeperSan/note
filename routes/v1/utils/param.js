module.exports = {

    isNull : function(value){
        return value === null || value === undefined
    },

    isEmpty : function(value){
        return self.isNull() || value === ''
    },

    getOrDefault : function(value, default_value){
        if(this.isNull(value)){
            return default_value
        }else{
            return value
        }
    },

    hasKey : function(obj, key){
        if(this.isNull(obj[key])){
            return false
        }else{
            return true
        }
    }

}