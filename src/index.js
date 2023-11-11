// 引入express模块
const express = require('express');
// 引入axios模块
const axios = require('axios');
// 引入ws模块
const WebSocket = require('ws');

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
  let serverUrl = "https://sydney.bing.com";
  let fetchUrl = new URL(req.url, serverUrl);
  fetchUrl.hostname = serverUrl;

  let headers = req.headers;

  // 处理cookie
  let cookies = headers.cookie || '';
  if (!cookies.includes('_U=')) {
    cookies += '; _U=';
  }
  headers.cookie = cookies;

  // 设置origin和referer
  headers.origin = 'https://www.bing.com';
  headers.referer = 'https://www.bing.com/search?q=Bing+AI';

  // 发送HTTP请求
  try {
    const response = await axios({
      url: fetchUrl.toString(),
      headers: headers
    });

    // 如果响应状态码为101，表示协议切换成功
    if (response.status === 101) {
      wss.handleUpgrade(req, res.socket, Buffer.alloc(0), (ws) => {
        ws.headers = response.headers;
        const duplex = WebSocket.createWebSocketStream(ws);
        response.data.pipe(duplex);
        duplex.pipe(response.data);
      });
    } else {
      // 设置响应头
      Object.keys(response.headers).forEach((key) => {
        res.setHeader(key, response.headers[key]);
      });
      res.send(response.data);
    }
  } catch (error) {
    console.error('Error:', error);
    res.sendStatus(500);
  }
}

// 监听3000端口
app.listen(3000, () => {
  console.log('Express app listening on port 3000');
});
