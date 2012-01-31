//Pictures Model
module.exports = function (web) {
    var mongo = web.set('mongo');
    var Pic = new mongo.Schema({
        'src': String,
        'small': String
    });
    var Pics = mongo.model('Pics', Pic);
    web.set('Pics', Pics);
}