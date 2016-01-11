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
        $set: obj
    }, function(err, doc) {
        if (err)
            return callback(err);
        return callback(err, doc)
    });
}

var ActivitySchema = new mongoose.Schema({
    imgs: [String],
    title: String,
    content: String,
    price: Number,
    tags: [String],
    startDate: Date,
    endDate: Date,
    publishDate: {
        date: Date,
        formatDate: String
    },
    amount: Number
}, {
    collection: 'activityinfo'
});

var ActivityModel = mongoose.model('ActivityInfo', ActivitySchema);

function ActivityInfo(info){
    this.imgs = info.imgs;
    this.title = info.title;
    this.content = info.content;
    this.price = info.price;
    this.tags = info.tags;
    this.startDate = info.startDate;
    this.endDate = info.endDate;
    this.amount = info.amount;
}

ActivityInfo.prototype.save = function(callback) {
    var date = new Date();
    var time = {
        date: date,
        formatDate: tools.formatDate(date)
    };
    var newActivity = new ActivityModel({
        imgs: this.imgs,
        title: this.title,
        content: this.content,
        price: this.price,
        tags: this.tags,
        startDate: this.startDate,
        endDate: this.endDate,
        publishDate: time,
        amount: this.amount
    });

    newActivity.save(function(err, doc) {
        return callback(err, doc);
    });
};

ActivityInfo.getOne = function(id, callback){
    ActivityModel.findOne({_id: new ObjectID(id)}, function(err, doc) {
        return callback(err, doc);
    });
}

ActivityInfo.getAll = function(callback){
    ActivityModel.find({}).sort('-publishDate.date').exec(function(err, docs) {
        return callback(err, docs);
    });
}

ActivityInfo.deleteOne = function(id, callback) {
    ActivityModel.remove({
        _id: new ObjectID(id)
    }, function(err) {
        return callback(err);
    });
}

var EnrollSchema = new mongoose.Schema({
    activityId: String,
    name: String,
    tel: String,
    remark: String,
    publishDate: {
        date: Date,
        formatDate: String
    }
}, {
    collection: 'enrollinfo'
});

var EnrollModel = mongoose.model('EnrollInfo', EnrollSchema);

function EnrollInfo(info){
    this.activityId = info.activityId;
    this.name = info.name;
    this.tel = info.tel;
    this.remark = info.remark;
}

EnrollInfo.prototype.save = function(callback) {
    var date = new Date();
    var time = {
        date: date,
        formatDate: tools.formatDate(date)
    };
    var newEnroll = new EnrollModel({
        activityId: this.activityId,
        name: this.name,
        tel: this.tel,
        remark: this.remark,
        publishDate: time
    });

    newEnroll.save(function(err, doc) {
        return callback(err, doc);
    });
};

EnrollInfo.getAll = function(callback){
    EnrollModel.find({}).sort('-publishDate.date').exec(function(err, docs) {
        return callback(err, docs);
    });
}

EnrollInfo.findByActivityId = function(activityId, callback){
    EnrollModel.find({activityId: activityId}).sort('-publishDate.date').exec(function(err, docs) {
        return callback(err, docs);
    });
}

EnrollInfo.getCount = function(activityId, callback){
    EnrollModel.count({activityId: activityId}, function(err, count){
        return callback(err, count);
    });
}

module.exports = {
    UserArticle: UserArticle,
    ActivityInfo: ActivityInfo,
    EnrollInfo: EnrollInfo
};
