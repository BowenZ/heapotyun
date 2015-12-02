var crypto = require('crypto'),
    ObjectID = require('mongodb').ObjectID;
var mongoose = require('./getMongoose');

/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
var BuyCarInfoSchema = new mongoose.Schema({
    brand: String,
    buyYear: String,
    mailage: String,
    tel: String,
    publishDate: {
        date: Date,
        formatDate: String
    },
    userinfo: {
        nickname: String,
        sex: {
            type: String,
            enum: ['男', '女']
        },
        city: String
    }
}, {
    collection: 'buycarinfos'
});

var BuyCarInfoModel = mongoose.model('BuyCarInfo', BuyCarInfoSchema);

function BuyCarInfo(info) {
    this.brand = info.brand;
    this.buyYear = info.buyYear;
    this.mailage = info.mailage;
    this.tel = info.tel;
}

BuyCarInfo.prototype.save = function(callback) {
    var date = new Date();
    var time = {
        date: date,
        formatDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
    };
    var buyCarinfo = {
        brand: this.brand,
        buyYear: this.buyYear,
        mailage: this.mailage,
        tel: this.tel,
        publishDate: time,
        userinfo: null
    }

    var newBuyCarInfo = new BuyCarInfoModel(buyCarinfo);
    newBuyCarInfo.save(function(err, info) {
        return callback(err, info);
    });
};

BuyCarInfo.get = function(callback) {
    BuyCarInfoModel.find({}).sort('-publishDate.date').exec(function(err, docs) {
        callback(err, docs);
    });
}

BuyCarInfo.deleteOne = function(id, callback) {
    BuyCarInfoModel.remove({
        _id: new ObjectID(id)
    }, function(err) {
        callback(err);
    });
}

/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
var SellCarInfoSchema = new mongoose.Schema({
    brand: String,
    color: String,
    price: String,
    displacement: String,
    gearbox: Number,
    skylight: Boolean,
    licenseDate: Date,
    status: Boolean,
    tel: String,
    publishDate: {
        date: Date,
        formatDate: String
    },
    userinfo: {
        nickname: String,
        sex: {
            type: String,
            enum: ['男', '女']
        },
        city: String
    }
}, {
    collection: 'sellcarinfos'
});

var SellCarInfoModel = mongoose.model('SellCarInfo', SellCarInfoSchema);

function SellCarInfo(info) {
    this.brand = info.brand;
    this.color = info.color;
    this.price = info.price;
    this.displacement = info.displacement;
    this.gearbox = info.gearbox;
    this.skylight = info.skylight;
    this.licenseDate = info.licenseDate;
    this.status = info.status;
    this.tel = info.tel;
}

SellCarInfo.prototype.save = function(callback) {
    var date = new Date();
    var time = {
        date: date,
        formatDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
    };
    var sellCarinfo = {
        brand: this.brand,
        color: this.color,
        price: this.price,
        displacement: this.displacement,
        gearbox: this.gearbox,
        skylight: this.skylight,
        licenseDate: this.licenseDate,
        status: this.status,
        tel: this.tel,
        publishDate: time,
        userinfo: null
    }

    var newSellCarInfo = new SellCarInfoModel(sellCarinfo);
    newSellCarInfo.save(function(err, info) {
        return callback(err, info);
    });
};

SellCarInfo.get = function(callback) {
    SellCarInfoModel.find({}).sort('-publishDate.date').exec(function(err, docs) {
        callback(err, docs);
    });
}

SellCarInfo.deleteOne = function(id, callback) {
    SellCarInfoModel.remove({
        _id: new ObjectID(id)
    }, function(err) {
        callback(err);
    });
}


/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
var FixCarInfoSchema = new mongoose.Schema({
    model: String,
    mailage: String,
    tel: String,
    licensePlateNumber: String,
    question: String,
    publishDate: {
        date: Date,
        formatDate: String
    },
    userinfo: {
        nickname: String,
        sex: {
            type: String,
            enum: ['男', '女']
        },
        city: String
    }
}, {
	collection: 'fixcarinfos'
});

var FixCarInfoModel = mongoose.model('FixCarInfo', FixCarInfoSchema);

function FixCarInfo(info) {
    this.model = info.model;
    this.mailage = info.mailage;
    this.tel = info.tel;
    this.licensePlateNumber = info.licensePlateNumber;
    this.question = info.question;
}

FixCarInfo.prototype.save = function(callback) {
    var date = new Date();
    var time = {
        date: date,
        formatDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
    };
    var fixCarInfo = {
        model: this.model,
        mailage: this.mailage,
        tel: this.tel,
        licensePlateNumber: this.licensePlateNumber,
        question: this.question,
        publishDate: time,
        userinfo: null
    }
    var newFixCarInfo = new FixCarInfoModel(fixCarInfo);
    newFixCarInfo.save(function(err, info){
    	return callback(err, info);
    });
};

FixCarInfo.get = function(callback) {
    FixCarInfoModel.find({}).sort('-publishDate.date').exec(function(err, docs) {
        callback(err, docs);
    });
}

FixCarInfo.deleteOne = function(id, callback) {
    FixCarInfoModel.remove({
        _id: new ObjectID(id)
    }, function(err) {
        callback(err);
    });
}

/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
var MaintenanceItemSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	content: String,
	price: Number,
	status: Number,
	publishDate: {
        date: Date,
        formatDate: String
    }
}, {
	collection: 'maintenanceitems'
});

var MaintenanceItemModel = mongoose.model('MaintenanceItem', MaintenanceItemSchema);

function MaintenanceItem(item){
	this.name = item.name;
	this.content = item.content;
	this.price = item.price;
}

MaintenanceItem.prototype.save = function(callback) {
	var date = new Date();
    var time = {
        date: date,
        formatDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
    };

    var maintenanceItem = {
    	name: this.name,
    	content: this.content,
    	price: this.price,
    	status: 1,
    	publishDate: time
    }

    var newMaintenanceItem = new MaintenanceItemModel(maintenanceItem);
    newMaintenanceItem.save(function(err, doc){
    	return callback(err, doc);
    });
};

MaintenanceItem.get = function(query, callback){
	MaintenanceItemModel.find(query).sort('-publishDate.date').exec(function(err, docs){
		return callback(err, docs);
	});
}

MaintenanceItem.updateStatus = function(id, status, callback){
	MaintenanceItemModel.update({
		_id: new ObjectID(id)
	}, {
		status: status
	}, {}, function(err){
		return callback(err);
	});
}

MaintenanceItem.deleteOne = function(_id, callback){
	MaintenanceItemModel.remove({
		_id: new ObjectID(_id)
	}, function(err){
		callback(err);
	});
}

/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
var MaintenanceInfoSchema = new mongoose.Schema({
	items: [{
		id: String,
		name: String,
		price: Number
	}],
	model: String,
	tel: String,
	licensePlateNumber: String,
	publishDate: {
        date: Date,
        formatDate: String
    },
    userinfo: {
        nickname: String,
        sex: {
            type: String,
            enum: ['男', '女']
        },
        city: String
    }
}, {
	collection: 'maintenanceinfos'
});

var MaintenanceInfoModel = mongoose.model('MaintenanceInfo', MaintenanceInfoSchema);

function MaintenanceInfo(info){
	this.items = info.items;
	this.model = info.model;
	this.tel = info.tel;
	this.licensePlateNumber = info.licensePlateNumber;
}

MaintenanceInfo.prototype.save = function(callback) {
	var date = new Date();
    var time = {
        date: date,
        formatDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
    };

    var maintenanceInfo = {
    	items: this.items,
    	model: this.model,
    	tel: this.tel,
    	licensePlateNumber: this.licensePlateNumber,
    	publishDate: time,
    	userinfo: null
    }

    var newMaintenanceInfo = new MaintenanceInfoModel(maintenanceInfo);
    newMaintenanceInfo.save(function(err, doc){
    	return callback(err, doc);
    });
};

MaintenanceInfo.get = function(callback){
	MaintenanceInfoModel.find({}).sort('-publishDate.date').exec(function(err, docs){
		return callback(err, docs);
	});
}

MaintenanceInfo.deleteOne = function(_id, callback){
	MaintenanceInfoModel.remove({
		_id: new ObjectID(_id)
	}, function(err){
		return callback(err);
	});
}

/*===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
var AdvertisementInfoSchema = new mongoose.Schema({
	title: String,
	content: String,
	imgUrl: String,
	linkUrl: String,
	publishDate: {
        date: Date,
        formatDate: String
    }
}, {
	collection: 'advertisementinfos'
});

var AdvertisementInfoModel = mongoose.model('AdvertisementInfo', AdvertisementInfoSchema);

function AdvertisementInfo(info){
	this.title = info.title;
	this.content = info.content;
	this.imgUrl = info.imgUrl;
	this.linkUrl = info.linkUrl;
}

AdvertisementInfo.prototype.save = function(callback) {
	var date = new Date();
    var time = {
        date: date,
        formatDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
    };

    var newAdInfo = new AdvertisementInfoModel({
    	title: this.title,
    	content: this.content,
    	imgUrl: this.imgUrl,
    	linkUrl: this.linkUrl,
    	publishDate: time
    });

    newAdInfo.save(function(err, doc){
    	return callback(err, doc);
    });
};

AdvertisementInfo.get = function(callback){
	AdvertisementInfoModel.find({}).sort('-publishDate.date').exec(function(err, docs){
		return callback(err, docs);
	});
}

AdvertisementInfo.deleteOne = function(id, callback){
	AdvertisementInfoModel.remove({
		_id: new ObjectID(id)
	}, function(err){
		return callback(err);
	});
}

module.exports = {
    BuyCarInfo: BuyCarInfo,
    SellCarInfo: SellCarInfo,
    FixCarInfo: FixCarInfo,
    MaintenanceItem: MaintenanceItem,
    MaintenanceInfo: MaintenanceInfo,
    AdvertisementInfo: AdvertisementInfo
}
