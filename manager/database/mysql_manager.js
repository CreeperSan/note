const mysql = require("mysql")
const config_manager = require('../config_manager')
const log = require('../../utils/log_utils')
const user_manager = require('./user_manager')
const note_manager = require('./note_manager')
const category_manager = require('./category_manager')
const tag_manager = require('./tag_manager')
const tag_note_manager = require('./tag_note_manager')
const category_note_manager = require('./category_note_manager')

let database = null

function _init_databases(database){
    database.query('create database if not exists ' + config_manager.get_server_database_name() + ';')
    log.boot('初始化数据库')
    database.query('use ' + config_manager.get_server_database_name() + ';')
}

function _init_tables(database){
    // 检查并初始化数据库表
    user_manager.init_table(database)
    tag_manager.init_table(database)
    category_manager.init_table(database)
    note_manager.init_table(database)
    tag_note_manager.init_table(database)
    category_note_manager.init_table(database)
    // 设置时区
    log.database("正在设置时区为 +8:00")
    database.query("set time_zone = '+8:00';")
}

module.exports = {

    init : function () {
        log.boot('正在初始化数据库...')
        // 断开已有链接
        if (database){
            log.boot('数据库连接已存在, 正在断开连接')
            database.end((err) => {
                if (err){
                    log.boot('数据库连接断开成功')
                }else{
                    log.w('数据库连接断开失败!')
                }
            })
            database = null
        }
        // 建立连接
        log.boot('正在连接至数据库 ' + config_manager.get_server_database_name() + '  ' + config_manager.get_server_database_username() + '@' + config_manager.get_server_database_host())
        database = mysql.createConnection({
            // database : config_manager.get_server_database_name(), // 放在后面指定
            host : config_manager.get_server_database_host(),
            user : config_manager.get_server_database_username(),
            password : config_manager.get_server_database_password(),
        })
        database.connect({}, (err) => {
            if (err){
                log.e('数据库连接失败')
                log.e(err)
                throw err
            }else{
                log.boot('数据库连接成功')
                _init_databases(database)
                _init_tables(database)
            }
        })
        // 出错重连
        database.on('error', (err) => {
            switch (err.code) {
                // 如果连接丢失, 则重新连接
                case 'PROTOCOL_CONNECTION_LOST' : {
                    log.database('数据库连接闲置超时自动断开, 正在重新连接')
                    this.init()
                    break
                }
                // UNIQUE约束的键插入的相同的内容
                case 'ER_DUP_ENTRY' : {
                    log.w(err)
                    log.w('数据库更改数据错误, 对应的值已经存在')
                    break
                }
                // 抛异常
                default : {
                    log.e('数据库发生意料之外的异常, 连接断开')
                    log.e(err)
                    throw err
                }
            }
        })
    },

}
