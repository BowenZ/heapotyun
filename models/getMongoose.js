var settings = require('../settings');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(settings.url);

module.exports = mongoose;