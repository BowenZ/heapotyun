var express = require('express');
var router = express.Router();
var request = require('request'),
	cheerio = require('cheerio');
var needle = require('needle');
var cors = require('cors');

router.get('/kuaidi', function(req, res, next) {
	var url = 'http://wap.kuaidi100.com/wap_result.jsp?rand=20120517&fromWeb=null' + '&id=' + req.query.id + '&postid=' + req.query.postid;
	request(url, function(error, response, data){
		if(!error && response.statusCode == 200){
			var $ = cheerio.load(data);
			$('form div.clear').last().next('p').prevAll().remove();
			if(req.query.callback){
				return res.jsonp($('form').html());
			}
			return res.send($('form').html());
		}
		res.send('error');
	});
});

router.get('/lukuang/:city', cors(), function(req,res, next){
	if(req.params.city == 'zhengzhou'){
		var url = 'http://www.zhongbuauto.com/weixin/jiaojing/road/';
		var result;
		//原网站编码为gb2312，用request抓取中文乱码，改用needle后正常，原因待考究
		needle.get(url, function(error, response){
			if(!error && response.statusCode == 200){
				result = {
					msg: 'success',
					data: []
				};
				var $ = cheerio.load(response.body);
				$('td>div').each(function(index, el) {
					result.data.push({
						time: $(el).find('>div').eq(1).text(),
						roadCondition: $(el).find('>div').eq(2).text()
					});
				});
			}else{
				result = {
					msg: 'error'
				};
			}
			res.send(result);
		});
	}else{
		res.send({
			msg: 'error',
			info: 'can not find data in this city'
		});
	}
});

module.exports = router;