const httpProxy = require('http-proxy-middleware');
const express = require('express');

const app = express();

app.use('/',
  httpProxy.createProxyMiddleware({
    target: 'wss://sydney.bing.com',
    changeOrigin: true,
    headers: {
      origin: 'https://www.bing.com'
    },
    preserveReqHeaders: true,
    preserveReqBody: true
  })
);

app.listen(7860);
