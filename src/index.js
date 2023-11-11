const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();

app.use('/', (req, res) => {
  const headers = {
    'Origin': 'https://www.bing.com',
    'Cookie': req.headers.cookie + '; _U=xxx',
  };

  proxy.web(req, res, {
    target: 'wss://sydney.bing.com',
    secure: false,
    changeOrigin: true,
    headers,
    timeout: 5000, // 5 seconds
  }, (error) => {
    console.error('Proxy error:', error);
    res.status(500).send('Proxy error');
  });
});

app.listen(3000, () => {
  console.log('Proxy server is running on port 3000');
});
