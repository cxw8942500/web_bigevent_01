$(function () {
    // 1.表单验证
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为1 ~ 6位之间'
            }
        }
    })

    //2.用户渲染
    initUserInfo()
    var layer = layui.layer
    //封装一个获取用户信息的函数
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                //获取成功后渲染
                form.val('formUserInfo', res.data)
            }
        })
    }

    //3.表单重置
    $('#btnReset').on('click', function (e) {
        // 阻止重置
        e.preventDefault()
        //从新开始用户渲染
        initUserInfo()
    })
    //4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        //发送ajax，修改用户信息
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                }
                layer.msg(res.message, {
                    icon: 6
                })
                //调用父页面中更新用户信息和头像方法
                window.parent.getUserInof()
            }

        })

    })
})