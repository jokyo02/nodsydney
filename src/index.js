//好的，我可以帮你添加一个根/路径响应。你可以在创建服务器的函数中添加一个判断条件，如果请求的路径是'/'，就返回一个简单的消息，比如'Site is working'。你可以参考下面的代码：
//这样，当你访问 http://localhost:7860/ 时，就会看到'Site is working'的提示。希望这能帮到你。😊

const httpProxy = require('http-proxy');
const https = require('https');
const proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Origin', 'https://www.bing.com');
});

const serverUrl = 'sydney.bing.com';

//const server = require('http').createServer(function(req, res) {
const server = https.createServer(options, function(req, res) {
  // 添加一个判断条件
  if (req.url === '/') {
    // 返回一个简单的消息
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('WellCome! Site is working ......');
  } else {
    // 原来的代码
    proxy.web(req, res, {
      target: 'wss://' + serverUrl,
      ws: true,
      changeOrigin: true
    });
  }
});

server.on('upgrade', function(req, socket, head) {
  proxy.ws(req, socket, head, {
    target: 'wss://' + serverUrl,
    changeOrigin: true
  });
});

server.listen(7860);

