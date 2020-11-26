$(function () {
    //1.定义校验规则
    var layer = layui.layer
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //新旧不重复
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '原密码和旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码输入不一致'
            }
        }
    })

    //2.表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                layer.msg(res.message, {
                    icon: 6
                });
                // 重置密码后重新登录
                window.parent.location.href = '/login.html'
                $('.layui-form')[0].reset()
            }
        })
    })


})