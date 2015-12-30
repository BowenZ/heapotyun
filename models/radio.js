var ObjectID = require('mongodb').ObjectID;
var mongoose = require('./getMongoose');
var tools = require('../common/tools.js');

var ArticleInfoSchema = new mongoose.Schema({
    author: String,
    title: String,
    url: String,
    publishDate: {
        date: Date,
        formatDate: String
    },
    tags: [String],
    content: String,
    pv: Number,
    like: Number
}, {
    collection: 'userarticle'
});

var ArticleInfoModel = mongoose.model('UserArticle', ArticleInfoSchema);

function UserArticle(info) {
    this.author = info.author;
    this.title = info.title;
    this.url = info.url;
    this.tags = info.tags;
    this.content = info.content;
}

UserArticle.prototype.save = function(callback) {
    var date = new Date();
    var time = {
        date: date,
        formatDate: tools.formatDate(date)
    };

    var newArticle = new ArticleInfoModel({
        author: this.author,
        title: this.title,
        url: this.url,
        publishDate: time,
        tags: this.tags ? this.tags.split(';') : null,
        content: this.content,
        pv: 0,
        like: 0
    });

    newArticle.save(function(err, doc) {
        return callback(err, doc);
    });
};

UserArticle.get = function(callback) {
    ArticleInfoModel.find({}).sort('-publishDate.date').exec(function(err, docs) {
        return callback(err, docs);
    });
}

UserArticle.getOne = function(id, inc, callback) {
    ArticleInfoModel.findOneAndUpdate({
        _id: new ObjectID(id)
    }, {
        $inc: {
            pv: inc ? 1 : 0
        }
    }, {
        upsert: false,
        new: false
    }, function(err, doc) {
        return callback(err, doc);
    });
}

UserArticle.deleteOne = function(id, callback) {
    ArticleInfoModel.remove({
        _id: new ObjectID(id)
    }, function(err) {
        return callback(err);
    });
}

UserArticle.like = function(id, callback) {
    ArticleInfoModel.update({
        _id: new ObjectID(id)
    }, {
        $inc: {
            like: 1
        }
    }, {
        multi: false
    }, function(err, raw) {
        return callback(err, raw);
    });
}

UserArticle.update = function(id, obj, callback) {
    console.log(id, obj,'==============');
    ArticleInfoModel.findByIdAndUpdate(id, {
        $set: {
            title: obj.title,
            url: obj.url,
            author: obj.author,
            tags: obj.tags ? obj.tags.split(';') : null,
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
