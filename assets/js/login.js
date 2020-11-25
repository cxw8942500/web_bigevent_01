$(function () {

    //1.点击去注册账号，隐藏登录页面，显示注册区域
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //2.点击去登录，隐藏注册页面，显示登录区域
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //3.校验规则
    var form = layui.form
    form.verify({
        //密码规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        //确认密码规则
        repwd: function (value) {
            //选择器必须带空格 选择后代中的input 中name为password属性值的
            let pwd = $('.reg-box input[name = password]').val()
            if (pwd !== value) {
                return '两次输入密码不一致'
            }
        }
    })

    //4.监听注册表单
    var layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    // return alert(res.message)
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                // alert(res.message)
                layer.msg(res.message, {
                    icon: 6
                });
                $('#link_login').click()
                $('#form_reg')[0].reset()
            }
        })
    })

    //5.监听登录表单
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败', {
                        icon: 5
                    });
                }
                //提示信息，保存token，跳转页面
                layer.msg('恭喜你，登录成功', {
                    icon: 6
                });
                localStorage.setItem('token', res.token)
                //跳转页面
                location.href = '../../index.html'

            }
        })
    })

})