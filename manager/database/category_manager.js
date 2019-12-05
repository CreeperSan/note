// DATABASE_CATEGORY
// TABLE : category
// id, name, create_time, extra

const mysql = require('./mysql_manager')
const log = require('../../utils/log_utils')

const key_database = "category"

const key_id = "_id"
const key_user_id = "user_id"
const key_name = "name"
const key_create_time = "create_time"
const key_extra = "extra"

module.exports = {

    init_table : function (database) {
        log.database("正在初始化分类表")
        if(!database){
            log.e("数据库尚未连接, 正在退出")
            process.exit(0)
        }
        // 初始化表
        let sql_query = "CREATE TABLE IF NOT EXISTS " + key_database + "(" +
            key_id + " INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT ," +
            key_user_id + " INTEGER NOT NULL ," +
            key_name + " VARCHAR(32) NOT NULL ," +
            key_create_time +  " DATETIME NOT NULL ," +
            key_extra + " TEXT" +
            ")"

        log.database(sql_query)

        database.query(sql_query)
    }

}