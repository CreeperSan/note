module.exports = {

    /**
     * 组成插入数据的SQL语句
     * @param {string} table 表名
     * @param {json map} data 要插入的数据，
     */
    insert : function(connection, table, data){
        let query = 'INSERT INTO ' + table

        let data_array = []

        for(key in data){
            data_array.push([key, data[key]])
        }

        query = query + '('
        for(let i=0; i<data_array.length; i++){
            const key = data_array[i][0]
            query = query + key
            // 还存在下一个，则需要逗号
            if(i+1 < data_array.length){
                query = query + ','
            }
        }
        query = query + ')'

        query = query + ' VALUES '

        query = query + '('
        for(let i=0; i<data_array.length; i++){
            const key = data_array[i][1]
            // query = query + connection.escape(key)
            query = query + key
            // 还存在下一个，则需要逗号
            if(i+1 < data_array.length){
                query = query + ','
            }
        }
        query = query + ')'

        return query
    },

    /**
     * 组成删除数据的SQL语句
     * @param {*} table 表名
     * @param {*} where 条件
     */
    delete : function(connection, table, where){
        let query = 'DELETE FROM ' + table + ' WHERE '

        let data_array = []

        for(key in where){
            data_array.push([key, where[key]])
        }

        for(let i=0; i<data_array.length; i++){
            const key = data_array[i][0]
            const value = data_array[i][1]
            query = query + key + '=' + connection.escape(value)
            // 还存在下一个，则需要逗号
            if(i+1 < data_array.length){
                query = query + ' AND '
            }
        }

        return query
    },

    /**
     * 组成更新数据库的SQL语句
     * @param {*} table 表名
     * @param {*} data 数据
     * @param {*} condition 条件
     */
    update : function(connection, table, data, condition){
        let query = 'UPDATE ' + table + ' SET '

        let data_array = []
        let condition_array = []

        for(key in data){
            data_array.push([key, data[key]])
        }
        for(let i=0; i<data_array.length; i++){
            const key = data_array[i][0]
            const value = data_array[i][1]
            query = query + key + '=' + connection.escape(value)
            // 还存在下一个，则需要逗号
            if(i+1 < data_array.length){
                query = query + ','
            }
        }

        query = query + ' WHERE '

        for(key in condition){
            condition_array.push([key, condition[key]])
        }
        for(let i=0; i<condition_array.length; i++){
            const key = condition_array[i][0]
            const value = condition_array[i][1]
            query = query + key + '=' + value
            // 还存在下一个，则需要逗号
            if(i+1 < condition_array.length){
                query = query + ' AND '
            }
        }

        return query
    },

    
    query : function(connection, table, page, page_count, query_keys, condition, orderby, isOrder){
        let query = 'SELECT '

        // 要查询的所有字段
        if(query_keys===null || query_keys===undefined || query_keys.length===0){
            query = query + '*'
        }else if(typeof query_keys === 'string'){
            query = query + query_keys
        }else{
            for(let i=0; i<query_keys.length; i++){
                query = query + query_keys[i]
                if(i < query_keys.length-1){
                    query = query + ','
                }
            }
        }
        // 指定表
        query = query + ' FROM ' + table
        // 指定条件
        query = query + ' WHERE '
        let condition_array = []
        for(key in condition){
            condition_array.push([key, condition[key]])
        }
        for(let i=0; i<condition_array.length; i++){
            const key = condition_array[i][0]
            const value = condition_array[i][1]
            query = query + key + '=' + connection.escape(value)
            // 还存在下一个，则需要逗号
            if(i+1 < condition_array.length){
                query = query + ' AND '
            }
        }
        // 指定排序依据
        query = query + ' ORDER BY ' + orderby
        // 指定排序方式
        if(isOrder){
            query = query + ' ASC'
        }else{
            query = query + ' DESC'
        }
        // 分页
        query = query +  ' LIMIT '
        let itemIndex = page * page_count
        query = query + itemIndex.toString() + ',' + (itemIndex + page_count).toString()
        // 返回结果
        return query
    }
    

}