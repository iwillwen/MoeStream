var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var https = require('https');
var im = require('imagemagick');
module.exports = function (web) {
    var Pics = web.set('Pics');
    var picPath = web.set('picsPath');
    var io = web.set('io');
    var sockets = [];

    io.sockets.on('connection', function (socket) {
        sockets.push(socket);
    });
    web.get('/', function (req, res) {
        Pics.find({}, function (err, pics) {
            if (err) return res.sendError(404);
            res.render('index', {
                moes: pics
            });
        });
    });
    web.post({
        '/addPic': function (req, res) {
            if (req.data.pic) {
                var base64Data = '';
                var format = req.data.pic.match(/^data:image\/(.*);base64/i)[1];
                switch (format) {
                    case 'png':
                        base64Data = req.data.pic.replace(/^data:image\/png;base64,/,"");
                        format = '.png';
                        break;
                    case 'jpeg':
                        base64Data = req.data.pic.replace(/^data:image\/jpeg;base64,/,"");
                        format = '.jpg';
                        break;
                    case 'webp':
                        base64Data = req.data.pic.replace(/^data:image\/webp;base64,/,"");
                        format = '.webp';
                        break;
                }
                var dataBuffer = new Buffer(base64Data, 'base64');
                var id = Math.random().toString(32).substr(2);
                fs.writeFile(picPath + '/' + id + format, dataBuffer, function (err) {                   
                    if (err) return res.sendError(500);
                    var opt = {
                        srcPath: picPath + '/' + id + format,
                        dstPath: picPath + '/' + id + '.small' + format,
                        width: '30%'
                    };
                    im.resize(opt, function(err, stdout, stderr) {
                        console.log(err);
                        new Pics({
                            src: '/pics/' + id + format,
                            small: '/pics/' + id + '.small' + format
                        }).save(function (err2) {
                            if (err2) return res.sendError(500);
                            web.render('pic', {
                                src: '/pics/' + id + format,
                                small: '/pics/' + id + '.small' + format
                            }, function (err, pic) {
                                if (err) return;
                                for (var i = sockets.length - 1; i >= 0; i--) {
                                    sockets[i].emit('push', pic);
                                };
                            });
                            res.send('ok');
                        });
                    });
                });
            } else if (req.data.url) {
                new Pics({
                    src: req.data.url,
                    small: req.data.url
                }).save(function (err2) {
                    if (err2) return res.sendError(500);
                    web.render('pic', {
                        src: req.data.url,
                        small: req.data.url
                    }, function (err, pic) {
                        if (err) return;
                        for (var i = sockets.length - 1; i >= 0; i--) {
                            sockets[i].emit('push', pic);
                        };
                    });
                    res.send('ok');
                });
            }
        }
    });
};