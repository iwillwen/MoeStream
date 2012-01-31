var path = require('path');
var zlib = require('zlib');
module.exports = function () {
    var web = require('webjs');
    var mongo = require('mongoose');

    web.extend(__dirname + '/db');
    web.run()
        .config({
            'view engine': 'jade',
            'views': __dirname + '/../views',
            'mode': 'pro',
            'db': 'mongo://localhost:20088/moestream',
            'picsPath': __dirname + '/../static/pics'
        });
    mongo.connect(web.set('db'));
    web.use(web.static(__dirname + '/../static'))
        .use(web.cookieParser())
        .use(web.session())
        .use(web.bodyParser())
        .set('mongo', mongo)
        .extend(__dirname + '/../models/pics')
        .extend(__dirname + '/realtime')
        .extend(__dirname + '/router')
}
