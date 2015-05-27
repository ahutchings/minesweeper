var http = require('http');
var ecstatic = require('ecstatic');
var port = process.env.PORT || 3000;

http.createServer(
  ecstatic({ root: __dirname })
).listen(port);

console.log('Listening on :' + port);
