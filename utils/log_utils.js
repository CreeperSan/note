const moment = require('moment')

moment.locale('zh-cn')

function get_time_str(){
    return moment().format('YYYY-MM-DD HH:mm:ss:SSS')
}

module.exports = {

    // 启动日志
    boot : function (msg) {
        console.log('\x1B[37m%s\x1B[39m' ,get_time_str() + ' [ BOOT ] ' + msg)
    },

    // 一般日志
    i : function (msg) {
        console.log('\x1B[37m%s\x1B[39m' ,get_time_str() + ' [ INFO ] ' + msg)
    },

    // 警告日志
    w : function (msg) {
        console.log('\x1B[34m%s\x1B[39m' ,get_time_str() + ' [ WARMING ] ' + msg)
    },

    // 错误日志
    e : function (msg) {
        console.log('\x1B[31m%s\x1B[39m' ,get_time_str() + ' [ ERROR ] ' + msg)
    },

    // 成功日志
    s : function (msg) {
        console.log('\x1B[32m%s\x1B[39m' ,get_time_str() + ' [ SUCCESS ] ' + msg)
    },

    // 网络日志
    n : function (msg) {
        console.log('\x1B[33m%s\x1B[39m' ,get_time_str() + ' [ NETWORK ] ' + msg)
    },

    // 数据库日志
    database : function (msg) {
        console.log('\x1B[36m%s\x1B[39m' ,get_time_str() + ' [ DATABASE ] ' + msg)
    },

}