// DATABASE_USER
// TABLE : user
// id, username, nickname, create_time, password, email, avatar, infos

const mysql = require('./mysql_manager')
const log = require('../../utils/log_utils')
const sql_utils = require('./../../utils/sql_utils')
const param_utils = require('./../../utils/param_utils')

let sql = null

module.exports = {
    TABLE_NAME          : 'users',
    KEY_ID              : "_id",
    KEY_PASSWORD        : "password",
    KEY_CREATE_TIME     : "create_time",
    KEY_NICKNAME        : "nickname",
    KEY_EMAIL           : "email",
    KEY_AVATAR          : "avatar",
    KEY_STATE           : "state", // 状态, 是否启用/禁用
    KEY_TYPE            : "type", // 身份, 是否管理员
    KEY_INFOS           : "infos",

    init_table : async function(database){
        return new Promise((resolve, reject) => {
            log.database('正在初始化数据库用户表')
            if (!database){
                log.e('数据库尚未连接, 正在退出')
                process.exit(0)
                return
            }
            sql = database
            // 初始化数据库表
            let sql_query = 'CREATE TABLE IF NOT EXISTS ' + this.TABLE_NAME + '(' +
                this.KEY_ID + ' INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
                this.KEY_EMAIL + ' VARCHAR(128) NOT NULL UNIQUE, ' +
                this.KEY_PASSWORD + ' VARCHAR(64) NOT NULL, ' +
                this.KEY_CREATE_TIME + ' DATETIME NOT NULL, ' +
                this.KEY_NICKNAME + ' VARCHAR(64), ' +
                this.KEY_AVATAR + ' VARCHAR(256), ' +
                this.KEY_STATE + ' INTEGER NOT NULL DEFAULT 0, ' +
                this.KEY_TYPE + ' INTEGER NOT NULL DEFAULT 0, ' +
                this.KEY_INFOS + ' TEXT' +
                ') DEFAULT CHARSET=utf8'

            sql.query(sql_query, function(err, result){
                if(err){
                    log.database('初始化 用户 数据库失败')
                    log.database(sql_query)
                    reject()
                }else{
                    resolve()
                }
            })
        })

    },

    add_user : function (email, password, nickname) {
        // 添加用户
        let sql_query = 'INSERT INTO ' + this.TABLE_NAME + ' (' +
            this.KEY_EMAIL + ',' +
            this.KEY_PASSWORD + ',' +
            this.KEY_CREATE_TIME + ',' +
            this.KEY_NICKNAME +
            ') VALUES (' +
            '\'' + email + '\',' +
            '\'' + password + '\',' +
            'NOW(),' +
            '\'' + nickname + '\'' +
            ')'

        log.database('添加用户 ' + email)

        sql.query(sql_query, function(err, result){
            if(err){
                log.e('添加用户失败')
                log.e(sql_query)
            }
        })
    },

    query_user : function(email, password){
        const condition = {}
        if(param_utils.isEmpty(email)){
            log.e('email为空')
            return []
        }
        if(param_utils.isEmpty(password)){
            log.e('password为空')
            return []
        }
        condition[this.KEY_EMAIL] = email
        condition[this.KEY_PASSWORD] = password
        const sql_query = sql_utils.query(sql, this.TABLE_NAME, 0, 1,'*', condition, this.KEY_ID, false)
        
        log.database(sql_query)

        sql.query(sql_query, function(err, result){
            if(err){
                log.e('查找用户失败')
                log.e(sql_query)
            }else{
                log.database(JSON.stringify(result))
            }
        })
    }

}