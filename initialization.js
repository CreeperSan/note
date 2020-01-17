const readline = require('readline-sync')
const config_manager = require('./manager/config_manager')

function log(msg){
    console.log(msg)
}

function action_main(){
    log('                                   ')
    log('==========   Note Initialization   ==========')
    log('                                   ')
    log('Enter "1" for server config initialization')
    log('Enter "2" for application config initialization')
    log('Enter other to exit')
    let action = readline.question('Please enter : ')
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
    log('· Server config initialization')

    let tmp_port = readline.question('1. Please enter server port( ' + config_manager.get_server_port() +' ) : ')
    if('' !== tmp_port){
        config_manager.set_server_port(tmp_port)
    }

    let tmp_address = readline.question('2. Please enter server address( ' + config_manager.get_server_database_host() +' ) : ')
    if('' !== tmp_address){
        config_manager.set_server_database_host(tmp_address)
    }

    let tmp_name = readline.question('3. Please enter database name( ' + config_manager.get_server_database_name() +' ) : ')
    if('' !== tmp_name){
        config_manager.set_server_database_name(tmp_name)
    }

    let tmp_username = readline.question('4. Please enter MySQL username( ' + config_manager.get_server_database_username() +' ) : ')
    if('' !== tmp_username){
        config_manager.set_server_database_username(tmp_username)
    }

    let tmp_password = readline.question('5. Please enter MySQL password : ')
    config_manager.set_server_database_password(tmp_password) // 密码可能为空
    // if('' !== tmp_password){
    // }

    config_manager.save_server_config()
    log('Server config finished!')
    action_main()
}

function action_app(){
    log('· Application config initialization')
    log('Not supported yet, still developing...')
    log('Application configuration finished!')
    action_main()
}



log('Loading configuration...')
if(!config_manager.init()){
    log('Error happened while loading configuration, please check your configuration file.')
    process.exit(0)
    return
}
action_main()
