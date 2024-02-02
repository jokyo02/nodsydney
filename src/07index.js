const httpProxy = require('http-proxy-middleware');
const setCookieParser = require('set-cookie-parser');

const proxy = httpProxy.createProxyMiddleware({
  target: 'http://example.com',
  changeOrigin: true,
  onProxyRes: (proxyRes, req, res) => {
    const cookies = setCookieParser.parse(proxyRes.headers['set-cookie']);
    cookies.forEach((cookie) => {
      res.cookie(cookie.name, cookie.value, cookie);
    });
  },
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Origin', 'https://www.bing.com');
  const randIP = getRandomIP();
  proxyReq.setHeader('X-Forwarded-For', randIP);
});

const serverUrl = 'www.bing.com';

const server = require('http').createServer(function(req, res) {
//const server = https.createServer(options, function(req, res) {
  // 添加一个判断条件
//  if (req.url === '/') {
    // 返回一个简单的消息
 //   res.writeHead(200, {'Content-Type': 'text/plain'});
 //   res.end('WellCome! Site is working ......');
//  } else {
    // 原来的代码
    proxy.web(req, res, {
      target: 'wss://' + serverUrl,
      ws: true,
      changeOrigin: true
    });
//  }
});

server.on('upgrade', function(req, socket, head) {
  proxy.ws(req, socket, head, {
    target: 'wss://' + serverUrl,
    changeOrigin: true
  });
});

server.listen(7860, function() {
  console.log('Listen on Port 7860......');
});
