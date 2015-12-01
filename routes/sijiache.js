var express = require('express');
var router = express.Router();
var path = require('path');

var fs = require('fs'),
    multer = require('multer'),
    upload = multer({
        dest: '/public/sijiache/upload/'
    });

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
    var login = !!req.session.user;
    res.render('sijiache/admin', {
        title: '私家车999后台管理',
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

router.get('/maintenanceitem', checkLogin);
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
router.post('/maintenance', checkLogin);
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