$(function () {
    //1.获取用户信息
    getUserInof()

    //2.退出功能
    var layer = layui.layer
    $('#loginout').on('click', function () {
        layer.confirm('是否确认退出？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //清除本地token
            localStorage.removeItem('token')
            //跳转页面
            location.href = '/login.html'
            layer.close(index);
        });
    })
})
//外面的页面要调用，所以要定义一个全局的获取用户信息的函数
function getUserInof() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message, {
                    icon: 5
                });
            }
            //调用渲染头像的函数
            renderAvatar(res.data)
        }
    })
}


//封装一个渲染头像的函数
function renderAvatar(user) {
    //1.用户名(昵称优先,没有昵称才用username)
    var name = user.nickname || user.username
    $('#welcome').html(`欢迎 ${name}`)
    //2.用户头像
    if (user.user_pic !== null) {
        //有头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //没有头像
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase()
        $('.text-avatar').html(text).html()
    }
}