window.commJS = {
    ver: "V2.3.2"
}
if (!window.location.origin) {
    window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}
if (window['context'] == undefined) {
    window['context'] = location.origin;
}

//获取当前系统的绝对路径
function getRootPath(url) {
    var PagesRelativeUrl = '/Pages/';
    var end = location.href.indexOf(PagesRelativeUrl) + PagesRelativeUrl.length;
    var newUrl = location.href.substring(0, end);
    if (url) {
        newUrl += url;
    }
    return newUrl;
}


//ajax配置项
var ajaxConfig = {
    // 建议将此值修改成为POST避免缓存
    reqMtd: 'POST'
}


var VocDebug = false;
/**
 * 去掉小数点后面的多余的0
 * @param num
 * @returns {string}
 */
String.prototype.fix0 = function (num) {
    var value = this.valueOf()
    if (/\.?\d+$|^\d+$/.test(value)) {
        var reg = /0+?$/
        value = this.valueOf().replace(reg, '').replace(/[.]$/, '')
    }
    return value
}

// 控制换行
String.prototype.warp = function (num) {
    var start = 1
    var strArray = this.valueOf().match(/./g)
    for (var i = 0; i < strArray.length; i++) {
        if (i >= num * start) {
            // console.log(num * start)
            var m = num * start
            if (start > 1)
                m = num * start + start - 1
            start++
            strArray.splice(m, 0, '<br>')
        }
    }
    return strArray.join('')
}

String.prototype.bool = function () {
    return (/^true$/i).test(this)
}

String.prototype.trim = function () {
    return this.replace(/(^\s+)|(\s+$)/g, '')
}
/**
 * 扩展string.format
 * @returns {string}
 */
String.prototype.format = function () {
    var s = this
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp('\\{' + i + '\\}', 'gm')
        s = s.replace(reg, arguments[i])
    }
    return s
}

/**
 * 数组插入到指定位置
 * @param index
 * @param item
 */
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item)
}
/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
    var o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'H+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        'S': this.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    return fmt
}

if (!Array.prototype.hasOwnProperty('forEach')) {
    Array.prototype.forEach = function (callback, thisArg) {
        var T, k
        if (this == null) {
            throw new TypeError(' this is null or not defined')
        }
        var O = Object(this)
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32
        if ({}.toString.call(callback) != '[object Function]') {
            throw new TypeError(callback + ' is not a function')
        }
        if (thisArg) {
            T = thisArg
        }
        k = 0
        while (k < len) {
            var kValue
            if (k in O) {
                kValue = O[k]
                callback.call(T, kValue, k, O)
            }
            k++
        }
    }


}

Public = {
    post: function (url, param, callback) {
        $.ajax({
            url: url,
            type: ajaxConfig.reqMtd,
            data: param,
            dataType: 'json',
            success: function (data) {
                callback(data)
            },
            error: function (msg) {
                // alert(msg)
            }
        })
    },
    get: function (url, param, callback) {
        $.ajax({
            url: url,
            type: 'GET',
            data: param,
            dataType: 'json',
            success: function (data) {
                callback(data)
            },
            error: function (msg) {
                // alert(msg)
            }
        })
    },
    /**
     *此方法使用于ajax提交上传文件，依赖jquery.form.js
     *利用jquery.form提交form表单
     * @param config
     */
    ajaxForm: function (config) {
        var _default = {
            url: '',
            param: {},
            form: null, // form选择器，或者jquery对象
            beforeSubmit: function (formdata, form, options) {
            },
            showLoading: true,
            success: function (response) {
            },
            error: function () {
            }
        }

        $.extend(_default, config);

        // 判断是否是选择器
        if (typeof _default.form == 'string')
            _default.form = $(_default.form)

        var loading
        if (_default.showLoading)
            loading = Public.showLoading();


        // 设置事件源的type位submit
        /* var _submitCount = $(_default.form).has("#AJAX_SUBMIT_BUTTON").length;
         if (_submitCount == 0) {
             $(_default.form).append("<button type='submit' style='display:none' id='AJAX_SUBMIT_BUTTON'>button</button>");
         }*/

        /*$(_default.form).ajaxSubmit({
            url: _default.url,
            type: "post",  //提交方式
            dataType: "json", //数据类型
            data: _default.param,
            success: function (response) {
                if (loading)
                    loading.hide()
                _default.success(response)
            },
            error: function (data) {
                _default.error(data)
                if (loading)
                    loading.hide()
                Public.alert('操作提示', '上传失败！', 'info')
            }
        });*/

        $(_default.form).submit(function () {
            $(this).ajaxSubmit({
                url: _default.url,
                type: "post",  //提交方式
                dataType: "json", //数据类型
                data: _default.param,
                success: function (response) {
                    if (loading)
                        loading.hide()
                    _default.success(response)
                },
                error: function (data) {
                    _default.error(data)
                    if (loading)
                        loading.hide()
                    Public.alert('操作提示', '上传失败！', 'info')
                }
            });

            return false;
        }).submit();


    },
    guid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    },
    /**
     * 展示一个等待提示框
     *@param["target"]: "body", //需要展示的遮罩的目标
     *@param["cssName"]: "_showloading", //class名称，可以自定义class
     *@param["loadingImg"]: "/static/themes/vocs/ui-images/loading.gif", //遮罩图片的路径
     *@param["loadingText"]: "数据正在加载,请稍后...", //提示层的提示文字
     *@param["hideCall"]: null, //关闭回调函数
     *@param["timeout"]: 0 //是否自动关闭
     * @returns {ShowLoading}
     * @constructor
     */
    showLoading: function (opt) {
        var loading = new ShowLoading(opt)
        loading.show();
        return loading;
    },
    // 信息提示
    alert: function (title, msg, icon, onClose) {
        this.getTopWindow().layer.alert(msg, {
            title: title,
            // icon: 1,
            skin: 'layer-ext-moon',
            btn: ['确定'],
            end: function (index, layero) {
                layer.close(index)
                if (typeof icon == 'function')
                    icon()
                else if (typeof onClose == 'function')
                    onClose()
            }
        })
    },
    // 确认提示
    confirm: function (title, msg, ok, cancel) {
        this.getTopWindow().layer.confirm(msg, {
            title: title,
            btn: ['确定', '取消'] // 按钮
        }, function (index, layero) {
            layer.close(index)
            if (typeof ok == 'function') {
                ok(true)
            } else {
                ok(false);
            }
        })
    },
    // 带输入的确认提示
    prompt: function (title, msg, ok) {
        this.getTopWindow().layer.prompt({title: msg}, function (text, index) {
            layer.close(index)
            ok(text)
        })
    },
    // 自动消失提示框
    tips: function (title, msg, onClose, timeout) {
        this.getTopWindow().layer.msg(msg, {time: 1500}, function () {
            if (typeof onClose == 'function') {
                onClose()
            }
        })
    },
    // 获取文件扩展名
    getFileExt: function (fileName) {
        return fileName.replace(/.+\./, '')
    }

};


//弹窗方法
Public.openWindow = function (config) {
    var options = $.extend({}, Public.openWindow.defaults, config);

    var content = options.url;
    //如果URL没有配置
    if (isNullOrEmpty(options.url)) {
        content = options.content;
        if (typeof content == 'object') {
            content = $(content);
        }
    }
    else {

        content = "<div class='layui-layer-load' style='width:100%;height:100%;'></div>";
        // 合并url参数和param配置参数
        var _param = $.extend({}, Public.openWindow.methods.parseQueryString(options.url), options.param);
        // 重新处理URL
        var url = options.url
        if (url.indexOf('?') != -1)
            url = url.substring(0, url.indexOf('?'))
        if (!$.isEmptyObject(_param)) {
            url += '?' + $.param(_param)
        }
        // 如果是iframe方式加载则重写url
        if (options.isFrame) {
            options.showbtns = false;
            content = url;
        }
    }


    //作为引用类型返回，用于ajax异步返回界面解析之后重新赋值。
    var refReturn = new function () {
        this.index = -1;
        this.iframe = null;
        this.window = null;
        //关闭方法
        this.close = function () {
            Public.openWindow.methods.hideWindow(this.index);
        }
        this.full = function () {
            layer.full(this.index);
        }
        //重新加载方法
        this.reload = function () {
            if (!isNullOrEmpty(options.url)) {
                //如果是ajax请求
                if (!options.isFrame)
                    Public.openWindow.methods.asyncRequest(this, options);
                else {
                    this.iframe[0].contentWindow.location.reload(true);
                }
            }
        }
    }


    var layerType = 1;
    if (options.isFrame && options.url) {
        layerType = 2
    }
    options.width = options.zoomNumber * options.width;
    //V2不在调用easyui的window
    var index = layer.open({
        zIndex: 50,
        resize: options.resizable,
        maxmin: options.maxmin,
        title: options.title,
        // type 0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        type: layerType,
        content: content,
        shade: [0.3, '#000'],
        area: [options.width + 'px', options.height + 'px'],
        // area: [parseInt(options.width) + "px", "auto"],
        // skin: 'layui-layer-lan',
        // skin: 'layui-layer-molv',
        btn: (!options.showbtns ? null : [options.okText, options.cancelText]),
        yes: function (index, layero) {
            //放置假死
            setTimeout(function () {
                options.okCallback.call(layero, refReturn);
            })
            // layer.close(index)
        },
        btn2: function (index, layero) {
            Public.openWindow.methods.hideWindow(index);
        },
        cancel: function (index, layero) {
            Public.openWindow.methods.hideWindow(index);
        },
        end: function () {
            setTimeout(function () {
                options.onClose();
            });
        },
        success: function (layero, index) {
            refReturn.window = layero;
            refReturn.body = refReturn.window.find('.layui-layer-content');
            //如果是ajax请求
            if (!isNullOrEmpty(options.url) && !options.isFrame) {
                Public.openWindow.methods.asyncRequest(refReturn, options);
            }
            else {
                refReturn.body.height((options.height - $(layero).find('.layui-layer-title').outerHeight()));
                refReturn.iframe = $(layero).find('iframe');
                options.onInit.call(layero, index);
                options.onLoad.call(layero, index);
            }

        }
    });
    refReturn.index = index;
    refReturn.window = $('#layui-layer' + index);
    return refReturn;
};
//默认弹窗配置
Public.openWindow.defaults = {
    'id': 'window-cdtrkxab',
    method: ajaxConfig.reqMtd,
    param: {
        '_': Public.guid()
    },
    //窗口放大倍数
    zoomNumber: 1,
    url: null,
    content: "<div class='loading-box' style='width:100%;height:100%;'></div>",
    okCallback: function () {
        // alert(1)

    },
    onClose: function () {
    },
    onInit: function () {
    },
    onLoad: function () {
    },
    isFrame: false,
    width: 450,
    height: 400,
    title: '标题',
    resizable: false,
    maxmin: false,
    showHead: true,
    closable: true,
    showbtns: true,
    cancelText: '取消',
    okText: '确定'
};
//弹窗static方法
Public.openWindow.methods = {
    /**
     * 转换url参数对象
     * @param url
     * @returns {{}}
     */
    parseQueryString: function (url) {
        var reg_url = /^[^\?]+\?([\w\W]+)$/,
            reg_para = /([^&=]+)=([\w\W]*?)(&|$)/g, // g is very important
            arr_url = reg_url.exec(url),
            ret = {}
        if (arr_url && arr_url[1]) {
            var str_para = arr_url[1],
                result
            while ((result = reg_para.exec(str_para)) != null) {
                ret[result[1]] = result[2]
            }
        }
        return ret
    },
    //关闭窗口
    hideWindow: function (index) {
        layer.close(index);
    },
    /**
     * ajax请求窗口内容
     * @param refReturn
     * @param options
     */
    asyncRequest: function (refReturn, options) {
        $.ajax({
            type: options.method,
            dataType: 'html',
            url: options.url,
            // async: false,
            data: options.param,
            success: function (data, textStatus, jqXHR) {
                var content = data;
                var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
                var matches = pattern.exec(data);
                if (matches) {
                    content = matches[1]
                }
                refReturn.body.height((options.height - refReturn.window.find('.layui-layer-title').outerHeight()));
                $(refReturn.body).html(content);
                //兼容ui.js
                if ($.parser) {
                    $.parser.parse(refReturn.body);

                }
                options.onInit.call(refReturn.window, null);
                options.onLoad.call(refReturn.window, null);

            }
        });
    }
};
//获取本框架最顶层窗口对象
Public.getTop = function () {
    return this.getTopWindow().Public;
};
Public.getTopWindow=function () {
    var _top = self;
    while (_top != _top.parent) {
        if (typeof _top.parent.Public != "undefined") {
            _top = _top.parent;
            continue;
        }
        break;
    }
    return _top;
}
//在顶层打开窗口
Public.openTopWindow = function (config) {
    return this.getTop().openWindow(config);
};


//获取文件
Public.getFile = function (url, args, isNewWinOpen, method) {
    if (typeof url != 'string') {
        return;
    }
    var method = method || 'post'
    var url = url.indexOf('?') == -1 ? url += '?' : url;
    // id会超长，
    // if(args.id) {
    //   url += '&id=' + args.id + '&random=' + new Date().getTime();
    // } else {
    //   url += '&random=' + new Date().getTime();
    // };
    //

    url += '&random=' + new Date().getTime();

    var downloadForm = parent.$('form#downloadForm');
    if (downloadForm.length == 0) {
        downloadForm = parent.$('<form method="' + method + '"/>').attr('id', 'downloadForm').hide().appendTo('body');
    }
    else {
        downloadForm.empty();
    }
    downloadForm.attr('action', url);
    for (k in args) {
        $('<input type="hidden" />').attr(
            {
                name: k,
                value: args[k]
            }).appendTo(downloadForm);
    }
    if (isNewWinOpen) {
        downloadForm.attr('target', '_blank');
    }
    else {
        var downloadIframe = $('iframe#downloadIframe');
        if (downloadIframe.length == 0) {
            downloadIframe = $('<iframe />').attr('id', 'downloadIframe').hide().appendTo('body');
        }
        downloadForm.attr('target', 'downloadIframe');
    }
    downloadForm.trigger('submit');
};

/**
 * description:获取URL的参数的value
 *@name：参数名称
 */
function getUrlParam(name, url) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'), href;
    if (url) {
        href = url;
        var index = url.indexOf('?');
        if (index != -1) {
            href = url.substring(index + 1);
        }
    } else {
        href = window.location.search.substr(1);
    }
    var r = href.match(reg); // 匹配目标参数
    if (r != null) return unescape(r[2])
    return null; // 返回参数值
}

/**
 * 将url参数转换成JSON
 * @param param
 * @returns {{}}
 */
function urlToJson(url) {
    if (!url)
        url = window.location.href;
    var index = url.indexOf("?");
    var obj = {};
    if (index != -1) {
        url = url.substr(( index + 1));
        var keyvalue = [];
        var key = "",
            value = "";
        var paraString = url.split("&");
        for (var i in paraString) {
            if (paraString.hasOwnProperty(i)) {
                keyvalue = paraString[i].split("=");
                key = keyvalue[0];
                value = keyvalue[1];
                obj[key] = value;
            }
        }
    }
    return obj;
}

/**
 *检测是否是空值
 * @param data
 * @returns {boolean}
 */
function isNullOrEmpty(data) {
    return ((typeof data == 'string' && data == '') || typeof data === typeof undefined || data == null)
}

/**
 * description：阻止事件冒泡
 * time：2015/06/16
 * @param e：事件的对象
 */
function stopPropagation(e) {
    window.event ? window.event.cancelBubble = true : e.stopPropagation()
    window.event ? window.event.returnValue = false : e.preventDefault()
}

/**
 * =======================================================================
 ***--------------------------加载一个等待提示框--------------------------
 * =======================================================================
 * 配置项：｛｝
 *@target: "body",//需要展示的遮罩的对象
 *@cssName: "_showloading",//class名称，可以自定义class
 *@loadingImg: "/static/themes/vocs/ui-images/loading.gif",//遮罩图片的路径
 *@loadingText: "数据正在加载,请稍后...",//提示层的提示文字
 *@hideCall: null,//关闭回调函数
 *@timeout: 0//是否自动关闭
 * @param {Object} {target:'',cssName:'',loadingImg:'',loadingText:''}
 */
function ShowLoading(opt) {
    // 默认配置项
    var _default = {
        'target': 'body', // 需要展示的遮罩的目标
        'cssName': '_showloading', // class名称，可以自定义class
        'loadingText': '数据正在加载,请稍后...', // 提示层的提示文字
        'hideCall': null, // 关闭回调函数
        'timeout': 0 // 是否自动关闭
    }
    $.extend(this, _default, opt)
    if (typeof this.target == 'string')
        this.target = $(this.target)
    if (typeof context != 'undefined')
        this.loadingImg = context + this.loadingImg
}

ShowLoading.prototype.show = function (msg, callBack) {
    var me = this
    var isBody = $(me.target).prop('nodeName') == 'BODY'
    // 获取目标的大小
    var getSize = function () {
        var scrollTop = isBody ? $(window).scrollTop() : $(me.target).scrollTop()
        var scrollLeft = isBody ? $(window).scrollLeft() : $(me.target).scrollLeft()
        // var w = isBody ? (scrollLeft+$(window).width()) : (scrollLeft+$(me.target).width())
        // var h = isBody ? (scrollTop + $(window).height()) : (scrollTop + $(me.target).height())
        var w = isBody ? ($(window).width()) : ($(me.target).width())
        var h = isBody ? ($(window).height()) : ($(me.target).height())
        return {width: w, height: h, scrollTop: scrollTop, scrollLeft: scrollLeft}
    }
    if (!this.$loading) {
        this.loadingId = '_load' + (new Date()).valueOf()
        if (!isBody)
            $(me.target).css('position', 'relative')
        this.$loading = $('<div>', {
            'id': this.loadingId,
            'class': this.cssName,
            // "style": "border:1px solid red",
            "html": "<div class='" + this.cssName + "-msg'>" + this.loadingText + "</div>"
        }).appendTo(this.target)
        var setPostion = function () {
            me.$loading.css({
                // width: getSize().width + "px",
                width: getSize().width + 'px',
                height: getSize().height + 'px',
                top: getSize().scrollTop + 'px',
                left: getSize().scrollLeft + 'px'
            })
            var sefWidth = me.$loading.children("." + me.cssName + "-msg").width(),
                sefHeight = me.$loading.children("." + me.cssName + "-msg").height()
            me.$loading.children("." + me.cssName + "-msg").css({
                'top': function () {
                    return parseInt((getSize().height - sefHeight) / 2) + 'px'
                },
                'left': function () {
                    return parseInt((getSize().width - sefWidth) / 2) + 'px'
                }
            })
        }
        this.setPsIntv = setInterval(function () {
            setPostion()
        }, 50)
    }
    if (msg) {
        this.loadingText = msg
        this.$loading.children().text(msg)
    }

    // 是否有回调函数
    if (callBack != undefined && typeof callBack == 'function') {
        this.hideCall = callBack
    }
    // 是否是定时关闭
    if (this.timeout > 0) {
        setTimeout(function () {
            me.hide()
        }, this.timeout)
    }
    return this
}
ShowLoading.prototype.hide = function () {
    if (this.$loading) {
        this.$loading.remove()
        this.$loading = null
    }
    if (typeof this.hideCall == 'function') {
        this.hideCall()
    }
    if (this.setPsIntv)
        clearInterval(this.setPsIntv)
}
ShowLoading.prototype.update = function (msg) {
    if (this.$loading) {
        this.$loading.children().text(msg);
    }
}

/**
 * Html编码获取Html转义实体
 * @param value
 * @returns {string}
 */
function htmlEncode(value) {
    if (typeof value != 'string') {
        return value
    }
    if (value.length == 0) return ''
    var s = value
    s = s.replace(/&/g, '&amp;')
    s = s.replace(/</g, '&lt;')
    s = s.replace(/>/g, '&gt;')
    s = s.replace(/ /g, '&nbsp;')
    s = s.replace(/\'/g, '&#39;')
    s = s.replace(/\"/g, '&quot;')
    return s
}

/**
 * Html解码获取Html实体
 * @param value
 * @returns {string}
 */
function htmlDecode(value) {
    if (typeof value != 'string') {
        return value
    }
    if (value.length == 0) return ''
    var s = value
    s = s.replace(/&amp;/g, '&')
    s = s.replace(/&lt;/g, '<')
    s = s.replace(/&gt;/g, '>')
    s = s.replace(/&nbsp;/g, ' ')
    s = s.replace(/&#39;/g, "'")
    s = s.replace(/&quot;/g, '"')
    return s
}

// Html编码获取Html转义实体
function jQhtmlEncode(value) {
    return $('<div/>').text(value).html()
}

// Html解码获取Html实体
function jQhtmlDecode(value) {
    return $('<div/>').html(value).text()
}

/*
 * 判断是否是数组
 * @param obj
 * @returns {boolean}
 */
function isArray(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]'
}

/*
 * 判断是否是对象
 * @param obj
 * @returns {boolean}
 */
function isObject(obj) {
    return Object.prototype.toString.call(obj) == '[object Object]'
}

/**
 * 判断是否是Element对象
 * @param obj
 * @returns {boolean}
 */
function isElement(obj) {
    return Object.prototype.toString.call(obj) == '[object HTMLDivElement]'
}

/**
 * 开始一个ajax请求
 * @param 请求路径
 * @param 请求方式POST GET
 * @param 请求数据(object){}
 * @param 请求回调
 * @constructor
 */
function JqAjax(url, method, param, callback, target) {
    // 如果没有指定target 默认是body
    if (typeof target == 'undefined') {
        target = 'body'
    }
    var load = new ShowLoading({
        'target': target
    })
    if (target)
        load.show()
    $.ajax({
        url: url,
        type: method,
        data: param,
        dataType: 'json',
        global: false,
        success: function (data) {
            load.hide()
            if (data.result && data.result == 'failed') {
                if (typeof data.targetUrl != 'undefined')
                    top.location.href = data.targetUrl
                else
                    $.messager.alert('操作提示', '操作失败', 'error')
            } else {
                if (typeof callback == 'function') {
                    callback.call(this, data)
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            load.hide()
            alert('当前出现错误')
        }
    })
}

/**
 * 设置表单只读
 * @param formSelctor
 */
function readOnlyForm(formSelctor) {
    setTimeout(function () {
        if (formSelctor) {
            $(':radio,:checkbox', formSelctor).prop('disabled', true)
            $(":input:not(':button'),a.choose-btn", formSelctor).addClass('disabled').prop('readonly', true).off('click focus')
            $('.combo,.combo > *', formSelctor).prop('disabled', true).off('click focus')
        } else {
            $(':radio,:checkbox').prop('disabled', true)
            $(":input:not(':button'),a.choose-btn").addClass('disabled').prop('readonly', true).off('click focus')
            $('.combo,.combo > *').prop('disabled', true).off('click focus')
        }
    }, 200)
}

/*
 *lodop 打印构造函数
 */
function LodopPrint() {
    var errorMsg = ''

    function getCPU() {
        var agent = navigator.userAgent.toLowerCase()
        if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) return 'x64'
        return navigator.cpuClass
    }

    function lodopPath() {
        /*if (getCPU() == "x64")
         return context + "/static/lodop/install_lodop64.exe";*/
        return context + '/static/lodop/install_lodop32.exe'
    }

    this.checkIsInstall = function () {
        var result = false

        var strHtmInstall = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='" + lodopPath(32) + "' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>"
        var strHtmUpdate = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='" + lodopPath(32) + "' target='_self'>执行升级</a>,升级后请重新进入。</font>"
        var strHtm64_Install = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='" + lodopPath(64) + "' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>"
        var strHtm64_Update = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='" + lodopPath(64) + "' target='_self'>执行升级</a>,升级后请重新进入。</font>"
        var strHtmFireFox = "<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>"
        var strHtmChrome = "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重点击这里<a href='" + lodopPath(32) + "' target='_self'>执行安装</font>"

        try {
            // 判断浏览器类型
            var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0)
            var is64IE = isIE && (getCPU() == 'x64')
            var LODOP = this.getLodop()
            if ((LODOP != null) && (typeof(LODOP.VERSION) != 'undefined')) {
                if (LODOP.VERSION < '6.1.9.8') {
                    if (is64IE) {
                        errorMsg = strHtm64_Update
                    } else if (isIE) {
                        errorMsg = strHtmUpdate
                    } else {
                        errorMsg = strHtmUpdate
                    }
                } else {
                    result = true
                }
            } else {
                if (navigator.userAgent.indexOf('Chrome') >= 0)
                    errorMsg = strHtmChrome
                else if (navigator.userAgent.indexOf('Firefox') >= 0)
                    errorMsg = strHtmFireFox
                else if (is64IE)
                    errorMsg = strHtm64_Install
                else if (isIE)
                    errorMsg = strHtmInstall
                else
                    errorMsg = strHtmInstall
            }
        } catch (err) {
            result = false
        }
        return result
    }

    this.getLodop = function () {
        if (!LodopPrint.activeReady) {
            var activeStr = '<div style="position:absolute;top:0px;left:-1000em;"><object id="LODOP_OB" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=0 height=0>\
             <embed id="LODOP_EM" type="application/x-print-lodop" width=0 height=0 pluginspage="' + lodopPath() + '"></embed>\
             <param name="CompanyName" value="西安交大长天软件股份有限公司">\
             <param name="License" value="747606062808075747594958093190"></object></div>';
            $('body').append(activeStr);
            LodopPrint.activeReady = true
        }
        var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0)
        var oOBJECT = document.getElementById('LODOP_OB'),
            oEMBED = document.getElementById('LODOP_EM')
        return (isIE ? oOBJECT : oEMBED)
    }

    // lodop打印
    this.lodopPrint = function (opt) {
        // 如果没有安装就直接返回
        if (!this.checkIsInstall()) {
            Public.alert('提示', errorMsg)
            return false
        }
        var _default = {
            'paperName': 'A4',
            'fontSize': null, // 配置数值，不用带单位，lodop默认单位是pt
            'URL': null,
            'content': '',
            'footer': {
                html: '',
                top: '',
                left: '',
                width: '',
                height: ''
            },
            pagation: false,
            'isPreview': false,
            'printIndex': -1,
            'complate': null,
            'printCount': 1,
            'msg': '',
            'title': '打印VOCs排污费缴纳决定书',
            'width': '210mm',
            'height': '297mm',
            'top': '30mm',
            'left': '0mm',
            "doublePage": 0//0不启用双面打印，1（打印机自带双面打印），2打印机无双面打印功能手工翻转纸张
        }
        var options = $.extend(_default, opt)
        var PrintResult = -1; // 打印结果
        try {
            var LODOP = this.getLodop()
            if (LODOP) {
                // "FontSize"是系统关键字，表示设置字体大小，11是字体大小值，单位是pt。
                if (options.fontSize) {
                    LODOP.SET_PRINT_STYLE('FontSize', options.fontSize)
                }
                // 初始化并指定打印任务名是"打印插件功能演示_代码功能_名片"
                LODOP.PRINT_INIT(options.title);
                //是否启用了双面打印
                if (options.doublePage == 1) {
                    LODOP.SET_PRINT_MODE("PRINT_DUPLEX", 2);//0-不控制 1-不双面 2-双面(长边装订) 3-小册子双面(短边装订_长边水平)
                    LODOP.SET_PRINT_MODE("PRINT_DEFAULTSOURCE", 1);//1-纸盒 4-手动 7-自动 0-不控制
                } else if (options.doublePage == 2) {
                    LODOP.SET_PRINT_MODE("DOUBLE_SIDED_PRINT", true);
                }
                // 如果传递的是一个地址
                if (options.URL != null) {
                    // 直接加载地址ADD_PRINT_URL(Top,Left,Width,Height,strURL)
                    LODOP.ADD_PRINT_URL(options.top, options.left, options.width, options.height, options.URL)
                } else {
                    // 前俩参数设置超文本对象位置，两个100%设置对象区域可达纸张边，最后参数是超文本代码
                    // LODOP.ADD_PRINT_HTM(10, 55, "100%", "100%", strHtml)
                    var _html = '<!doctype html>' + options.content
                    if (options.paperName != '') {
                        // 设置打印纸张大小
                        // LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true)
                        LODOP.SET_PRINT_MODE('WINDOW_DEFPAGESIZE:' + options.printIndex, options.paperName)
                        // LODOP.SET_PRINT_PAGESIZE(0, '560pt', 2450, options.paperName)
                        // ADD_PRINT_HTM(Top,Left,Width,Height,strHtml)

                        LODOP.ADD_PRINT_HTM(options.top, options.left, options.width, options.height, _html)
                    } else
                        LODOP.ADD_PRINT_HTM(options.top, options.left, options.width, options.height, _html)

                    if (options.footer.html.length > 0) {
                        var footerHTML = '<body>' + options.footer.html + '</body>'
                        LODOP.ADD_PRINT_HTM(options.footer.top, options.footer.left, options.footer.width, options.footer.height, footerHTML)
                        LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
                    }
                    if (options.pagation) {
                        var pagationStr = '第#页/共&页'
                        if (options.pagation.text) {
                            pagationStr = options.pagation.text
                        }
                        LODOP.ADD_PRINT_TEXT(options.pagation.top, options.pagation.left, 300, 100, pagationStr)
                        LODOP.SET_PRINT_STYLEA(0, 'ItemType', 2)
                        LODOP.SET_PRINT_STYLEA(0, 'Horient', 1)
                    }
                }

                LODOP.SET_PRINT_COPIES(options.printCount)
                if (options.isPreview) {
                    LODOP.PREVIEW()
                } else {
                    // 用如下语句可指定Windows默认打印机：打印机设置为操作系统的默认打印机，成功返回OK，否则返回错误信息
                    // LODOP.SET_PRINT_MODE("WINDOW_DEFPRINTER",打印机名称或序号)
                    if (LODOP.GET_PRINTER_COUNT() == 0) {
                        $.messager.alert('系统提示', '您的机器上没有检测到打印机连接！', 'warning')
                        return false
                    }
                    if (options.printIndex > -1) {
                        LODOP.SET_PRINTER_INDEXA(options.printIndex); // 选择打印机
                        LODOP.SET_PRINT_MODE('WINDOW_DEFPRINTER', options.printIndex); // 设为默认打印机
                    }
                    // 打印进度
                    $.messager.progress({
                        title: '打印进度',
                        text: (options.msg == '' ? '正在打印......' : options.msg),
                        interval: 300
                    })

                    PrintResult = LODOP.PRINT()
                    LODOP.SET_PRINT_STYLEA(0, 'Horient', 2)
                    LODOP.SET_PRINT_STYLEA(0, 'HtmWaitMilSecs', 300)
                }
            }
        } catch (ex) {
            $.messager.alert('打印提示', "请更换<font color='#C41A16'><strong>IE浏览器</strong></font>再次尝试，如果还无法打印请联系管理员！", 'info')
        } finally {
            $.messager.progress('close')
            if (options.complate != undefined && typeof options.complate == 'function') {
                options.complate.call(this, PrintResult)
            }
        }
        return PrintResult > 0
    }
}

/*
 * 兼容VOC打印方法
 */
function vocsPrint(opt) {
    var ldp = new LodopPrint()
    return ldp.lodopPrint(opt)
}

/**
 * 将复杂的json对象转换成URL参数
 * @param param
 * @param key
 * @returns {string}
 * 调用方式：
 * var obj={name:'tom','class':{className:'class1'},classMates:[{name:'lily'}]}
 * parseParam(obj)
 * 结果："name=tom&class.className=class1&classMates[0].name=lily"
 * parseParam(obj,'stu')
 * 结果："stu.name=tom&stu.class.className=class1&stu.classMates[0].name=lily"
 */
function parseParam(param, key) {
    var paramStr = ''
    if (param instanceof String || param instanceof Number || param instanceof Boolean) {
        paramStr += '&' + key + '=' + encodeURIComponent(param)
    } else {
        $.each(param, function (i, p) {
            if (p == null || p == undefined)
                return true
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
            paramStr += '&' + parseParam(this, k)
        })
    }
    return paramStr.substr(1)
}

// 转换数字
function parseNumber(val) {
    var v1 = parseFloat(val)
    if (isNaN(v1))
        return 0
    else
        return v1
}


/**
 *
 * @param number {number}要格式化的数字
 * @param decimals {number}保留的小数位数
 * @param dec_point {string}分隔小数字符
 * @param thousands_sep {string}千位分隔符
 * @returns {string}
 */
function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '')
        .replace(/[^0-9+\-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec)
            return '' + (Math.round(n * k) / k)
                .toFixed(prec)
        }
    // Fix for IE parseFloat(0.55).toFixed(0) = 0
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
        .split('.')
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '')
            .length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1)
            .join('0')
    }
    return s.join(dec)
}

/**
 * datagrid-数字格式化-(000,000.00)
 */
function fmtMoney(value, decimals) {
    if (!decimals)
        decimals = 2;
    return parseFloat(number_format(value, decimals, '.', ','));

}


function fmtFloat(value, decimals) {
    if (!decimals)
        decimals = 2;
    return parseFloat(number_format(value, decimals, '.', ''));
}


//combobox onHidePanel处理输入无效函数
function onComboboxHidePanel() {
    var el = $(this)
    el.combobox('textbox').focus().blur(function (e) {
        chkInput()
    })

    function chkInput() {
        // 检查录入内容是否在数据里
        var opts = el.combobox('options')
        var data = el.combobox('getData')
        var value = el.combobox('getValue')
        // 有高亮选中的项目, 则不进一步处理
        var panel = el.combobox('panel')
        var items = panel.find('.combobox-item-selected')
        if (items.length > 0) {
            var values = el.combobox('getValues')
            el.combobox('setValues', values)
            return
        }
        var allowInput = opts.allowInput
        if (allowInput) {
            var idx = data.length

            data[idx] = []
            data[idx][opts.textField] = value
            data[idx][opts.valueField] = value
            el.combobox('loadData', data)
        } else {
            // 不允许录入任意项, 则清空
            el.combobox('clear')
        }
    }

    chkInput()
}

/**
 * datagrid 长字段显示tips
 * @param value
 * @param row
 * @param index
 * @returns {string}
 */
function gridShowTips(value, row, index, length) {
    if (!value)
        return ''
    var val = htmlEncode(String(value))
    return "<div class='remark-toolstip' style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'>" + val + '</div>'
}

$(document).ready(function () {

    // 给气泡绑定初始化
    $(document).on('mouseover mouseout', '.datagrid-cell', function (e) {
        if ($(this).find('.remark-toolstip').length > 0) {
            if (e.type == 'mouseover') {
                $(this).tooltip({
                    position: 'bottom',
                    content: $(this).find('.remark-toolstip').html().replace(/\n/g, '<br />'),
                    onShow: function (et) {
                    }
                }).tooltip('show')
            } else {
                $('.remark-toolstip').tooltip('hide')
            }
        }
    })
})

/****************************************************
 *控件初始化WebOffice 构造方法
 *@author:叶明龙
 *@time:2017/04/17
 *@warning 需要在机器上安装office或者wps客户端
 *@warning 需要在机器上安装office或者wps客户端
 *@warning 需要在机器上安装office或者wps客户端
 * 示例：
 *var myOffice = new MyOffice(function () {
        myOffice.openDocument('http://localhost:8079/vehicleManagementSystem/file1.doc')

        //新建
        $("#btn_newDoc").click(function (e) {
            myOffice.createDocument()
        })

        //关闭
        $("#btn_closeDoc").click(function (e) {
            myOffice.closeDocument()
        })

        //保存
        $("#btn_saveDoc").click(function (e) {

            // 上传文件
            var returnValue = myOffice.saveDocument("标题.doc", context + "/static/json_data/save.php")
            if (returnValue == 'success') {
                alert("保存成功")
            }
            else {
                alert("保存失败")
            }
        })
    })
 myOffice.initOffice("#myoffice")
 ****************************************************/
function MyOffice(CtrlReady) {
    this.webOfficeId = 'webOffice' + Public.guid().replace(/-/g, '')

    // NotifyCtrlReady
    this.ctrlReady = 'ctrlReady' + this.webOfficeId
    window[this.ctrlReady] = CtrlReady
    this.initReady = false

    // 初始化weboffice
    this.initOffice = function (target) {
        try {
            if (!document.getElementById(this.webOfficeId)) {
                var office = ''
                if (typeof CtrlReady != 'undefined') {
                    office += '<scr ipt language="javascr ipt" for="' + this.webOfficeId + '" event="NotifyCtrlReady">'
                    office += this.ctrlReady + '();'
                    office += '</scr ipt>'
                }

                office += '<object id="' + this.webOfficeId + '" height="768" width="100%" height="100%" style="LEFT: 0px; TOP: 0px" classid="clsid:E77E049B-23FC-4DB8-B756-60529A35FAD5" codebase="' + MyOffice.webofficcab + '#Version=6,0,5,0">'
                office += '    <param name="_ExtentX" value="6350"><param name="_ExtentY" value="6350">'
                office += '</object>'
                var office = office.replace(/scr ipt/g, 'script')
                if (!target) {
                    $('body').append(office)
                } else $(target).append(office)
            }
        }
        catch (e) {
            alert(e.description);
        }

    }

    // 获取当前的文档对象
    this.getOffice = function () {
        this.initOffice()
        return document.all.item(this.webOfficeId)
    }

    // 打开文档
    this.openDocument = function (url, docType) {
        try {
            if (!docType)
                docType = 'doc'
            this.getOffice().LoadOriginalFile(url, docType)
            this.initReady = true
        } catch (e) {
            alert(e.description);
        }
    }

    // 创建文档
    this.createDocument = function (type) {
        try {
            var doctype = "doc";
            var types = ['doc', 'xls', 'ppt']
            if (types[type]) {
                doctype = types[type];
            }
            this.openDocument('', doctype);
        } catch (e) {
            alert(e.description);
        }
    }

    // 关闭文档
    this.closeDocument = function () {
        try {
            this.getOffice().CloseDoc(0)
        } catch (e) {
            alert(e.description);
        }
        this.initReady = false
    }

    // 保存文档
    this.saveDocument = function (DocTitle, url) {
        try {
            if (this.initReady) {
                // 初始化Http引擎
                this.getOffice().HttpInit()
                this.getOffice().HttpAddPostString('docTitle', encodeURIComponent(DocTitle))
                this.getOffice().HttpAddPostCurrFile('DocContent', '')

                // 上传文件
                return this.getOffice().HttpPost(url)
            }
        } catch (e) {
            alert(e.description);
            return false
        }
    }
}

// 配置路径
MyOffice["webofficcab"] = context + '/static/cab/weboffice_v6.0.5.0.cab';
/**
 * 扩展jquery function 将表单序列化JSON
 */
(function ($) {
    $.fn.getJSON = $.fn.serializeJson = function () {
        if (this[0].nodeName != "FORM") {
            alert("请使用<form>标签使用我");
        }
        var serializeObj = {}
        var array = this.serializeArray()
        var str = this.serialize()
        $(array).each(function () {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value)
                } else {
                    serializeObj[this.name] = [serializeObj[this.name], this.value]
                }
            } else {
                serializeObj[this.name] = this.value
            }
        })
        return serializeObj
    }
})(jQuery);
// 把mydate97时间插件集成jquery插件
(function ($) {


    $.fn.mydate = $.fn.mydatePicker = function (options, arg) {
        if (typeof options == 'string') {
            var _24 = $.fn.mydatePicker.methods[options];
            if (_24) {
                return _24(this, arg)
            } else {
                return this.mydatePicker(options, arg)
            }
        }
        return this.each(function (i, target) {


            var option = $.extend({}, $.fn.mydatePicker.defaults, $.fn.mydatePicker.parseOptions(this), options);
            if (option.readonly) {
                option.readOnly = true;
            }
            // 兼容老版本(VOC的写法)
            var _fmt = $(target).data('fmt');
            if (_fmt) option.dateFmt = _fmt;
            $.data(target, 'mydate', {options: option});
            $(target).validatebox(option);
            if (!$(target).hasClass('mydate')) {
                $(target).addClass('mydate');
            }
            option.el = $(target).get(0);

            $(target).off('focus').on('focus', function (e) {
                if ($(target).prop('readonly')) {
                    setTimeout(function () {
                        $(target).trigger('mouseenter')
                    }, 200)
                    return;
                }
                var _d = $.data(e.target, 'validatebox');
                var _e = $(e.target)
                _d.validating = true
                _d.value = undefined;
                ;
                (function () {
                    if (_d.validating) {
                        if (_d.value != _e.val()) {
                            _d.value = _e.val()
                            if (_d.timer) {
                                clearTimeout(_d.timer)
                            }
                            _d.timer = setTimeout(function () {
                                $(e.target).validatebox('validate')
                            }, _d.options.delay)
                        } else {
                            // _f(e.target)
                        }
                        setTimeout(arguments.callee, 200)
                    }
                })();
            });

            option.onpicked = option.oncleared = function () {
                $(target).validatebox('validate');
                option.onSelected.call(target, $(target).val());
            }

            $(target).prop('readonly', true);

            // 绑定
            $(target).unbind('click focus').bind('click focus', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var opt = $(this).mydatePicker("options");
                if (opt.readonly || opt.readOnly) {
                    $dp.unbind(this);
                    return false;
                }
                WdatePicker(opt);

            })
        });
    }
    $.fn.mydatePicker.defaults = {
        minDate: "",
        maxDate: "",
        missingMessage: '请选择时间',
        required: false,
        autoUpdateOnChanged: true,
        autoPickDate: true,
        isShowClear: true,
        readOnly: false,
        isShowOK: true,
        // startDate: (new Date().format("yyyy-MM-dd 00:00:00")),
        dateFmt: 'yyyy-MM-dd',//yyyy-MM-dd HH:mm:ss
        ychanged: function () {
        },
        Mchanged: function () {
        },
        dchanged: function () {
        },
        Hchanged: function () {
        },
        schanged: function () {
        },
        onSelected: function () {
        },
        oncleared: function () {
        }
    }
    $.fn.mydatePicker.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.validatebox.parseOptions(target), $.parser.parseOptions(target, ['dateFmt',
            {
                readOnly: 'boolean',
                readonly: 'boolean'

            }
        ]));
    };
    $.fn.mydatePicker.methods = {
        options: function (jq) {
            return $.data(jq[0], 'mydate').options;
        },
        clear: function (jq) {
            return jq.each(function () {
                $(this).val('');
            });
        },
        readonly: function (jq, value) {
            $dp.hide();
            return jq.each(function () {
                $(this).prop('readonly', value);
                var opt = $(this).mydatePicker('options');
                opt.readOnly = value;
                opt.readonly = value;
                if (value) {
                    $(this).unbind("click focus");
                    $dp.unbind(this);
                } else {
                    $(this).mydatePicker(opt);
                }

            });

        }
    }

    // 自动创建
    $(document).ready(function () {
        $('.mydate').mydatePicker()
    });
    //ui-mydate
    $.parser.plugins.splice(0, 0, "mydate");

})(jQuery);
// 把mydate97时间插件集成双日历jquery插件
(function ($) {
    $.fn.mydoubledate = $.fn.mydoublePicker = function (options, arg) {
        if (typeof options == 'string') {
            var _24 = $.fn.mydoublePicker.methods[options];
            if (_24) {
                return _24(this, arg)
            } else {
                return this.mydoublePicker(options, arg)
            }
        }

        function newDate(dateStr) {
            return new Date(dateStr.replace(/-/g, "/"));
        }

        function Picked(dp) {
            $(document.getElementById(dp.textbox)).val(dp.cal.getNewDateStr());
            //document.getElementById(dp.textbox)['realValue']=dp.el.realValue;
            //console.log(dp.el.realValue);
        }

        function setPos(option) {
            option.panel.find(".calendar-box iframe").height(220);
            option.panel.find(".calendar-box iframe").contents().find(".WdateDiv").height(190);
            option.panel.find(".calendar-box iframe").contents().find(".WdateDiv").each(function () {
                $(this).find("#dpTime").css({"margin": "20px 0px 0px 0px"});
            });
        }

        function create(target, option) {

            if (!option) {
                option = $.extend({}, $.fn.mydoublePicker.defaults, $.parser.parseOptions(target, ['dateFmt', 'width', 'height', 'panelWidth', 'panelHeight', 'panelHeight', {
                    border: 'boolean'
                }, {min: 'number'}]));
                var dbdateId = Public.guid().replace(/-/g, '').substr(0, 6);
                option['dateCplId'] = dbdateId;
                $.data(target, 'mydoubledate', {options: option});
                var textbox = $(target).addClass('doubledate').prop('readonly', true).width(option.width);
                var fieldName = textbox.attr('name');
                if (!fieldName)
                    fieldName = '';
                textbox.removeAttr('name').attr('textboxName', fieldName);
                textbox.after('<input type="hidden" name="' + fieldName + '" value="" /><input type="hidden" name="' + fieldName + '" value="" />')
                option['textbox'] = textbox;
                option['target'] = target;
                var source = '' +
                    '<div class="doubledate-panel" style="width:390px;visibility:hidden;position: absolute;top:0px;left:2px;z-index:999999;background-color:#f0f0f0;border: 1px solid #979797;border-radius: 0 0 3px 3px;box-shadow: 0 1px 3px #00000014;">'
                    //控制区域
                    + '    <div style="margin: 10px 0px 0px 0px;height: 33px;border-bottom: 1px solid #b3b3b3">'
                    + '          <form id="form_{0}">'
                    + '   &nbsp;从&nbsp;<input type="text" id="text_star_{0}" name="dbdate0" class="textBox" style="width:85px;" value="" readonly="readonly">&nbsp;{1}&nbsp;'
                    + '                 <input type="text" id="text_end_{0}" name="dbdate1" class="textBox" style="width:85px;" value="" readonly="readonly"> ' +
                    '<span style="width:1px;  height: 22px; margin-top: 2px; background-color: #fff; border-right: 1px solid #b3b3b3; margin-left: 2px; display: inline-block; vertical-align: top"></span>'
                    + '                 <input type="button" value="确&nbsp;定" class="button-gray doubletime-ok" style="margin-left:5px\\0;margin-left:5px;width:60px;min-width:60px;padding:0px 5px;">' +
                    '                   <a class="default doubletime-clear" style="margin-left: 10px">清&nbsp;空</a>'
                    + '          </form>' +
                    '<span id="el0_{0}" style="display:none"></span><span id="el1_{0}" style="display:none"></span>'
                    + '     </div>'
                    //日历展示区域
                    + '    <div class="clearfix" style="margin: 10px 0px 0px 0px;position: relative;">'
                    + '        <div class="calendar-box" style="float:left;width:186px;">'
                    + '            <div id="div0{0}" style="width:100%;"></div>'
                    + '        </div>'
                    + '        <div class="calendar-box" style="float:right;width:186px;">'
                    + '            <div id="div1{0}" style="width:100%;"></div>'
                    + '        </div>'
                    + '    </div>'
                    + '</div>';
                source = $.format(source, dbdateId, option.splitChar);
                option.panel = $(source).appendTo('body').data('option', option);
                textbox.click(function () {
                    textbox.mydoublePicker('showPanel');
                })


                $(document).click(function (e) {
                    if (!$(e.target).closest('.doubledate-panel,.doubledate').length) {
                        option.panel.css({
                            'visibility': 'hidden'
                        })
                    }

                })
                // option.panel = $(source).appendTo(combopanel).data('option', option);

                /**
                 * 【清 空】按钮
                 */
                option.panel.find('.doubletime-clear').click(function (e) {
                    $(this).closest('.doubledate-panel').find('form').form('clear');
                    var target = $(this).closest('.doubledate-panel').data('option').target;
                    $(target).mydoublePicker('clear');
                });
                /**
                 * 【确 定】按钮
                 */
                option.panel.find('.doubletime-ok').click(function (e) {
                    var panel = $(this).closest('.doubledate-panel');
                    var option = panel.data('option');
                    var jqForm = panel.find('form');
                    var formObject = jqForm.serializeJson();
                    if (option.onBeforeSelect.call(this, formObject) == false) {
                        return false;
                    }
                    var dbdate0 = jqForm.find('[name="dbdate0"]').val();
                    var dbdate1 = jqForm.find('[name="dbdate1"]').val();
                    if (dbdate0 == '' || dbdate1 == '') {
                        option.panel.css('visibility', 'hidden');
                        return;
                    }
                    var nowDate = (new Date()).format('yyyy-MM-dd');
                    var isValid = true;
                    //判断是否是带有时分秒
                    if (/^(H+|m+|s+)/.test(option.dateFmt) && (newDate(nowDate + ' ' + dbdate0) > newDate(nowDate + ' ' + dbdate1))) {
                        isValid = false
                    }
                    else if (newDate(dbdate0) > newDate(dbdate1)) {
                        isValid = false
                    }
                    if (!isValid) {
                        layer.tips('结束日期不能早于开始日期', jqForm.find('[name="dbdate1"]')[0], {
                            tips: [4, '#ba3e17']
                        });
                        return false;
                    }
                    option.panel.css('visibility', 'hidden');
                    var values = [formObject.dbdate0, formObject.dbdate1];
                    $(option.target).mydoublePicker('setValue', values);
                    option.onSelect.call(this, values);
                });


                var picker1 = {}, picker2 = {};
                //picker1.vel = "text_star_" + option.dateCplId;
                picker1.textbox = "text_star_" + option.dateCplId;
                picker1.eCont = "div0" + option.dateCplId;
                //picker1.startDate = dbdate[0];

                picker1.dateFmt = option.dateFmt;
                picker1.minDate = option.minDate;
                picker1.maxDate = option.maxDate;
                picker1.onpicked = Picked;
                picker1.ychanged = Picked;
                picker1.Mchanged = Picked;
                picker1.dchanged = Picked;
                picker1.Hchanged = Picked;
                picker1.mchanged = Picked;
                picker1.schanged = Picked;

                //picker2.vel = "text_end_" + option.dateCplId;
                picker2.textbox = "text_end_" + option.dateCplId;
                picker2.eCont = "div1" + option.dateCplId;
                //picker2.startDate = dbdate[1];

                picker2.dateFmt = option.dateFmt;
                picker2.minDate = option.minDate;
                picker2.maxDate = option.maxDate;
                picker2.onpicked = Picked;
                picker2.ychanged = Picked;
                picker2.Mchanged = Picked;
                picker2.dchanged = Picked;
                picker2.Hchanged = Picked;
                picker2.mchanged = Picked;
                picker2.schanged = Picked;

                option['picker1'] = picker1;
                option['picker2'] = picker2;
            }
            else {
                $dp.unbind(option.picker1.eCont);
                $dp.unbind(option.picker2.eCont);
                $(target).mydoublePicker('clear');
                $(option.panel).find('form').form('clear');

            }
            option.panel.height(option.panelHeight);

            var values = textbox.val().split(',')
            textbox.mydoublePicker('setValue', values);

            $.extend(option.picker1, {dateFmt: option.dateFmt, minDate: option.minDate, maxDate: option.maxDate})
            $.extend(option.picker2, {dateFmt: option.dateFmt, minDate: option.minDate, maxDate: option.maxDate})


            option.full = false;
            if (/(H+|m+|s+)/.test(option.dateFmt)) {
                option.full = true;
                option.panel.height(option.panelHeight + 30);
            }
            if (target.setTimePos) {
                clearTimeout(target.setTimePos);
            }
            target.setTimePos = setInterval(function () {
                setPos(option);
            }, 200);

            setTimeout(function () {
                WdatePicker(option.picker1);
                WdatePicker(option.picker2);
            })
        }


        return this.each(function () {

            var option = $(this).mydoublePicker('options');
            if (!option) {
                create(this, null);
            } else {
                $.extend(option, options);
                create(this, option);
            }


        })
    }

    $.fn.mydoubledate.defaults = $.fn.mydoublePicker.defaults = {
        minDate: "",
        maxDate: "",
        dateFmt: 'yyyy-MM-dd',//yyyy-MM-dd HH:mm:ss
        missingMessage: '请选择时间',
        required: false,
        splitChar: '至',
        editable: false,
        height: 32,
        width: 200,
        panelWidth: 390,
        panelHeight: 250,
        onBeforeSelect: function () {
        },
        onSelect: function () {
        }
    }

    $.fn.mydoubledate.methods = $.fn.mydoublePicker.methods = {
        options: function (jq) {
            if (!$.data(jq[0], 'mydoubledate')) {
                return null;
            }
            return $.data(jq[0], 'mydoubledate').options;
        },
        /**
         *
         * @param jq
         * @param values Array
         * @returns {*}
         */
        setValue: function (jq, values) {
            return jq.each(function () {
                var option = $(this).mydoublePicker("options");
                if (typeof values == 'string') {
                    values = values.split(',');
                }
                var text = values.join(option.splitChar);
                $(this).val(text);
                if (values.length != 2) {
                    values = ['', ''];
                }
                option.values = values;
                $(this).next().val(values[0]).next().val(values[1]);
                option['picker1'].startDate = values[0];
                option['picker2'].startDate = values[1];
                option.panel.find('form').form('load', {'dbdate0': values[0], 'dbdate1': values[1]});
                $(this).mydoublePicker('setDate', values);
            })
        },
        getDate: function (jq, value) {
            return $.data(jq[0], 'date');
        },
        setDate: function (jq, value) {
            return jq.each(function () {
                $.data(this, 'date', value);
            })
        },
        getValue: function (jq) {
            var option = $(jq).mydoublePicker("options");
            return option.values;
        },
        clear: function (jq) {
            return jq.each(function () {
                $(this).mydoublePicker('setValue', ["", ""]);
                $(this).val('');
                $(this).combo('panel').find(':text').val('');
                $(this).combo('clear');
                $(this).combo('hidePanel');


            })
        },
        readonly: function (jq, value) {
            return jq.each(function () {
                $(this).combo('readonly', value);
            });
        },
        showPanel: function (jq) {
            function getTop() {
                var top = option.textbox.offset().top + option.textbox.outerHeight();
                if (top + option.panel.outerHeight() > $(window).outerHeight() + $(document).scrollTop()) {
                    top = option.textbox.offset().top - option.panel.outerHeight();
                }
                if (top < $(document).scrollTop()) {
                    top = option.textbox.offset().top + option.textbox.outerHeight();
                }
                return top;
            }

            var option = $(jq).mydoublePicker("options");
            option.closed = false;
            option.panel.css({
                'visibility': ''
            });
            (function () {
                if (!option.closed) {
                    option.panel.css({
                        left: option.textbox.offset().left,
                        top: getTop()
                    })
                    setTimeout(arguments.callee, 200);
                }
            })();

        },
        hidePanel: function (jq) {
            var option = $(jq).mydoublePicker("options");
            option.closed = true;
            option.panel.css({
                'visibility': 'hidden'
            })
        }
    }
    // 自动创建
    $(document).ready(function () {
        $('.mydoubledate').mydoublePicker()
    });
    //ui-mydoubledate
    $.parser.plugins.splice(0, 0, "mydoubledate");
    $.fn.form.defaults.fieldTypes.splice(0, 0, "mydoubledate");
})(jQuery);
/*
 *扩展jquery 字符串format函数
 */
(function ($) {
    $.format = function (source, params) {
        if (arguments.length == 1)
            return function () {
                var args = $.makeArray(arguments)
                args.unshift(source)
                return $.format.apply(this, args)
            }
        if (arguments.length > 2 && params.constructor != Array) {
            params = $.makeArray(arguments).slice(1)
        }
        if (params.constructor != Array) {
            params = [params]
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp('\\{' + i + '\\}', 'g'), n)
        })
        return source
    }
}(jQuery));
/**
 * 自定义tab
 */
(function ($) {
    $.fn.jtabs = function (opt) {
        return this.each(function (i, tb) {
            var _defaults = {
                tabSelector: 'li',
                panelSelector: '',
                fit: true,
                activeCls: 'active',
                onSelect: null,
                onComplate: null,
                onResize: null

            }

            var options = $.extend(_defaults, opt)

            $(tb).find(options.tabSelector).click(function (e) {
                e.preventDefault()
                $(tb).find(options.tabSelector).removeClass(options.activeCls).eq($(this).index()).addClass(options.activeCls)
                $(tb).find(options.panelSelector).hide().eq($(this).index()).show()
                if (options.onSelect)
                    options.onSelect.call(this, $(this).index(), $(this).text())
            })

            function resize() {
                setTimeout(function () {
                    $(tb).width(function () {
                        return $(this).parent().width()
                    }).height(function () {
                        if ($(this).siblings().length > 0) {
                            var siblingH = 0
                            $(this).siblings().each(function () {
                                siblingH += $(this).height()
                            })
                            if ($(this).parent().get(0).tagName == 'BODY')
                                return $(window).height() - siblingH

                            return $(this).parent().height() - siblingH
                        }

                        return $(this).parent().height()
                    }).children().height(function (index, height) {
                        if (index > 0) {
                            $(this).css({
                                'position': 'relative',
                                // "top": $(this).parent().children().first().height()+"px",
                                'top': '0px',
                                'overflow-y': 'auto'
                            })
                            return $(this).parent().height() - $(this).parent().children().first().height()
                        }
                        $(this).css({'position': 'relative', 'top': '0px', 'left': '0px'})

                        return $(this).height()
                    }).width(function () {
                        return $(this).parent().width()
                    })
                    if (options.onResize)
                        options.onResize.call($(tb), $(tb).find(options.panelSelector).width(), $(tb).find(options.panelSelector).height())
                }, 200)
            }

            resize()
            if (options.onComplate)
                setTimeout(function () {
                    options.onComplate.call($(tb), null)
                }, 200)
            $(window).resize(function () {
                resize()
            })
        })
    }
})(jQuery);
/*
 *定义小分页控件
 *使用方法
 * $(selector).smallPagination({total: @Number,pageNumber: @Number,onSelectPage:function(pageNumber, pageSize){}})
 */
(function ($) {
    $.fn.smallPagination = function (options) {
        var _default = {
            total: 1,
            pageSize: 10,
            pageNumber: 1,
            width: 200,
            onSelectPage: function (pageNumber, pageSize) {
            }
        }

        var opt = $.extend(_default, options)

        var target = $(this)

        var _w = opt.width
        if (typeof opt.width == 'number')
            _w = _w + 'px'
        target.css('width', _w)
        target.addClass('ui-smallPagination')
        var createagination = function (opt) {
            var pageStr = $.format('<div class="ui-smallPagination-btns"><span class="arrow-left ui-prev"></span><span class="text">第{0}页</span><span class="arrow-right  ui-next"></span><span class="total">共{1}页</span></div>', opt.pageNumber, opt.total)
            var _pagination = target.html(pageStr)
            if (opt.pageNumber > 0 && opt.pageNumber != 1) {
                target.find('.ui-prev').off('click').click(function () {
                    opt.pageNumber--
                    if (opt.pageNumber <= 0)
                        opt.pageNumber = 1
                    createagination(opt)
                    opt.onSelectPage(opt.pageNumber, opt.pageSize)
                })
            }
            if (opt.total > 0 && opt.total != opt.pageNumber)
                target.find('.ui-next').off('click').click(function () {
                    opt.pageNumber++
                    if (opt.pageNumber >= opt.total)
                        opt.pageNumber = opt.total
                    createagination(opt)
                    opt.onSelectPage(opt.pageNumber, opt.pageSize)
                })
        }

        createagination(opt)
        return {
            target: target,
            getPage: function () {
                return {pageNumber: opt.pageNumber, pageSize: opt.pageSize}
            }
        }
    }
}(jQuery));
/**
 * 模版分页控件
 */
(function ($) {
    // 用模版话引擎创建datagridlist
    $.fn.templateList = function (opt, args) {
        if (typeof opt == 'string') {
            var _24 = $.fn.templateList.methods[opt]
            if (_24) {
                return _24(this, args)
            } else {
                return this.templateList(opt, args)
            }
        }
        var options = $.extend({}, $.fn.templateList.defaults, opt)

        return this.each(function (i, templ) {
            $.data(this, 'options', options)
            var page = {}
            page[options['pageSizeField']] = options.pageSize
            page[options['pageNumberField']] = options.pageNumber
            $(templ).templateList('load', page)
        })
    }

    $.fn.templateList.defaults = {
        // 一个URL从远程站点请求数据
        url: null,
        // 数据加载array,object
        data: null,
        // 模版ID
        tempId: null,
        // 请求参数
        param: null,
        // 分页属性
        pagination: true,
        onSelectPage: function (pageNumber, pageSize) {
        },
        total: 0,
        pagetarget: null,
        pageCls: 'tcdPageCode',
        pageSize: 10,
        pageNumber: 1,
        pageSizeField: 'pageSize',
        pageNumberField: 'pageNo',
        // 返回过滤数据显示
        loadFilter: function (data) {
        },
        onBeforeLoad: function () {
        },
        // 加载完成事件
        onLoadSuccess: function (data) {
        }
    }

    $.fn.templateList.defaults[$.fn.templateList.defaults.pageSizeField] = $.fn.templateList.defaults.pageSize
    $.fn.templateList.defaults[$.fn.templateList.defaults.pageNumberField] = $.fn.templateList.defaults.pageNumber

    $.fn.templateList.methods = {
        load: function (jq, page) {
            var options = $(jq).templateList('options')

            if (!options.tempId) {
                alert('没有配置模版id')
                return false
            }

            options[options['pageSizeField']] = page[options['pageSizeField']]
            options[options['pageNumberField']] = page[options['pageNumberField']]

            var queryParam = $.extend({}, options.param, page)
            if (options.url) {
                if (options.onBeforeLoad.call(jq, null) == false) {
                    return false
                }
                Public.post(options.url, queryParam, function (response) {
                    var filter = options.loadFilter(response)
                    var data = (!filter ? response : filter)
                    try {
                        var html = ''
                        if (data != 'null')
                            html = template(options.tempId, data)
                        // 解析数据
                        $(jq).empty().html(html)
                    } catch (e) {
                        alert(e)
                    }

                    // 是否显示分页
                    if (options.pagination) {
                        var total = response.data.totalCount
                        var pageTarget = options.pagetarget == null ? $('<div/>').appendTo(jq) : $(options.pagetarget)
                        // 创建分页
                        $(pageTarget).addClass(options.pageCls).paginationM({
                            totalData: total, // 数据总条数
                            pageCount: (Math.ceil(total / queryParam[options['pageSizeField']])), // 总页数
                            showData: (queryParam[options['pageSizeField']]), // 每页显示的条数
                            current: (queryParam[options['pageNumberField']]), // 当前第几页
                            jump: true,
                            coping: true,
                            isHide: false,
                            keepShowPN: true,
                            callback: function (p) {
                                options[options['pageSizeField']] = page[options['pageSizeField']] = options.pageSize
                                options[options['pageNumberField']] = page[options['pageNumberField']] = p
                                $(jq).templateList('load', page)
                                options.onSelectPage(options[options['pageSizeField']], p)
                            }
                        })
                    }

                    options.onLoadSuccess.call(jq, response, filter)
                })
            }
            if (options.data) {
                var filter = options.loadFilter(options.data)
                var data = (!filter ? options.data : filter)
                try {
                    var html = ''
                    if (data != 'null')
                        html = template(options.tempId, data)
                    // 解析数据
                    $(jq).empty().html(html)
                } catch (e) {
                    alert(e)
                }

                // 是否显示分页
                if (options.pagination) {
                    var total = options.data.totalCount
                    var pageTarget = options.pagetarget == null ? $('<div/>').appendTo(jq) : $(options.pagetarget)
                    // 创建分页
                    $(pageTarget).addClass(options.pageCls).paginationM({
                        totalData: total,
                        showData: (queryParam[options['pageSizeField']]),
                        current: (queryParam[options['pageNumberField']]),
                        pageCount: (Math.ceil(total / queryParam[options['pageSizeField']])),
                        jump: true,
                        coping: true,
                        isHide: false,
                        keepShowPN: true,
                        callback: function (p) {
                            options[options['pageSizeField']] = page[options['pageSizeField']] = options.pageSize
                            options[options['pageNumberField']] = page[options['pageNumberField']] = p
                            $(jq).templateList('load', page)
                            options.onSelectPage(options[options['pageSizeField']], p)
                        }
                    })
                }

                options.onLoadSuccess.call(jq, options.data, filter)
            }

            return jq
        },

        reload: function (jq, param) {
            var options = $(jq).templateList('options')
            // 合并参数
            $.extend(options.param, param)
            var page = {}
            page[options['pageSizeField']] = options.pageSize
            page[options['pageNumberField']] = 1
            return $(jq).templateList('load', page)
        },
        options: function (jq) {
            return $.data(jq.get(0), 'options')
        }
    }
})(jQuery);


/**
 * 模版分页控件
 */
(function ($) {
    /**
     * 利用模版解析的datagrid
     * 支持标准的数据格式是{"total","rows":[]}或者[{},{},{},.....]
     * @param opt
     * @param args
     * @returns {*}
     */
    $.fn.tempGrid = function (options, arg) {
        if (typeof options == 'string') {
            var fn = $.fn.tempGrid.methods[options];
            if (fn) {
                return fn(this, arg);
            } else {
                return this.tempGrid(options, arg);
            }
        }
        options = options || {};

        return this.each(function () {
            var option = $.extend({}, $.fn.tempGrid.defaults, options);
            var page = {}
            page[option['pageSizeField']] = option.pageSize;
            page[option['pageNumberField']] = option.pageNumber;
            //提前编译模版
            var render = template.compile($(option.tempId).text());
            $.data(this, 'tempGrid', {'option': option, 'page': page, 'render': render, pager: null, body: null});
            $(this).tempGrid('load', option.data);
        })
    }

    $.fn.tempGrid.defaults = {
        method: 'POST',
        // 一个URL从远程站点请求数据
        url: null,
        // 数据加载array,object
        data: null,
        // 模版ID
        tempId: null,
        // 请求参数
        queryParams: null,
        // 分页属性
        pagination: true,
        onSelectPage: function (pageNumber, pageSize) {
        },
        total: 0,
        pagetarget: null,
        pageCls: 'tcdPageCode',
        pageSize: 10,
        pageNumber: 1,
        pageSizeField: 'pageSize',
        pageNumberField: 'pageNo',
        // 返回过滤数据显示
        loadFilter: function (data) {
        },
        onBeforeLoad: function () {
        },
        // 加载完成事件
        onLoadSuccess: function (data) {
        }
    }

    $.fn.tempGrid.defaults[$.fn.tempGrid.defaults.pageSizeField] = $.fn.tempGrid.defaults.pageSize;
    $.fn.tempGrid.defaults[$.fn.tempGrid.defaults.pageNumberField] = $.fn.tempGrid.defaults.pageNumber;

    $.fn.tempGrid.methods = {
        load: function (jq, data) {
            var options = $(jq).tempGrid('options');
            if (!typeof options.render == 'function') {
                alert('没有配置模版id')
                return false
            }


            /**
             * 解析数据
             * @param response
             * @private
             */
            function _load(response) {
                var filter = options.option.loadFilter(response);
                var data = (!filter ? response : filter);
                var html = '';
                try {
                    if (isArray(data)) {
                        data = {"total": data.length, "rows": data};
                    }
                    //渲染模版
                    html = options.render(data);
                    if (!options.body) {
                        options.body = $(jq).append('<div style="width:100%;height:100%;"></div>')
                    }
                    options.body.empty().html(html)
                } catch (e) {
                    alert(e)
                }

                // 是否显示分页
                if (options.option.pagination) {

                    var total = data.total;
                    if (!options.pager) {
                        var pageTarget = options.pagetarget == null ? $('<div/>').insertAfter(options.body) : $(options.pagetarget);
                        // 创建分页
                        options.pager = $(pageTarget).addClass(options.option.pageCls);
                    }
                    options.pager.paginationM({
                        totalData: total, // 数据总条数
                        pageCount: (Math.ceil(total / queryParam[options.option['pageSizeField']])), // 总页数
                        showData: (options.page[options.option['pageSizeField']]), // 每页显示的条数
                        current: (options.page[options.option['pageNumberField']]), // 当前第几页
                        jump: true,
                        coping: true,
                        isHide: false,
                        keepShowPN: true,
                        callback: function (p) {
                            options.page[options.option['pageSizeField']] = options.option.pageSize;
                            options.page[options.option['pageNumberField']] = p;
                            $(jq).tempGrid('load', null)
                            options.option.onSelectPage(options.page[options.option['pageSizeField']], p)
                        }
                    });
                }

                options.option.onLoadSuccess.call(jq, response, filter)
            }

            if (options.option.url) {
                if (options.option.onBeforeLoad.call(jq, null) == false) {
                    return false
                }
                var _method = options.option.method.toLocaleLowerCase() == 'get' ? 'get' : 'post';
                var queryParam = $.extend({}, options.option.queryParams, options.page);
                Public[_method](options.option.url, queryParam, function (response) {
                    _load(response);
                })
            } else {
                if (data) {
                    _load(data);
                }
            }

            return jq
        },

        reload: function (jq, params) {
            var options = $(jq).tempGrid('options');
            var page = options.page;
            page[options.option['pageNumberField']] = 1;
            // 合并参数
            $.extend(options.option.queryParams, params, page);
            return $(jq).tempGrid('load', null);
        },
        options: function (jq) {
            if (!$.data(jq[0], 'tempGrid'))
                return null;
            return $.data(jq[0], 'tempGrid');
        }
    }
})(jQuery);

/**
 * 搜索按钮
 */
(function ($) {
    $.fn.myseach = function (options, arg) {
        if (typeof options == 'string') {
            var fn = $.fn.myseach.methods[options];
            if (fn) {
                return fn(this, arg);
            } else {
                return this.myseach(options, arg);
            }
        }
        options = options || {};
        return this.each(function () {
            var option = $.extend({}, $.fn.myseach.defaults, $.fn.myseach.parseOptions(this), options);
            var target = $(this).addClass('mysearchbox-text');
            var old = $.data(this, 'myseach');
            var styles = target.attr('style');
            target.removeAttr('style');
            if (old) {
                //$.extend(option,old.options);
                styles = old.style;
                $(this).unwrap().next().remove();
            }
            var html = '\n' +
                '<span class="mysearchbox clearfix">' +
                //'       <input type="text" class="mysearchbox-text" />' +
                '       <span class="mysearchbox-addon" style="height:100%"><a href="javascript:;" class="mysearchbox-button" style="line-height:' + parseInt(option.height) + 'px">' + option.text + '</a></span>' +
                '</span>\n';


            var contaniner = $(html).insertAfter(target).width(option.width).height(option.height).addClass(option.cls);
            target.insertBefore(contaniner.children());

            if (styles) {
                var ssArray = styles.split(';');
                for (var j = 0; j < ssArray.length; j++) {
                    var clsItem = ssArray[j];
                    var clsAtts = clsItem.split(':');
                    if (clsAtts.length == 2) {
                        contaniner.css(clsAtts[0], clsAtts[1]);
                    }
                }
                target.removeProp('style');
                /*var s = $.trim(styles);
                if (s){
                    if (s.substring(0, 1) != '{'){
                        s = '{' + s + '}';
                    }
                    var cssObject = (new Function('return ' + s))();
                    contaniner.css(cssObject);
                }*/
            }
            //缓存对象
            $.data(target[0], 'myseach', {
                'options': $.extend(option, {
                    'style': styles,
                    'contaniner': contaniner,
                    'textbox': target
                })
            });


            var seachButton = contaniner.find('.mysearchbox-button').click(function (e) {
                option.onClick.call(target, e);
            });
            target.width(option.width - seachButton.parent().outerWidth(true) - 10)
            //console.log(option);
            //如果是自适应宽度
            if (option.fit) {
                var diff = (contaniner.parent().outerWidth(true) - contaniner.parent().width());
                $(target).myseach('resize', (contaniner.parent().width() - diff));
                $(window).resize(function () {
                    $(target).myseach('resize', (contaniner.parent().width() - diff));
                })
            }
        })
    }

    $.fn.myseach.defaults = {
        fit: false,
        //默认等待输入内容
        text: '搜索',
        placeholder: '',
        disabled: false,
        cls: '',
        width: 200,
        height: 32,
        onClick: function () {

        }
    }

    $.fn.myseach.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.validatebox.parseOptions(target), $.parser.parseOptions(target, ['text', 'cls', 'placeholder',
            {
                fit: 'boolean',
                disabled: 'boolean',
                width: 'number'
            }
        ]));
    };

    $.fn.myseach.methods = {
        textbox: function (jq) {
            var option = $(jq).myseach('options');
            if (option) {
                return option.textbox;
            } else
                return null;
        },
        options: function (jq) {
            if ($.data(jq[0], 'myseach'))
                return $.data(jq[0], 'myseach').options;
            else return null;
        },
        setValue: function (jq, val) {
            return jq.each(function () {
                $(this).val(val);
            })
        },
        getValue: function (jq) {
            return jq.val();
        },
        clear: function (jq) {
            return jq.each(function () {
                $(this).val('');
            })
        },
        resize: function (jq, width, height) {
            var option = $(jq).myseach('options');
            if (option) {
                option.contaniner.width(width);
                var textbox = option.textbox;
                var _textbox_width = width - textbox.next().outerWidth() - (textbox.innerWidth() - textbox.width());
                textbox.width(_textbox_width);
            }
        }
    }


    $.parser.plugins.splice(0, 0, "myseach");
})(jQuery);

