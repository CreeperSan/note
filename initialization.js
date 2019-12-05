const readline = require('readline-sync')
const config_manager = require('./manager/config_manager')

function log(msg){
    console.log(msg)
}

function action_main(){
    log('                                   ')
    log('==========   Note初始化   ==========')
    log('                                   ')
    log('输入 1 初始化服务配置')
    log('输入 2 初始化应用配置')
    log('输入其他退出配置')
    let action = readline.question('输入您想要的操作 : ')
    switch(action){
        case '1' : {
            action_server()
            break;
        }
        case '2' : {
            action_app()
            break
        }
        default : {
            log('Bye  :)')
            process.exit(0)
            break
        }
    }
}

function action_server(){
    log('· 服务配置初始化')

    let tmp_port = readline.question('1. 请输入端口号( ' + config_manager.get_server_port() +' ) : ')
    if('' !== tmp_port){
        config_manager.set_server_port(tmp_port)
    }

    let tmp_address = readline.question('2. 请输入服务器地址( ' + config_manager.get_server_database_host() +' ) : ')
    if('' !== tmp_address){
        config_manager.set_server_database_host(tmp_address)
    }

    let tmp_name = readline.question('3. 请输入数据库名称( ' + config_manager.get_server_database_name() +' ) : ')
    if('' !== tmp_name){
        config_manager.set_server_database_name(tmp_name)
    }

    let tmp_username = readline.question('4. 请输入数据库用户名( ' + config_manager.get_server_database_username() +' ) : ')
    if('' !== tmp_username){
        config_manager.set_server_database_username(tmp_username)
    }

    let tmp_password = readline.question('5. 请输入数据库密码 : ')
    if('' !== tmp_password){
        config_manager.set_server_database_password(tmp_password)
    }

    config_manager.save_server_config()
    log('服务配置完成')
    action_main()
}

function action_app(){
    log('· 应用配置初始化')
    log('暂无设置可配置')
    log('应用配置完成')
    action_main()
}



log('正在加载当前配置...')
if(!config_manager.init()){
    log('配置文件出错, 请检查您的配置文件')
    process.exit(0)
    return
}
action_main()
