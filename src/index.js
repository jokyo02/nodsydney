//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 引入express模块
const express = require('express');
// 引入axios模块
const axios = require('axios');
// 引入node-fetch模块
//const fetch = require('node-fetch');
// 引入ws模块
const WebSocket = require('ws');

// 定义保留的请求头部
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
  'accept',
  'accept-encoding',
  'accept-language',
  'authorization',
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
  'sec-ms-gec',
  'sec-ms-gec-version',
  'x-client-data',
  'x-ms-client-request-id',
  'x-ms-useragent',
];

// 创建一个express应用
const app = express();

// 创建一个WebSocket服务器
const wss = new WebSocket.Server({ noServer: true });

// 处理GET /路径
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// 设置跨域访问
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
  res.header('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 处理WebSocket请求
app.use((req, res, next) => {
  const upgradeHeader = req.headers['upgrade'];
  if (upgradeHeader === 'websocket') {
    handleWebSocket(req, res);
  } else {
    next();
  }
});

// 处理WebSocket请求的函数
async function handleWebSocket(req, res) {
  const serverUrl = "https://sydney.bing.com";
  const fetchUrl = new URL(req.url, serverUrl);
  fetchUrl.hostname = serverUrl;
  
    console.log(req.body);
  
  const headers = {};
  for (const key of Object.keys(req.headers)) {
    if (KEEP_REQ_HEADERS.includes(key)) {
      headers[key] = req.headers[key];
    }
  }

  // 处理cookie
  let cookies = headers.cookie || '';
  if (!cookies.includes('_U=')) {
    cookies += '; _U=';
  }
  headers.cookie = cookies;

  // 设置origin和referer
  headers.host = "sydney.bing.com";
  headers.origin = 'https://www.bing.com';
  headers.referer = 'https://www.bing.com/search?q=Bing+AI';

  console.log(JSON.stringify(headers, null, 2));
  // 发送HTTP请求
  try {
    console.log('Express URL:' + fetchUrl.toString());
//    const response = await axios({
     const fetch = await import('node-fetch');
    const response = await fetch.default(fetchUrl.toString(), {
 //     url: fetchUrl.toString(),
      headers: headers,
      method: req.method,
      data:  JSON.stringify(req.body),
      redirect: 'manual'
});

const text = response.data;
const status = response.status;
const url = response.config.url;

res.writeHead(200, {
  'Content-Type': 'application/text; charset=UTF-8',
  'x-url': url,
  'x-status': status,
});



    // 如果响应状态码为101，表示协议切换成功
    if (response.status === 101) {
//      wss.handleUpgrade(req, res.socket, Buffer.alloc(0), (ws) => {
//        ws.headers = response.headers;
//        const duplex = WebSocket.createWebSocketStream(ws);
//        response.data.pipe(duplex);
//        duplex.pipe(response.data);
         console.log('Express Upgrade OK!');
//      });
    } else {
      // 设置响应头
      console.log('Express Upgrade NG!');
//      Object.keys(response.headers).forEach((key) => {
//        res.setHeader(key, response.headers[key]);
//      });

//      res.send(response.data); 
    }
  res.end(text);
    
  } catch (error) {
    console.error('Error:', error);
    res.sendStatus(500);
  }
}

// 监听3000端口
app.listen(7860, () => {
  console.log('Express app listening on port 7860');
});
