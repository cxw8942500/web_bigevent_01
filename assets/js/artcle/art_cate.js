$(function () {
    //1.初始化文章分类列表
    initArtCateList()
    //封装一个获取数据的函数
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return '获取列表不成功'
                }
                var htmlStr = template('tpl-list', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //添加类别
    var layer = layui.layer
    var indexAdd = null
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    //事件代理，表单发送ajax
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg(res.message)
                // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    //编辑功能
    var indexEadi = null
    var form = layui.form
    $('tbody').on('click', '.btn-eadi', function () {
        //点击以后弹出框
        indexEadi = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '修改文章分类',
            content: $('#dialog-eadi').html()
        });

        //获取ID，发送ajax请求，将数据放在表单中
        var id = $(this).attr('data-in')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return '获取信息失败'
                }
                form.val('form-eadi', res.data)
            }
        })
    })


    //监听修改表单
    $('body').on('submit', '#form-eadi', function (e) {
        e.preventDefault()
        //f发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                //关闭弹出层
                layer.close(indexEadi)
                initArtCateList()
            }
        })
    })



    //删除
    $('tbody').on('click', '.btn-delel', function () {
        // console.log(15);
        var id = $(this).attr('data-in')
        //弹出询问框
        layer.confirm('是否删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //发送ajax
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtCateList()
                    layer.close(index);
                }
            })
        });
    })
})