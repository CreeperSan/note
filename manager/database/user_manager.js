// DATABASE_USER
// TABLE : user
// id, username, nickname, create_time, password, email, avatar, infos

const mysql = require('./mysql_manager')
const log = require('../../utils/log_utils')

let sql = null

const KEY_DATABASE = "users"

const KEY_ID = "_id"
const KEY_PASSWORD = "password"
const KEY_CREATE_TIME = "create_time"
const KEY_NICKNAME = "nickname"
const KEY_EMAIL = "email"
const KEY_AVATAR = "avatar"
const KEY_INFOS = "infos"

module.exports = {

    init_table : function(database){
        log.database('正在初始化数据库用户表')
        if (!database){
            log.e('数据库尚未连接, 正在退出')
            process.exit(0)
            return
        }
        sql = database
        // 初始化数据库表
        let sql_query = 'CREATE TABLE IF NOT EXISTS ' + KEY_DATABASE + '(' +
            KEY_ID + ' INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
            KEY_EMAIL + ' VARCHAR(128) NOT NULL UNIQUE, ' +
            KEY_PASSWORD + ' VARCHAR(64) NOT NULL, ' +
            KEY_CREATE_TIME + ' DATETIME NOT NULL, ' +
            KEY_NICKNAME + ' VARCHAR(64), ' +
            KEY_AVATAR + ' VARCHAR(256), ' +
            KEY_INFOS + ' TEXT' +
            ') DEFAULT CHARSET=utf8'

        log.database(sql_query)
        sql.query(sql_query)

    },

    add_user : function (email, password, nickname) {
        // 检查邮箱是否已被占用

        // 添加用户
        let sql_query = 'INSERT INTO ' + KEY_DATABASE + ' (' +
            KEY_EMAIL + ',' +
            KEY_PASSWORD + ',' +
            KEY_CREATE_TIME + ',' +
            KEY_NICKNAME +
            ') VALUES (' +
            '\'' + email + '\',' +
            '\' ****** \',' +
            'NOW(),' +
            '\'' + nickname + '\'' +
            ')'

        log.database('添加用户 ' + email)
        log.database(sql_query)

        sql.query(sql_query)
    },

}