const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Origin', 'https://www.bing.com');
});

const serverUrl = 'sydney.bing.com';

const server = require('http').createServer(function(req, res) {
  proxy.web(req, res, {
    target: 'wss://' + serverUrl,
    ws: true,
    changeOrigin: true
  });
});

server.on('upgrade', function(req, socket, head) {
  proxy.ws(req, socket, head, {
    target: 'wss://' + serverUrl,
    changeOrigin: true
  });
});

server.listen(7860);
