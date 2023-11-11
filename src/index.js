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
  });
