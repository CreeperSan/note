// DATABASE_TAG_NOTE
// TABLE : tag_note
// _id, tag_id, note_id

const mysql = require('./mysql_manager')
const log = require('../../utils/log_utils')

const key_database = "tag_note"

const key_id = "_id"
const key_tag_id = "tag_id"
const key_note_id = "note_id"

module.exports = {

    init_table : function (database) {
        log.database("正在初始化标签-笔记表")
        if(!database){
            log.e("数据库尚未连接, 正在退出")
            process.exit(0)
        }
        // 初始化表
        let sql_query = "CREATE TABLE IF NOT EXISTS " + key_database + "(" +
            key_id + " INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT ," +
            key_tag_id + " INTEGER UNSIGNED NOT NULL ," +
            key_note_id + " INTEGER UNSIGNED NOT NULL" +
            ")"

        log.database(sql_query)

        database.query(sql_query)
    },

}