// 需要 axios 支持

async function post(url, data) {
    return new Promise((resolve, reject) => {
        axios({
            method  : 'post',
            url     : url,
            headers : {
                id      : Cookies.get('UserID'),
                key     : Cookies.get('key'),
            },
            data    : data
        }).then(function (response) {
            console.log(response);
            if(response.data.code === 200){
                resolve({
                    success : true,
                    message : '操作成功',
                    data : response.data.data
                })
            }else{
                resolve({
                    success : false,
                    message : response.data.message,
                    data : response.data.message
                })
            }
        }).catch(function (error) {
            resolve({
                success : false,
                message : '网络连接失败',
                data : '网络连接失败'
            })
        })
    })
}
