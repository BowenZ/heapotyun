var express = require('express');
var router = express.Router();
var path = require('path');
var tools = require('../common/tools.js');
var radio = require('../models/radio.js');
var cors = require('cors');

var fs = require('fs'),
    multer = require('multer'),
    upload = multer({
        dest: '/public/radio/upload/'
    });

var UserArticle = radio.UserArticle,
    ActivityInfo = radio.ActivityInfo,
    EnrollInfo = radio.EnrollInfo;

function checkLogin(req, res, next) {
    if (!req.session.login) {
        return res.send({
            msg: 'nologin'
        });
    }
    next();
}

router.get('/admin', function(req, res, next) {
    var login = !!req.session.login;
    res.render('radio/admin', {
        login: login
    });
});

router.post('/admin/login', function(req, res, next) {
    if (req.body.name.toLowerCase() == 'admin' && req.body.password.toLowerCase() == 'sijiache999') {
        req.session.login = true;
        res.send('success');
    } else {
        res.send('error');
    }
});

router.get('/admin/logout', function(req, res, next) {
    if (req.session.login) {
        req.session.login = null;
    }
    res.json(1);
});

/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
router.get('/article', checkLogin);
router.get('/article', function(req, res, next) {
    UserArticle.get(function(err, docs) {
        if (err)
            return res.json({
                msg: 'error'
            });
        return res.json({
            msg: 'success',
            result: docs
        });
    });
});

router.get('/article/:id', function(req, res, next) {
    UserArticle.getOne(req.params.id, req.query.html, function(err, doc) {
        if (err)
            return res.status(500).json({
                msg: 'error'
            });
        if (req.query.html)
            return res.render('radio/article', {
                article: doc
            });
        return res.json({
            msg: 'success',
            result: doc
        });
    });
});

router.post('/article', checkLogin);
router.post('/article', function(req, res, next) {
    var newArticle = new UserArticle({
        author: req.body.author,
        title: req.body.title,
        url: req.body.url,
        tags: req.body.tags,
        content: req.body.content
    });

    newArticle.save(function(err, doc) {
        if (err)
            return res.json({
                msg: 'error'
            });
        return res.json({
            msg: 'success',
            result: doc
        });
    });
});

router.put('/article/:id', checkLogin);
router.put('/article/:id', function(req, res, next) {
    var obj = JSON.parse(req.body.article);
    obj.tags && (obj.tags = obj.tags.split(';'));
    UserArticle.update(req.params.id, obj, function(err, doc) {
        if (err)
            return res.json({
                msg: 'error'
            });
        if (!doc)
            return res.json({
                msg: 'error',
                result: '文章已被删除'
            });
        return res.json({
            msg: 'success',
            result: doc
        });
    });
});

router.delete('/article/:id', checkLogin);
router.delete('/article/:id', function(req, res, next) {
    UserArticle.deleteOne(req.params.id, function(err) {
        if (err)
            return res.json({
                msg: 'error'
            });
        return res.json({
            msg: 'success'
        });
    });
});

router.patch('/article/:id', function(req, res, next) {
    UserArticle.like(req.params.id, function(err) {
        if (err)
            return res.json({
                msg: 'error'
            });
        return res.json({
            msg: 'success'
        });
    });
});

router.get('/activity', cors(), function(req, res, next) {
    ActivityInfo.getAll(function(err, docs) {
        if (err)
            return res.json({
                msg: 'error'
            });
        return res.json({
            msg: 'success',
            result: docs
        });
    });
});

router.get('/activity/:id', cors(), function(req, res, next) {
    ActivityInfo.getOne(req.params.id, function(err, doc) {
        if (err)
            return res.json({
                msg: 'error'
            });
        if (req.query.json)
            return res.json({
                msg: 'success',
                result: doc
            });
        return res.render('radio/activity', {
            data: doc
        });
    });
});

router.post('/activity', checkLogin);
router.post('/activity', upload.array('files'), function(req, res, next) {
    var tags = [];
    if (req.body.tags) {
        req.body.tags.split(/\s/g).forEach(function(item, index) {
            if (item)
                tags.push(item);
        });
    }
    if (req.files && req.files.length > 0) {
        var folder = req.body.folder ? (req.body.folder + '/') : '';
        var result = {
            msg: 'success',
            filenames: []
        };
        var imgNum = 0;
        req.files.forEach(function(file, index) {
            var tmp_path = file.path;
            

            var file_name = (new Date - 0) + (Math.random() + '').substr(-5) + ('.' + file.originalname.split('.').pop());
            var target_path = 'public/radio/upload/' + folder + file_name;

            var src = fs.createReadStream(tmp_path);
            var dest = fs.createWriteStream(target_path);
            src.pipe(dest);
            src.on('end', function() {
                result.filenames.push(file_name);
                imgNum++;
                console.log(imgNum, req.files.length, '++++++++++++');
                if (imgNum == req.files.length) {
                    var newActivity = new ActivityInfo({
                        imgs: result.filenames,
                        title: req.body.title,
                        content: req.body.content,
                        price: req.body.price,
                        tags: tags,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate,
                        amount: req.body.amount
                    });
                    newActivity.save(function(err, doc) {
                        if (err)
                            return res.send({
                                msg: 'error'
                            });
                        return res.send({
                            msg: 'success',
                            result: doc
                        });
                    });
                }
            });
            src.on('error', function(err) {
                result.msg = 'error';
                result.err = err;
            });
        });
    } else {
        var newActivity = new ActivityInfo({
            title: req.body.title,
            content: req.body.content,
            price: req.body.price,
            tags: tags,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            amount: req.body.amount
        });
        newActivity.save(function(err, doc) {
            if (err)
                return res.send({
                    msg: 'error'
                });
            return res.send({
                msg: 'success',
                result: doc
            });
        });
    }

});

router.delete('/activity/:id', checkLogin);
router.delete('/activity/:id', function(req, res, next) {
    ActivityInfo.deleteOne(req.params.id, function(err) {
        if (err)
            return res.json({
                msg: 'error'
            });
        return res.json({
            msg: 'success'
        });
    });
});

router.post('/enroll', function(req, res, next) {
    ActivityInfo.getOne(req.body.activityId, function(err, activity) {
        if (err)
            return res.json({
                msg: 'error'
            });
        if (activity.amount) {
            EnrollInfo.getCount(req.body.activityId, function(err, count) {
                if (count >= activity.amount)
                    return res.json({
                        msg: 'error',
                        result: '报名人数已满'
                    });
                else {
                    var newEnroll = new EnrollInfo({
                        activityId: req.body.activityId,
                        name: req.body.name,
                        tel: req.body.tel,
                        remark: req.body.remark
                    });

                    newEnroll.save(function(err, doc) {
                        if (err)
                            return res.json({
                                msg: 'error'
                            });
                        return res.json({
                            msg: 'success',
                            result: doc
                        });
                    });
                }
            });
        } else {
            var newEnroll = new EnrollInfo({
                activityId: req.body.activityId,
                name: req.body.name,
                tel: req.body.tel,
                remark: req.body.remark
            });

            newEnroll.save(function(err, doc) {
                if (err)
                    return res.json({
                        msg: 'error'
                    });
                return res.json({
                    msg: 'success',
                    result: doc
                });
            });
        }
    });


});

router.get('/enroll', function(req, res, next) {
    EnrollInfo.findByActivityId(req.query.activityId, function(err, doc) {
        if (err)
            return res.json({
                msg: 'error'
            });
        return res.json({
            msg: 'success',
            result: doc
        });
    });
});

module.exports = router;
