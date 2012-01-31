var cluster = require('cluster');
if (cluster.isMaster) {
  for (var i = 0; i < 1; i++) {
    var worker = cluster.fork();
  }
} else {
    require(__dirname + '/controllers/')();
}

cluster.on('death', function(worker) {
  cluster.fork();
});