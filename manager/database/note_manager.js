// DATABASE_NOTE
// TABLE : note
// id, user_id, create_time, modify_time, type, data, extra

const mysql = require('./mysql_manager')
const log = require('../../utils/log_utils')
const user_manager = require('./user_manager')
const sql_utils = require('./../../utils/sql_utils')
const params_util = require('./../../utils/param_utils')

module.exports = {
    TABLE_NAME          : 'note',
    KEY_ID              : '_id',
    KEY_USER_ID         : 'user_id',
    KEY_CREATE_TIME     : 'create_time',
    KEY_MODIFY_TIME     : 'modify_time',
    KEY_TYPE            : 'type',
    KEY_DATA            : 'data',
    KEY_EXTRA           : 'extra',
    KEY_TITLE           : 'title',
    KEY_ARCHIVE         : 'archive',        // 归档
    KEY_PINNED          : 'pinned',         // 置顶
    TYPE_PLAIN_TEXT     : 1,

    init_table : async function (database) {
        return new Promise((resolve, reject) => {
            log.database("正在初始化笔记表")
            if(!database){
                log.e("数据库尚未连接, 正在退出")
                process.exit(0)
            }

            // 初始化表
            let sql_query = "CREATE TABLE IF NOT EXISTS " + this.TABLE_NAME + "(" +
                this.KEY_ID + " INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT ," +
                this.KEY_USER_ID + " INTEGER UNSIGNED NOT NULL ," +
                this.KEY_TITLE + ' TEXT,' +
                this.KEY_ARCHIVE + ' BOOLEAN NOT NULL DEFAULT FALSE ,' +
                this.KEY_PINNED + ' BOOLEAN NOT NULL DEFAULT FALSE ,' +
                this.KEY_CREATE_TIME +  " DATETIME NOT NULL ," +
                this.KEY_MODIFY_TIME +  " DATETIME NOT NULL ," +
                this.KEY_TYPE + " INTEGER NOT NULL ," +
                this.KEY_DATA + " TEXT NOT NULL ," +
                this.KEY_EXTRA + " TEXT, " +
                "foreign key(" + this.KEY_USER_ID + ") references " + user_manager.TABLE_NAME + "(" + user_manager.KEY_ID + ")"  +
                ") DEFAULT CHARSET=utf8"

            database.query(sql_query, function(err, result){
                if(err){
                    log.database('初始化 笔记 数据库失败')
                    log.database(sql_query)
                    reject()
                }else{
                    resolve()
                }
            })
        })
    },

    add_note : function (user_id, type, title, data) {
        return new Promise(((resolve, reject) => {
            const connection = mysql.get_database_connection()

            let condition = {}

            condition[this.KEY_USER_ID] = connection.escape(user_id)
            condition[this.KEY_TITLE] = connection.escape(params_util.isEmpty(title) ? '' : title)
            condition[this.KEY_TYPE] = type
            condition[this.KEY_DATA] = connection.escape(data)
            condition[this.KEY_ARCHIVE] = false
            condition[this.KEY_PINNED] = false
            condition[this.KEY_CREATE_TIME] = 'NOW()'
            condition[this.KEY_MODIFY_TIME] = 'NOW()'

            let extra = {}
            condition[this.KEY_EXTRA] = connection.escape(JSON.stringify(extra))

            const sql_query = sql_utils.insert(connection, this.TABLE_NAME, condition)
            connection.query(sql_query, function (err, result) {
                if (err){
                    reject(false)
                }else{
                    resolve(true)
                }
            })
        }))
    },

    edit_note : function () {

    },

    query_note : async function (user_id, tag_id, category_id, keyword) {
        return new Promise((resolve, reject) => {
            const connection = mysql.get_database_connection()
            const condition_obj = {}
            condition_obj[this.KEY_USER_ID] = user_id
            if (!params_util.isEmpty(tag_id)){
                condition_obj[this.KEY_TAG_ID] = user_id
            }
            if (!params_util.isEmpty(category_id)){
                condition_obj[this.KEY_CATEGORY_ID] = category_id
            }
            const sql_query = sql_utils.query(connection, this.TABLE_NAME, 0, 100, null, condition_obj, this.KEY_MODIFY_TIME, true)
            connection.query(sql_query, function (err, result) {
                if(err){
                    reject(false)
                }else{
                    resolve(result)
                }
            })
        })
    }

}