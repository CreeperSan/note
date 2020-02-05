// DATABASE_TAG
// TABLE : tag
// id, user_id, name, create_time, extra
//
// extra :  bg:背景颜色
//          ft:前景颜色

const mysql = require('./mysql_manager')
const log = require('../../utils/log_utils')
const user_manager = require('./user_manager')
const sql_utils = require('./../../utils/sql_utils')

module.exports = {
    TABLE_NAME              : 'tag',
    KEY_ID                  : '_id',
    KEY_USER_ID             : 'user_id',
    KEY_NAME                : 'name',
    KEY_CREATE_TIME         : 'create_time',
    KEY_EXTRA               : 'extra',
    EXTRA_BG                : 'bg',
    EXTRA_FT                : 'ft',

    init_table : async function (database) {
        return new Promise((resolve, reject) => {
            log.database("正在初始化标签表")
            if(!database){
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
    
            database.query(sql_query, function(err, result){
                log.database('err')
                log.database(JSON.stringify(err))
                log.database('result')
                log.database(JSON.stringify(result))
                if(err){
                    log.e('初始化 标签 数据库失败')
                    log.e(sql_query)
                    reject()
                }else{
                    resolve()
                }
            })
        })
    },

    query_tags : async function(user_id){
        return new Promise((resolve, reject) => {
            const connection = mysql.get_database_connection()
            const condition_obj = {}
            condition_obj[this.KEY_USER_ID] = user_id
            const sql_query = sql_utils.query(connection, this.TABLE_NAME, 0, 100, null, condition_obj, this.KEY_ID, true)
            log.i(sql_query)
            connection.query(sql_query, function (err, result) {
                if(err){
                    log.e('查询标签列表失败')
                    log.e(sql_query)
                    reject()
                }else{
                    resolve(result)
                }
            })
        })
    },

    delete_tag : async function(user_id, tag_id){
        return new Promise((resolve, reject) => {
            const connection = mysql.get_database_connection()
            let condition = {}
            condition[this.KEY_USER_ID] = user_id
            condition[this.KEY_ID] = tag_id
            const sql_query = sql_utils.delete(connection, this.TABLE_NAME, condition)
            connection.query(sql_query, function (err, result) {
                if(err){
                    log.e('删除标签失败')
                    log.e(sql_query)
                    reject()
                }else{
                    resolve(true)
                }
            })
        })
    },

    add_tags : async function(user_id, tag_name, bg_color, text_color){
        return new Promise((resolve, reject) => {
            const connection = mysql.get_database_connection()
            let condition = {}
            condition[this.KEY_USER_ID] = user_id
            condition[this.KEY_NAME] = connection.escape(tag_name)
            condition[this.KEY_CREATE_TIME] = 'NOW()'
            let extra = {}
            extra[this.EXTRA_BG] = bg_color
            extra[this.EXTRA_FT] = text_color
            condition[this.KEY_EXTRA] = connection.escape(JSON.stringify(extra))
            const sql_query = sql_utils.insert(connection, this.TABLE_NAME, condition)
            connection.query(sql_query, function (err, result) {
                if(err){
                    resolve(false)
                }else{
                    resolve(true)
                }
            })
        })
    },

}