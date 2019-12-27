// DATABASE_TAG
// TABLE : tag
// id, user_id, name, create_time, extra

const mysql = require('./mysql_manager')
const log = require('../../utils/log_utils')
const user_manager = require('./user_manager')

module.exports = {
    TABLE_NAME              : 'tag',
    KEY_ID                  : '_id',
    KEY_USER_ID             : 'user_id',
    KEY_NAME                : 'name',
    KEY_CREATE_TIME         : 'create_time',
    KEY_EXTRA               : 'extra',

    init_table : function (database) {
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

        log.database(sql_query)

        database.query(sql_query)
    },

}