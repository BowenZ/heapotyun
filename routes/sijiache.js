var express = require('express');
var router = express.Router();
var path = require('path');

var fs = require('fs'),
    multer = require('multer'),
    upload = multer({
        dest: '/public/sijiache/upload/'
    });

var tools = require('../common/tools.js');

var sijiache = require('../models/sijiache.js'),
    BuyCarInfo = sijiache.BuyCarInfo,
    SellCarInfo = sijiache.SellCarInfo,
    FixCarInfo = sijiache.FixCarInfo,
    MaintenanceItem = sijiache.MaintenanceItem,
    MaintenanceInfo = sijiache.MaintenanceInfo,
    AdvertisementInfo = sijiache.AdvertisementInfo;

function checkLogin(req, res, next){
	if(!req.session.login){
		return res.send({
			msg: 'nologin'
		});
	}
	next();
}

router.get('/index', function(req, res, next) {
    res.render('sijiache/index');
});


/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
router.post('/buycar', function(req, res, next) {
    var newBuyCarInfo = new BuyCarInfo({
        brand: req.body.brand,
        buyYear: req.body.buyYear,
        mailage: req.body.mailage,
        tel: req.body.tel
    });

    newBuyCarInfo.save(function(err) {
        if (err)
            return res.send('error');
        else
            return res.send('success');
    });
});

router.get('/buycar', checkLogin);
router.get('/buycar', function(req, res){
	BuyCarInfo.get(function(err, result){
		if(err){
			res.json({
				msg: 'error'
			});
		}
		res.json({
			msg: 'success',
			result: result
		});
	});
});

router.get('/buycar/getexcel', checkLogin);
router.get('/buycar/getexcel', function(req, res){
	BuyCarInfo.get(function(err, result){
		if(err){
			res.json({
				msg: 'error'
			});
		}
		var dataArr = [];
		dataArr.push(['品牌车型','车辆年限','里程数','手机号','创建时间']);
		result.forEach(function(item){
			dataArr.push([item.brand, item.buyYear, item.mailage, item.tel, item.publishDate.formatDate]);
		});
		tools.exportExcel({
			data: dataArr,
			ws_name: '购买二手车信息',
			file_name: path.join(__dirname, '../private/sijiache/', 'buycarinfo.xlsx')
		});
		res.download(path.join(__dirname, '../private/sijiache/', 'buycarinfo.xlsx'));
	});
});

router.delete('/buycar/:id', checkLogin);
router.delete('/buycar/:id', function(req, res, next){
	BuyCarInfo.deleteOne(req.params.id, function(err){
		if(err){
			return res.json({
				msg: 'error'
			});
		}
		return res.json({
			msg: 'success'
		});
	});
});


/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
router.post('/sellcar', function(req, res, next) {
    var newSellCarInfo = new SellCarInfo({
        brand: req.body.brand,
        color: req.body.color,
        price: req.body.price,
        displacement: req.body.displacement,
        gearbox: req.body.gearbox,
        skylight: req.body.skylight,
        licenseDate: req.body.licenseDate,
        status: req.body.status == '1' ? true : false,
        tel: req.body.tel
    });

    newSellCarInfo.save(function(err) {
        if (err)
            return res.send('error');
        else
            return res.send('success');
    });
});

router.get('/sellcar', checkLogin);
router.get('/sellcar', function(req, res, next){
	SellCarInfo.get(function(err, result){
		if(err){
			res.json({
				msg: 'error'
			});
		}
		res.json({
			msg: 'success',
			result: result
		});
	});
});

router.get('/sellcar/getexcel', checkLogin);
router.get('/sellcar/getexcel', function(req, res){
	SellCarInfo.get(function(err, result){
		if(err){
			res.json({
				msg: 'error'
			});
		}
		var dataArr = [];
		dataArr.push(['品牌车型','颜色','价格','排量','变速箱','是否带天窗','上牌时间','目前状态','手机号','创建时间']);
		result.forEach(function(item){
			dataArr.push([item.brand, item.color, item.price, item.displacement, item.gearbox==1?'AT自动挡':(item.gearbox==2?'MT手动挡':'手自一体'), item.skylight?'是':'否', item.licenseDate, item.status?'想卖车':'问问价', item.tel, item.publishDate.formatDate]);
		});
		tools.exportExcel({
			data: dataArr,
			ws_name: '出售二手车信息',
			file_name: path.join(__dirname, '../private/sijiache/', 'sellcarinfo.xlsx')
		});
		res.download(path.join(__dirname, '../private/sijiache/', 'sellcarinfo.xlsx'));
	});
});

router.delete('/sellcar/:id', checkLogin);
router.delete('/sellcar/:id', function(req, res, next){
	SellCarInfo.deleteOne(req.params.id, function(err){
		if(err){
			return res.json({
				msg: 'error'
			});
		}
		return res.json({
			msg: 'success'
		});
	});
});


/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
router.post('/fixcar', function(req, res, next) {
    var newFixCarInfo = new FixCarInfo({
        model: req.body.model,
        mailage: req.body.mailage,
        tel: req.body.tel,
        licensePlateNumber: req.body.licensePlateNumber,
        question: req.body.question
    });

    newFixCarInfo.save(function(err) {
        if (err)
            return res.send('error');
        else
            return res.send('success');
    });
});

router.get('/fixcar', checkLogin);
router.get('/fixcar', function(req, res, next){
	FixCarInfo.get(function(err, result){
		if(err){
			res.json({
				msg: 'error'
			});
		}
		res.json({
			msg: 'success',
			result: result
		});
	});
});

router.get('/fixcar/getexcel', checkLogin);
router.get('/fixcar/getexcel', function(req, res){
	FixCarInfo.get(function(err, result){
		if(err){
			res.json({
				msg: 'error'
			});
		}
		var dataArr = [];
		dataArr.push(['品牌车型','里程','手机号','车牌号','问题','创建时间']);
		result.forEach(function(item){
			dataArr.push([item.model, item.mailage, item.tel, item.licensePlateNumber, item.question, item.publishDate.formatDate]);
		});
		tools.exportExcel({
			data: dataArr,
			ws_name: '维修信息',
			file_name: path.join(__dirname, '../private/sijiache/', 'fixcarinfo.xlsx')
		});
		res.download(path.join(__dirname, '../private/sijiache/', 'fixcarinfo.xlsx'));
	});
});

router.delete('/fixcar/:id', checkLogin);
router.delete('/fixcar/:id', function(req, res, next){
	FixCarInfo.deleteOne(req.params.id, function(err){
		if(err){
			return res.json({
				msg: 'error'
			});
		}
		return res.json({
			msg: 'success'
		});
	});
});


/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
router.get('/admin', function(req, res, next) {
    var login = !!req.session.login;
    res.render('sijiache/admin', {
        login: login
    });
});

router.post('/admin/login', function(req, res, next){
	if(req.body.name.toLowerCase() == 'adw' && req.body.password.toLowerCase() == 'adw123'){
		req.session.login = true;
		res.send('success');
	}
	else{
		res.send('error');
	}
});

router.get('/admin/logout', function(req, res, next){
	if(req.session.login){
		req.session.login = null;
	}
	res.json(1);
});


/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
router.post('/maintenanceitem', checkLogin);
router.post('/maintenanceitem', function(req, res, next){
	var newItem = new MaintenanceItem({
		name: req.body.name,
		content: req.body.content,
		price: req.body.price
	});

	newItem.save(function(err){
		if(err)
			return res.json({
				msg: 'error'
			});
		return res.json({
			msg: 'success'
		});
	});
});

router.get('/maintenanceitem', function(req, res, next){
	MaintenanceItem.get(function(err, docs){
		if(err){
			return res.json({
				msg: 'error'
			});
		}
		return res.json({
			msg: 'success',
			result: docs
		});
	});
});

router.delete('/maintenanceitem/:id', checkLogin);
router.delete('/maintenanceitem/:id', function(req, res, next){
	MaintenanceItem.deleteOne(req.params.id, function(err){
		if(err){
			return res.json({
				msg: 'error'
			});
		}
		return res.json({
			msg: 'success'
		});
	});
});


/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
router.post('/maintenance', function(req, res, next){
	var newMaintenanceInfo = new MaintenanceInfo({
		items: req.body.items,
		model: req.body.model,
		tel: req.body.tel,
		licensePlateNumber: req.body.licensePlateNumber
	});

	newMaintenanceInfo.save(function(err){
		if(err){
			return res.json({
				msg: 'error'
			});
		}
		return res.json({
			msg: 'success'
		});
	});
});

router.get('/maintenance', checkLogin);
router.get('/maintenance', function(req, res, next){
	MaintenanceInfo.get(function(err, docs){
		if(err){
			return res.json({
				msg: 'error'
			});
		}
		return res.json({
			msg: 'success',
			result: docs
		});
	});
});

function formatItems(arr){
	var result = [];
	arr.forEach(function(item){
		result.push(item.name);
	});
	return result.join(',');
}

router.get('/maintenance/getexcel', checkLogin);
router.get('/maintenance/getexcel', function(req, res){
	MaintenanceInfo.get(function(err, result){
		if(err){
			res.json({
				msg: 'error'
			});
		}
		var dataArr = [];
		dataArr.push(['参加优惠','车型','车牌号','手机号','创建时间']);
		result.forEach(function(item){
			dataArr.push([formatItems(item.items), item.model, item.licensePlateNumber, item.tel, item.publishDate.formatDate]);
		});
		tools.exportExcel({
			data: dataArr,
			ws_name: '维修信息',
			file_name: path.join(__dirname, '../private/sijiache/', 'maintenanceinfo.xlsx')
		});
		res.download(path.join(__dirname, '../private/sijiache/', 'maintenanceinfo.xlsx'));
	});
});

router.delete('/maintenance/:id', checkLogin);
router.delete('/maintenance/:id', function(req, res, next){
	MaintenanceInfo.deleteOne(req.params.id, function(err){
		if(err){
			return res.json({
				msg: 'error'
			});
		}
		return res.json({
			msg: 'success'
		});
	});
});

/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
router.post('/ad', checkLogin);
router.post('/ad', function(req, res, next){
	var newAdInfo = new AdvertisementInfo({
		title: req.body.title,
    	content: req.body.content,
    	imgUrl: req.body.imgUrl,
    	linkUrl: req.body.linkUrl
	});

	newAdInfo.save(function(err){
		if(err){
			return res.json({
				msg: 'error'
			});
		}
		return res.json({
			msg: 'success'
		});
	});
});

router.get('/ad', function(req, res, next){
	AdvertisementInfo.get(function(err, docs){
		if(err){
			return res.json({
				msg: 'error'
			});
		}
		return res.json({
			msg: 'success',
			result: docs
		});
	});
});

router.delete('/ad/:id', checkLogin);
router.delete('/ad/:id', function(req, res, next){
	AdvertisementInfo.deleteOne(req.params.id, function(err){
		if(err){
			return res.json({
				msg: 'error'
			});
		}
		return res.json({
			msg: 'success'
		});
	});
});

router.post('/upload', checkLogin);
router.post('/upload', upload.single('imgFile'), function(req, res, next){
	if (req.file == undefined) {
        res.json({
        	msg: 'error',
        	err: 'no file'
        });
        return;
    }
    var tmp_path = req.file.path;

    /** The original name of the uploaded file
        stored in the variable "originalname". **/
    var file_name = (new Date - 0) + req.file.originalname;
    var target_path = 'public/sijiache/upload/' + file_name;

    /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() {
        res.json({
        	msg: 'success',
        	filename: file_name
        });
    });
    src.on('error', function(err) {
        res.json({
    		mgs: 'error',
    		err: err
        });
    });
    return;
});

module.exports = router;
