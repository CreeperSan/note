// DATABASE_TAG_NOTE
// TABLE : tag_note
// _id, tag_id, note_id

const mysql = require('./mysql_manager')
const log = require('../../utils/log_utils')
const tag_manager = require('./tag_manager')
const note_manager = require('./note_manager')

module.exports = {
    TABLE_NAME              : 'tag_note',
    KEY_ID                  : '_id',
    KEY_TAG_ID              : 'tag_id',
    KEY_NOTE_ID             : 'note_id',

    init_table : async function (database) {
        return new Promise((resolve, reject) => {
            log.database("正在初始化标签-笔记表")
            if(!database){
                log.e("数据库尚未连接, 正在退出")
                process.exit(0)
            }
            // 初始化表
            let sql_query = "CREATE TABLE IF NOT EXISTS " + this.TABLE_NAME + "(" +
                this.KEY_ID + " INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, " +
                this.KEY_TAG_ID + " INTEGER UNSIGNED NOT NULL, " +
                this.KEY_NOTE_ID + " INTEGER UNSIGNED NOT NULL, " +
                "foreign key(" + this.KEY_TAG_ID + ") references " + tag_manager.TABLE_NAME + "(" + tag_manager.KEY_ID + "), "  +
                "foreign key(" + this.KEY_NOTE_ID + ") references " + note_manager.TABLE_NAME + "(" + note_manager.KEY_ID + ")"  +
                ") DEFAULT CHARSET=utf8"
    
            database.query(sql_query, function(err, result){
                if(err){
                    log.database('初始化 标签-笔记 数据库失败')
                    log.database(sql_query)
                    reject()
                }else{
                    resolve()
                }
            })
        })
    },

}