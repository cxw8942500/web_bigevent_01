$(function () {

    3. //定义过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)
        var y = dt.getFullYear()
        var m = padAZero(dt.getMonth() + 1)
        var d = padAZero(dt.getDate())

        var hh = padAZero(dt.getHours())
        var mm = padAZero(dt.getMinutes())
        var ss = padAZero(dt.getSeconds())
        return `${y}-${m}-${d}   ${hh}:${mm}:${ss}`
    }
    //补零操作
    function padAZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 1.定义提交参数
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的ID
        state: '' //文章的状态，可选值有：已发布、草稿
    }

    //2.初始化文章列表
    initTable()
    var layer = layui.layer

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用分页
                renderPage(res.total)
            }
        })
    }

    //4.初始化分类
    initCate()
    var form = layui.form

    function initCate() {
        $.ajax({
            method: 'GET',
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                //赋值，渲染分类
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通知layui重新渲染
                form.render()
            }
        })
    }

    //5.筛选功能
    $('#fom-search').on('submit', function (e) {
        e.preventDefault()
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        q.state = state
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })

    //6.定义渲染分页的函数
    var laypage = layui.laypage

    function renderPage(tolai) {
        // console.log(tolai);
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意：放分页的容器
            count: tolai, //数据总数，服务端得到
            limit: q.pagesize, //每页几条
            curr: q.pagenum, //默认第几页
            //分页模块设置，显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })

    }

    //7.删除功能
    $('tbody').on('click', '.btn-delel', function () {
        var id = $(this).attr('data-in')
        layer.confirm('是否删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // 
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)

                    //判断页面上删除按钮的个数
                    var len = $('.btn-delel').length
                    //如果页面上的删除按钮等于1，删除完以后，让页码值进行--操作
                    if (len === 1) {
                        //判断页码值是否为第一页
                        q.pagenum == 1 ? 1 : q.pagenum--
                    }
                    //重新调用
                    initTable()

                }
            })
            //关闭弹出层
            layer.close(index);
        });
    })


})