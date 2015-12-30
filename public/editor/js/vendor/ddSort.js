/*
 ** ddSort.js  http://zbw.name
 */

(function($) {
    window.touchEvent = (function() {

        var eventTouchStartType,
            eventTouchLeaveType,
            eventTouchMoveType,
            eventTouchEnterType,
            eventTouchEndType;

        if (window.navigator.pointerEnabled) {
            eventTouchStartType = 'pointerdown';
            eventTouchLeaveType = 'pointerout';
            eventTouchMoveType = 'pointermove';
            eventTouchEnterType = 'pointerover';
            eventTouchEndType = 'pointerup';
        } else if (window.navigator.msPointerEnabled) {
            eventTouchStartType = 'MSPointerDown';
            eventTouchLeaveType = 'MSPointerOut';
            eventTouchMoveType = 'MSPointerMove';
            eventTouchEnterType = 'MSPointerOver';
            eventTouchEndType = 'MSPointerUp';
        } else if ('ontouchend' in window) {
            eventTouchStartType = 'touchstart';
            eventTouchLeaveType = 'touchleave ';
            eventTouchMoveType = 'touchmove';
            eventTouchEnterType = 'touchstart';
            eventTouchEndType = 'touchend touchcancel';
        } else {
            eventTouchStartType = 'mousedown';
            eventTouchLeaveType = 'mouseout';
            eventTouchMoveType = 'mousemove';
            eventTouchEnterType = 'mouseover';
            eventTouchEndType = 'mouseup';
        }

        return {
            start: 'mousedown', //eventTouchStartType,
            leave: 'mouseout', //eventTouchLeaveType,
            move: 'mousemove', //eventTouchMoveType,
            enter: 'mouseover', //eventTouchEnterType,
            end: 'mouseup' //eventTouchEndType
        };
    })();
    $.fn.ddSort = function(userOptions) {
        var $container = $(this);
        var options = $.extend({}, $.fn.ddSort.defaultOptions, userOptions);
        var binded = false;
        var $targetBox = null;

        if (!options.dragSelector) {
            $container.children().off(touchEvent.start).on(touchEvent.start, _dragItem);
        } else {
            $container.find(options.dragSelector).off(touchEvent.start).on(touchEvent.start, _dragItem);
        }

        function _dragItem(e) {
            if (e.which != 1 || $(e.target).is(options.dragSelectorExclude) || binded) return; // 排除非左击和表单元素
            e.preventDefault(); // 阻止选中文本

            var $_this = options.dragTarget == options.dragSelector ? $(this) : $(this).parents(options.dragTarget); // 点击选中块
            var startX = e.pageX;
            var startY = e.pageY;
            var thisWidth = $_this.outerWidth();
            var thisHeight = $_this.outerHeight();
            var thisOffset = $_this.offset();
            var thisLeft = thisOffset.left;
            var thisTop = thisOffset.top;
            binded = true;
            $targetBox = null;
            var moved = 0;
            var $dashedBox

            // 绑定mousemove事件
            $(document).on(touchEvent.move, function(e) {
                e.preventDefault();
                if (moved == 2) {
                    // 添加虚线框
                    $dashedBox = $('<div id="dashedBox"></div>').css({
                        "border": "2px dashed #ccc",
                        "height": $_this.outerHeight(),
                        "width": $_this.outerWidth(),
                        "display": $_this.css('display'),
                        "margin": $_this.css('margin')
                    });
                    $_this.before($dashedBox);

                    // 保持原来的宽高
                    $_this.css({
                        "width": thisWidth,
                        "height": thisHeight,
                        "position": "absolute",
                        'margin': 0,
                        "z-index": 999,
                        "left": thisLeft - options.leftOffset,
                        "top": thisTop - options.topOffset,
                        'transform': 'scale(1.03)',
                        'box-shadow': '2px 2px 5px rgba(0,0,0,.6)'
                    });
                }
                moved++;
                // 移动选中块
                if (moved > 2) {
                    var l = thisLeft + e.pageX - startX - options.leftOffset;
                    var t = thisTop + e.pageY - startY - options.topOffset;
                    $_this.css({
                        "left": l,
                        "top": t
                    });

                    // 选中块的中心坐标
                    var ml = l + thisWidth / 2;
                    var mt = t + thisHeight / 2;

                    // 遍历所有块的坐标
                    $container.children().not($_this).not($dashedBox).each(function(i) {
                        var obj = $(this);
                        var targetOffset = obj.offset();
                        var a1 = targetOffset.left;
                        var a2 = targetOffset.left + obj.outerWidth();
                        var a3 = targetOffset.top;
                        var a4 = targetOffset.top + obj.outerHeight();

                        // 移动虚线框
                        if (a1 < ml && ml < a2 && a3 < mt && mt < a4) {
                            if (!$targetBox) {
                                $targetBox = obj;
                                if (!obj.next("#dashedBox").length) {
                                    $dashedBox.insertAfter(this);
                                } else {
                                    $dashedBox.insertBefore(this);
                                }
                                return;
                            }

                        } else if ($targetBox && $targetBox.is(obj)) {
                            $targetBox = null;
                        }
                    });
                }
            });

            // 绑定mouseup事件
            $(document).on(touchEvent.end, function(event) {
                event.preventDefault();
                $(document).off(touchEvent.end).off(touchEvent.move);
                $_this.off(touchEvent.end);
                if (moved > 2) {
                    // 检查容器为空的情况
                    $container.each(function() {
                        var obj = $(this).children();
                        var len = obj.length;
                        if (len == 1 && obj.is($_this)) {
                            $("<div></div>").appendTo(this).attr("class", "tmpBox").css({
                                "height": 100
                            });
                        } else if (len == 2 && obj.is(".tmpBox")) {
                            $(this).children(".tmpBox").remove();
                        }
                    });

                    // 拖拽回位，并删除虚线框
                    var targetOffset = $dashedBox.offset();
                    $_this.animate({
                        "left": targetOffset.left,
                        "top": targetOffset.top - options.topOffset
                    }, 100, function() {
                        $_this.removeAttr("style");
                        $dashedBox.replaceWith($_this);
                        
                    });
                    options.dragEndCallback.call();
                }
                moved = 0;
                binded = null;
                return false;
            });
        }
    }

    $.fn.ddSort.defaultOptions = {
        dragTarget: "",
        dragSelector: "",
        dragSelectorExclude: "input, textarea",
        topOffset: 0,
        leftOffset: 0,
        dragEndCallback: function() {}
    };
})(jQuery);
