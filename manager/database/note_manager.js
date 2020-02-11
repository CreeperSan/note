// DATABASE_NOTE
// TABLE : note
// id, user_id, create_time, modify_time, type, data, extra

const mysql = require('./mysql_manager')
const log = require('../../utils/log_utils')
const user_manager = require('./user_manager')

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
    }

}