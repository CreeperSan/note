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
                    data : response.data.data
                })
            }else{
                resolve({
                    success : true,
                    data : response.data.message
                })
            }
        }).catch(function (error) {
            resolve({
                success : true,
                data : '网络连接失败'
            })
        })
    })
}
