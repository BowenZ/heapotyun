var express = require('express');
var router = express.Router();
var request = require('request'),
    cheerio = require('cheerio');
var needle = require('needle');
var cors = require('cors');

router.get('/kuaidi', function(req, res, next) {
    var url = 'http://wap.kuaidi100.com/wap_result.jsp?rand=20120517&fromWeb=null' + '&id=' + req.query.id + '&postid=' + req.query.postid;
    request(url, function(error, response, data) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(data);
            $('form div.clear').last().next('p').prevAll().remove();
            if (req.query.callback) {
                return res.jsonp($('form').html());
            }
            return res.send($('form').html());
        }
        res.send('error');
    });
});

router.get('/lukuang/:city', cors(), function(req, res, next) {
    if (req.params.city == 'zhengzhou') {
        var url = 'http://www.zhongbuauto.com/weixin/jiaojing/road/';
        var result;
        //原网站编码为gb2312，用request抓取中文乱码，改用needle后正常，原因待考究
        needle.get(url, function(error, response) {
            if (!error && response.statusCode == 200) {
                result = {
                    msg: 'success',
                    data: []
                };
                var $ = cheerio.load(response.body);
                $('td>div').each(function(index, el) {
                    if ($(el).find('>div').length === 0) return;
                    result.data.push({
                        time: $(el).find('>div').eq(1).text(),
                        roadCondition: $(el).find('>div').eq(2).text()
                    });
                });
            } else {
                result = {
                    msg: 'error'
                };
            }
            res.send(result);
        });
    } else if (req.params.city == 'zhengzhou2') {
        var url = 'http://www.zzjtcx.com/sy/gjds/ssydld_index.htm';
        var result;
        var j = request.jar();
        request.defaults({
            jar: true
        });
        request({
            url: 'http://www.zzjtcx.com',
            jar: j
        }, function(error1, response1, doc) {
            var $ = cheerio.load(doc);
            result = {
                msg: 'success',
                data: {
                	expressway: $('.gslk').html()
                }
            };
            var cookie_string = j.getCookieString('http://www.zzjtcx.com');
            var cookie = request.cookie(cookie_string);
            j.setCookie(cookie, url);
            request({
                url: url,
                jar: j
            }, function(error, response, data) {
                if (!error && response.statusCode == 200) {
                	result.data.roadCondition = JSON.parse(data);
                    return res.send(result);
                }
                res.send({
                    msg: 'error'
                });
            });
        });
    } else {
        res.send({
            msg: 'error',
            info: 'can not find data in this city'
        });
    }
});

module.exports = router;
