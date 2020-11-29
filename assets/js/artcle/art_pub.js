$(function () {
    //1.调用渲染文章分类的函数
    initCate()

    var layer = layui.layer
    var form = layui.form

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                //  console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //调用模板
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //form重新渲染
                form.render()
            }
        })
    }

    //2. 初始化富文本编辑器
    initEditor()



    //3.裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //4.选择图片
    $('#btnImg').on('click', function () {
        setTimeout(function () {
            $('#coverFile').click()
        }, 0)

    })

    //4.1监听隐藏域
    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0]
        if (file === undefined) {
            return
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //4.2设置状态
    var state = null
    $('#btnSave1').on('click', function () {
        state = '已发布'
    })
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })
    //4.3添加文章，监听表单
    $('#form_pub').on('submit', function (e) {
        e.preventDefault()
        //创建ForDate对象，收集数据
        var fd = new FormData(this)
        //放入动态
        fd.append('state', state)
        //放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                //放入图片
                fd.append('cover_img', blob)
                // console.log(...fd);
                publishArticle(fd)
            })
    })

    //4.4封装一个添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType:false,
            processData:false,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                //跳转页面
                // location.href = '/article/art_list.html'

                setTimeout(function() {
                    window.parent.document.getElementById('art_list').click()
                },1000)
            }
        })
    }
})