module.exports = {

    isNull : function(value){
        return value === null || value === undefined
    },

    isNotNull : function(value){
        return !this.isNull(value)
    },

    isEmpty : function(value){
        return this.isNull(value) || value === ''
    },

    isNotEmpty : function(value){
        return !this.isEmpty(value)
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
    },

}