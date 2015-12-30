var ObjectID = require('mongodb').ObjectID;
var mongoose = require('./getMongoose');
var tools = require('../common/tools.js');

var articleSchema = new mongoose.Schema({
    title: String,
    url: String,
    content: String,
    publishDate: {
        date: Date,
        formatDate: String
    }
}, {
    collection: 'userarticle'
});

var articleModel = mongoose.model('UserArticle', articleSchema);

function UserArticle(info) {
    this.title = info.title,
        this.url = info.url;
    this.content = info.content;
}

UserArticle.prototype.save = function(callback) {
    var date = new Date();
    var time = {
        date: date,
        formatDate: tools.formatDate(date)
    };
    var article = {
        title: this.title,
        url: this.url,
        content: this.content,
        publishDate: time
    }

    var newArticle = new articleModel(article);
    newArticle.save(function(err, doc) {
        return callback(err, doc);
    });
};

UserArticle.get = function(id, callback) {
    articleModel.find({
        _id: new ObjectID(id)
    }).sort('-publishDate.date').exec(function(err, doc) {
        callback(err, doc);
    });
}

UserArticle.update = function(id, obj, callback) {
	console.log(id,obj,'+++++++++++++++++');
    articleModel.findByIdAndUpdate(id, {
        $set: {
            title: obj.title,
            url: obj.url,
            content: obj.content
        }
    }, function(err, doc) {
        if (err) 
            return callback(err);
        return callback(err, doc)
    });
}

module.exports = {
	UserArticle: UserArticle
};