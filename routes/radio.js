var express = require('express');
var router = express.Router();
var path = require('path');
var tools = require('../common/tools.js');
var radio = require('../models/radio.js');
var UserArticle = radio.UserArticle;

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
        if(req.query.html)
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
router.post('/article', function(req, res, next){
    var newArticle = new UserArticle({
        author: req.body.author,
        title: req.body.title,
        url: req.body.url,
        tags: req.body.tags,
        content: req.body.content
    });

    newArticle.save(function(err, doc){
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
router.put('/article/:id', function(req, res, next){
    console.log(JSON.parse(req.body.article),'+++++++++++');
    UserArticle.update(req.params.id, JSON.parse(req.body.article), function(err, doc){
        if (err)
            return res.json({
                msg: 'error'
            });
        if(!doc)
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
router.delete('/article/:id', function(req, res, next){
    UserArticle.deleteOne(req.params.id, function(err){
        if (err)
            return res.json({
                msg: 'error'
            });
        return res.json({
            msg: 'success'
        });
    });
});

router.patch('/article/:id', function(req, res, next){
    UserArticle.like(req.params.id, function(err){
        if (err)
            return res.json({
                msg: 'error'
            });
        return res.json({
            msg: 'success'
        });
    });
});

module.exports = router;
