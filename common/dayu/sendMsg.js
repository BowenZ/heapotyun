/**
 * Module dependencies.
 */
var settings = require('./settings.js')

TopClient = require('./topClient').TopClient;

var client = new TopClient({
    'appkey': settings.appkey,
    'appsecret': settings.appsecret,
    'REST_URL': settings.REST_URL
});

function sendMsg(sendPhoneNumber, store, name, extend, callback) {
    if (!extend) {
        extend = 'none'
    }
    var address = settings.store_info[store].address,
        phoneNumber = settings.store_info[store].phoneNumber
    console.log(address, phoneNumber);
    client.execute(settings.app_type, {
        'extend': extend,
        'sms_type': 'normal',
        'sms_free_sign_name': settings.sms_free_sign_name,
        'sms_param': { "name": name, "address": address, "telphone": phoneNumber },
        'rec_num': sendPhoneNumber,
        'sms_template_code': settings.sms_template_code
    }, function(error, response) {
        if (!error)
            callback('success', response)
        else 
            callback('error', error)
    })
}
// sendMsg('13522381001', 'east', 'aassdd', 'qweqwe');
module.exports = sendMsg
