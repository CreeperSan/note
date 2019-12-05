const fs = require('fs')
const log = require('../utils/log_utils')

const PATH_ROOT = 'config'
const PATH_SERVER = 'config/server.json'
const PATH_APP = 'config/app.json'

let config_app = {}
let config_server = {}

function _get_config(config, key, default_value){
    if (key in config){
        return config[key]
    }
    return default_value
}

function _set_config(config, key, value){
    config[key] = value
}

module.exports = {

    init : function () {
        log.boot('正在初始化配置...')
        // 检查目录
        if (!fs.existsSync(PATH_ROOT)){
            fs.mkdirSync(PATH_ROOT)
        }
        let root_stat = fs.statSync(PATH_ROOT)
        if (root_stat.isFile()){
            log.e('初始化配置失败, 配置目录不是一个文件夹')
            return false
        }
        // 检查文件
        if (!fs.existsSync(PATH_APP)){
            log.boot("应用配置不存在, 正在创建")
            fs.writeFileSync(PATH_APP, "{}")
        }else{
            config_app = JSON.parse(fs.readFileSync(PATH_APP).toString())
            log.boot("已加载应用配置")
        }
        if (!fs.existsSync(PATH_SERVER)){
            log.boot("服务配置不存在, 正在创建")
            fs.writeFileSync(PATH_SERVER, "{}")
        }else{
            config_server = JSON.parse(fs.readFileSync(PATH_SERVER).toString())
            log.boot("已加载服务配置")
        }
        return true
    },

    // 应用相关配置

    // 服务相关配置
    get_server_port : function () {
        return _get_config(config_server, 'port', 3000)
    },
    set_server_port : function (port) {
        _set_config(config_server, 'port', port)
    },
    get_server_database_name : function () {
        return _get_config(config_server, 'database_name', 'undefined')
    },
    set_server_database_name : function (database_name) {
        return _set_config(config_server, 'database_name', database_name)
    },
    get_server_database_username : function () {
        return _get_config(config_server, 'database_username', 'undefined')
    },
    set_server_database_username : function (database_name) {
        return _set_config(config_server, 'database_username', database_name)
    },
    get_server_database_password : function () {
        return _get_config(config_server, 'database_password', 'undefined')
    },
    set_server_database_password : function (database_name) {
        return _set_config(config_server, 'database_password', database_name)
    },
    get_server_database_host : function () {
        return _get_config(config_server, 'database_host', 'undefined')
    },
    set_server_database_host : function (database_name) {
        return _set_config(config_server, 'database_host', database_name)
    },

    save_server_config : function () {
        fs.writeFileSync(PATH_SERVER, JSON.stringify(config_server))
    },
    save_app_config : function () {
        fs.writeFileSync(PATH_APP, JSON.stringify(config_app))
    },
}
