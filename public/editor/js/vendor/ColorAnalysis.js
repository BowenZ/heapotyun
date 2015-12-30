/*
 ** ColorAnalysis.js  http://zbw.name
 ** Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */

var ColorAnalysis = (function(window, $, MMCQ) {

    function _getColorDistance(a, b) {
        return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2);
    };

    function _getColorMap(canvas, sx, sy, w, h, nc) {
        var index, indexBase, pdata, pixels, x, y, _i, _j, _ref, _ref1;
        if (nc == null) {
            nc = 8;
        }
        pdata = canvas.getContext("2d").getImageData(sx, sy, w, h).data;
        pixels = [];
        for (y = _i = sy, _ref = sy + h; _i < _ref; y = _i += 1) {
            indexBase = y * w * 4;
            for (x = _j = sx, _ref1 = sx + w; _j < _ref1; x = _j += 1) {
                index = indexBase + (x * 4);
                pixels.push([pdata[index], pdata[index + 1], pdata[index + 2]]);
            }
        }
        return (new MMCQ).quantize(pixels, nc);
    };

    function _rgbToCssString(color) {
        return "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
    };

    var _config = {
        region: {
            startX: 0,
            startY: 0,
            endX: 1,
            endY: 1
        },
        num: 4,
        fgColor: true
    };

    function getColor(img, config, callback) {
        $.extend(_config, config);

        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            result = {},
            image = new Image();
        $(image).on('load', function() {
            image.height = Math.round(image.height * (300 / image.width));
            image.width = 300;
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            var bgColorMap = _getColorMap(canvas, image.width * _config.region.startX, image.height * _config.region.startY, image.width * _config.region.endX, image.height * _config.region.endY, _config.num);

            bgPalette = bgColorMap.cboxes.map(function(cbox) {
                return {
                    count: cbox.cbox.count(),
                    rgb: cbox.color
                };
            });

            bgPalette.sort(function(a, b) {
                return b.count - a.count;
            });

            result.palette = [];
            bgPalette.forEach(function(item) {
                result.palette.push(_rgbToCssString(item.rgb));
            });

            result.bgColor = _rgbToCssString(bgPalette[0].rgb);

            if (_config.fgColor) {
                var maxDist = 0,
                    fgColor,
                    fgColor2;
                for (_i = 0, _len = bgPalette.length; _i < _len; _i++) {
                    color = bgPalette[_i];
                    dist = _getColorDistance(bgPalette[0].rgb, color.rgb);
                    if (dist > maxDist) {
                        maxDist = dist;
                        fgColor = color.rgb;
                    }
                }
                maxDist = 0;
                for (_j = 0, _len1 = bgPalette.length; _j < _len1; _j++) {
                    color = bgPalette[_j];
                    dist = _getColorDistance(bgPalette[0].rgb, color.rgb);
                    if (dist > maxDist && color.rgb !== fgColor) {
                        maxDist = dist;
                        fgColor2 = color.rgb;
                    }
                }
                result.fgColor = [_rgbToCssString(fgColor), _rgbToCssString(fgColor2)];
            }
            if (typeof config == 'function') {
                return config(result);
            }
            return callback(result);
        });

        image.src = img.src;
    };

    return {
        getColor: getColor
    }
})(this, jQuery, MMCQ);
