// DATABASE_CATEGORY
// TABLE : category
// id, name, create_time, extra

const mysql_manager = require('./mysql_manager')
const log = require('../../utils/log_utils')
const user_manager = require('./user_manager')
const sql_utils = require('../../utils/sql_utils')

module.exports = {
    TABLE_NAME      : 'category',
    KEY_ID          : '_id',
    KEY_USER_ID     : 'user_id',
    KEY_NAME        : 'name',
    KEY_CREATE_TIME : 'create_time',
    KEY_EXTRA       : 'extra',

    init_table : async function (connection) {
        return new Promise((resolve, reject) => {
            log.database("正在初始化分类表")
            if(!connection){
                log.e("数据库尚未连接, 正在退出")
                process.exit(0)
            }
            // 初始化表
            let sql_query = "CREATE TABLE IF NOT EXISTS " + this.TABLE_NAME + "(" +
                this.KEY_ID + " INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT ," +
                this.KEY_USER_ID + " INTEGER UNSIGNED NOT NULL ," +
                this.KEY_NAME + " VARCHAR(32) NOT NULL ," +
                this.KEY_CREATE_TIME +  " DATETIME NOT NULL ," +
                this.KEY_EXTRA + " TEXT, " +
                "foreign key(" + this.KEY_USER_ID + ") references " + user_manager.TABLE_NAME + "(" + user_manager.KEY_ID + ")"  +
                ") DEFAULT CHARSET=utf8"
    
            connection.query(sql_query, function(err, result){
                if(err){
                    log.database('初始化 分类 数据库失败')
                    log.database(sql_query)
                    reject()
                }else{
                    resolve()
                }
            })
        })

    },

    /**
     * TODO : 需要验证是否此用户
     * @param {string} user_id 用户ID 
     * @param {string} name 标签名称 
     * @param {string} text_color 文字颜色 #ff66ccff 
     * @param {string} background_color 背景颜色 #ff66ccff
     */
    create_category : async function(user_id, name, text_color, background_color){
        return new Promise((resolve, reject) => {
            const connection = mysql_manager.get_database_connection()

            log.database('添加标签 uid:'+user_id+'  name:'+name)

            user_id = user_id.toString()
            name = name.toString()
            text_color = text_color.toString()
            background_color = background_color.toString()

            let extra_info = {
                'text_color' : text_color,
                'background_color' : background_color
            }

            let data = {}
            data[this.KEY_USER_ID] = '\'' + user_id + '\''
            data[this.KEY_NAME] = '\'' + name + '\''
            data[this.KEY_CREATE_TIME] = 'NOW()'
            data[this.KEY_EXTRA] = JSON.stringify(extra_info)
            let sql_query = sql_utils.insert(connection, this.TABLE_NAME, data)

            connection.query(sql_query, function(err, result){
                if(err){
                    log.e("添加标签失败")
                    log.e(sql_query)
                    reject(err)
                }else{
                    resolve()
                }
            })
        })
    },

    /**
     * 删除分类
     * @param {int} user_id 用户的id
     * @param {int} _id 要删除的标签id
     */
    delete_category : async function(user_id, _id){
        return new Promise((resolve, reject) => {
            const connection = mysql_manager.get_database_connection()

            log.database('删除分类')

            let condition = {}
            condition[this.KEY_ID] = _id
            condition[this.KEY_USER_ID] = user_id
            let sql_query = sql_utils.delete(connection, this.TABLE_NAME, condition)

            connection.query(sql_query, function(err, result){
                if(err){
                    log.e('删除分类失败')
                    log.e(sql_query)
                    reject()
                }else{
                    resolve()
                }
            })
        })

    },

    /**
     * 修改标签
     * @param {id} user_id 
     * @param {*} _id 
     * @param {*} name 
     * @param {*} text_color 
     * @param {*} background_color 
     */
    modify_category : async function(user_id, _id, name, text_color, background_color){
        return new Promise((resolve, reject) => {
            const connection = mysql_manager.get_database_connection()

            log.database('修改标签')
        
            let data = {}
            data[this.KEY_NAME] = name
            let condition = {}
            condition[this.KEY_USER_ID] = user_id
            condition[this.KEY_ID] = _id
            let sql_query = sql_utils.update(connection, this.TABLE_NAME, data, condition)

            connection.query(sql_query, function(err, result){
                if(err){
                    log.e('更新分类失败')
                    log.e(sql_query)
                    reject()
                }else{
                    resolve()
                }
            })
        })

    },

    query : async function(page, count){
        return new Promise((resolve, reject) => {
            const connection = mysql_manager.get_database_connection()
            resolve()
        })

    }



}