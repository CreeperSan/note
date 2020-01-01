module.exports = {

    /**
     * 组成插入数据的SQL语句
     * @param {string} table 表名
     * @param {json map} data 要插入的数据，
     */
    insert : function(table, data){
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
    delete : function(table, where){
        let query = 'DELETE FROM ' + table + ' WHERE '

        let data_array = []

        for(key in where){
            data_array.push([key, where[key]])
        }

        for(let i=0; i<data_array.length; i++){
            const key = data_array[i][0]
            const value = data_array[i][1]
            query = query + key + '=' + value
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
    update : function(table, data, condition){
        let query = 'UPDATE ' + table + ' SET '

        let data_array = []
        let condition_array = []

        for(key in data){
            data_array.push([key, data[key]])
        }
        for(let i=0; i<data_array.length; i++){
            const key = data_array[i][0]
            const value = data_array[i][1]
            query = query + key + '=' + value
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
    }

    

}