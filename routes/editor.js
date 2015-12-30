var express = require('express');
var router = express.Router();
var path = require('path');
var tools = require('../common/tools.js');
var editor = require('../models/editor.js');
var UserArticle = editor.UserArticle;

router.post('/article', function(req, res, next) {
    var newArticle = new UserArticle({
        title: req.body.title,
        url: req.body.url,
        content: req.body.content
    });

    newArticle.save(function(err, doc) {
        if (err) {
            return res.json({
                msg: 'error'
            });
        }
        return res.json({
            msg: 'success',
            result: doc
        });
    });
});

router.get('/article/:id', function(req, res, next) {
    UserArticle.get(req.params.id, function(err, doc) {
        if (err) {
            return res.json({
                msg: 'error'
            });
        }
        return res.render('editor/user_article', {
            id: doc[0]._id,
            title: doc[0].title,
            url: doc[0].url,
            content: doc[0].content
        });
    });
});

router.put('/article/:id', function(req, res, next) {
	console.log(req.body,'==============');
    UserArticle.update(req.params.id, {
    	title: req.body.title,
    	url: req.body.url,
    	content: req.body.content
    }, function(err, doc) {
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

router.get('/edite', function(req, res, next) {
    if (req.query.id) {
        UserArticle.get(req.query.id, function(err, doc) {
            if (err) {
                return res.json({
                    msg: 'error'
                });
            }
            res.render('editor/admin_editor', {
                id: doc[0]._id,
                title: doc[0].title,
                url: doc[0].url,
                content: doc[0].content
            });
        });
    } else {
        return res.render('editor/admin_editor', {
            id: null,
            title: null,
            url: null,
            content: null
        });
    }
});

module.exports = router;
