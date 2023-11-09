const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const SYDNEY_ORIGIN = 'https://sydney.bing.com';
const KEEP_REQ_HEADERS = [
  'accept',
  'accept-encoding',
  'accept-language',
  'connection',
  'cookie',
  'upgrade',
  'user-agent',
  'sec-websocket-extensions',
  'sec-websocket-key',
  'sec-websocket-version',
  'x-request-id',
  'content-length',
  'content-type',
  'access-control-request-headers',
  'access-control-request-method',
];

const app = express();

const proxy = createProxyMiddleware({
  target: SYDNEY_ORIGIN,
  changeOrigin: true,
  onProxyReq(proxyReq, req, res) {
    // Set or modify the headers you want
    proxyReq.setHeader('referer', 'https://www.bing.com/search?q=Bing+AI');
    const randIP = '163.47.101.101';
    proxyReq.setHeader('X-Forwarded-For', randIP);

    const cookie = req.headers['cookie'] || '';
    let cookies = cookie;
    if (!cookie.includes('_U=')) {
      cookies += '; _U=' + '';
    }
    proxyReq.setHeader('cookie', cookies);
  },
});

// Use the proxy middleware for all requests
app.use(proxy);

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
