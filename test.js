var crypto = require('crypto');
var md5 = crypto.createHash('md5');
console.log(md5.update('202cb962ac59075b964b07152d234b70').digest('hex'));
