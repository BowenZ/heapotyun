(function() {
    /*$(window).click(function(event) {
        alert($(window).width()+'--'+$(window).height());
    });*/
    /**
     * 羽化canvas图片
     * @param  {dom} canvas 
     * @param  {Number} width  图片宽度
     * @param  {Number} height 图片高度
     * @param  {Number} size   羽化范围
     * @param  {String} color  羽化颜色
     */
    var $window = $(window);
    function feathering(canvas, width, height, size, color) {
        var conv, dist, idata, p, pdata, x, y, _i, _j, _k, _l, _ref;
        if (size == null) {
            size = 20;
        }
        if (color == null) {
            color = [0, 0, 0];
        }
        idata = canvas.getContext("2d").getImageData(0, 0, width, height);
        pdata = idata.data;
        conv = function(x, y, p) {
            var idx;
            if (p < 0) {
                p = 0;
            }
            if (p > 1) {
                p = 1;
            }
            idx = (y * width + x) * 4;
            pdata[idx + 0] = p * pdata[idx + 0] + (1 - p) * color[0];
            pdata[idx + 1] = p * pdata[idx + 1] + (1 - p) * color[1];
            return pdata[idx + 2] = p * pdata[idx + 2] + (1 - p) * color[2];
        };
        dist = function(xa, ya, xb, yb) {
            return Math.sqrt((xb - xa) * (xb - xa) + (yb - ya) * (yb - ya));
        };
        for (x = _i = 0; _i < width; x = _i += 1) {
            for (y = _j = 0; _j < size; y = _j += 1) {
                p = y / size;
                if (x < size) {
                    p = 1 - dist(x, y, size, size) / size;
                }
                conv(x, y, p);
            }
        }
        for (y = _k = _ref = 0 + size; _k < height; y = _k += 1) {
            for (x = _l = 0; _l < size; x = _l += 1) {
                p = x / size;
                conv(x, y, p);
            }
        }
        return canvas.getContext("2d").putImageData(idata, 0, 0);
    };

    /**
     * 加载并处理顶部菜单图片
     */
    function loadTitleImg(callback) {
        var img = new Image();
        var canvas = document.createElement('canvas');
        img.onload = function() {
            ColorAnalysis.getColor(img, function(result) {
                var thisColor;
                var rgb = result.bgColor.replace(/\(|\)|rgb|\s/g, '').split(/,/);
                thisColor = result.bgColor;
                if (rgb[0] > 220 && rgb[1] > 220 && rgb[2] > 220) {
                    // thisColor = result.fgColor[0];
                    $('nav').find('h1').css('color', result.fgColor[0]);
                    $('nav').find('ul').css('color', result.fgColor[1]).find('li').css('border-bottom-color', result.fgColor[1]);;
                }
                canvas.height = $('nav').height() * 2;
                // console.log(canvas.height / img.height * img.width);
                canvas.width = canvas.height / img.height * img.width;
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                feathering(canvas, canvas.width, canvas.height, 80, rgb);
                $('nav .bg-img').css('background-color', thisColor).append(canvas);
                $('nav ul').css('background-color', thisColor);
                callback && callback(thisColor);
            });
        }
        img.src = $('nav').find('.bg-img').data('src');
    }

    var titleColor;
    loadTitleImg(function(color){
        titleColor = color;
    });

    /**
     * 循环处理文章列表背景色
     */
    $('.list-item').each(function(index, el) {
        var img = new Image();
        var canvas = document.createElement('canvas');

        img.onload = function() {
            ColorAnalysis.getColor(this, function(result) {
                var thisColor;
                var rgb = result.bgColor.replace(/\(|\)|rgb|\s/g, '').split(/,/);
                thisColor = result.bgColor;
                // console.log(rgb, index);
                if (rgb[0] > 220 && rgb[1] > 220 && rgb[2] > 220) {
                    // thisColor = result.fgColor[0];
                    $(el).find('h3').css('color', result.fgColor[0]);
                    $(el).find('.sub-list').css('color', result.fgColor[1]).find('li').css('border-bottom-color', result.fgColor[1]);;
                }
                //else {
                //     thisColor = result.bgColor;
                // }

                canvas.height = $(el).height() * 2;
                canvas.width = canvas.height / img.height * img.width;
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                feathering(canvas, canvas.width, canvas.height, 80, rgb);
                $(el).find('.bg-img').css('background-color', thisColor).append(canvas);

            });
        }
        img.src = $(el).find('.bg-img').data('src');
    });

    (function bindEvent() {
        /**
         * 滚动固定导航栏
         */
        $window.on('scroll', function() {
            if ($('nav')[0].getClientRects()[0].top < -($('nav').height()-$('nav ul').height())) {
                $('nav ul').addClass('fixed').css('background-color', titleColor);
            } else {
                $('nav ul').removeClass('fixed').css('background-color', '');
            }
        });
    }).call(this);

})();
