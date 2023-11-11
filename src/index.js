// 导入express模块
const express = require('express');
// 导入Request模块
const request = require('request');
// 导入ws模块
const WebSocket = require('ws');

// 创建一个express应用
const app = express();

// 创建一个WebSocket服务器
const wss = new WebSocket.Server({ noServer: true });

// 处理GET /请求的路由
app.get('/', (req, res) => {
  // 返回一个简单的响应
  res.send('Hello, world!');
});

// 设置跨域访问的中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
  res.header('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    // 如果是预检请求，直接返回200
    res.sendStatus(200);
  } else {
    // 否则继续下一个中间件
    next();
  }
});

// 处理WebSocket请求的中间件
app.use((req, res, next) => {
  const upgradeHeader = req.headers['upgrade'];
  if (upgradeHeader === 'websocket') {
    // 如果是WebSocket请求，调用handleWebSocket函数
    handleWebSocket(req, res);
  } else {
    // 否则继续下一个中间件
    next();
  }
});

// 处理WebSocket请求的函数
async function handleWebSocket(req, res) {
  // 如果需要，可以将serverUrl替换为您的服务器地址
  let serverUrl = "https://sydney.bing.com";
   let fetchUrl = new URL(req.url,serverUrl);
   fetchUrl.hostname = serverUrl;

//  const currentUrl = new URL(req.url);
//  const fetchUrl = new URL(serverUrl + currentUrl.pathname + currentUrl.search);
//  let serverRequest = new request.Request(fetchUrl, req);

// 获取一个已有的请求对象（req）的请求头
let headers = req.headers;
// 创建一个新的Request对象，复制请求头
let serverRequest = new request.Request({
  // 指定一个完全合格的URI
  uri: fetchUrl,
  // 指定请求头
  headers: headers
}, function(error, response, body) {
  // 在回调函数中处理响应或错误
  if (error) {
    console.error('error:', error);
  } else {
    console.log('statusCode:', response.statusCode);
    console.log('body:', body);
  }
});

                               
  // serverRequest.headers['Host'] = 'sydney.bing.com';
  serverRequest.headers['origin'] =  'https://www.bing.com';
  serverRequest.headers['referer'] = 'https://www.bing.com/search?q=Bing+AI';

 // const cookie = serverRequest.headers.get('Cookie') || '';
  const cookie = serverRequest.headers['Cookie'] || '';
  let cookies = cookie;
  if (!cookie.includes('_U=')) {
    cookies += '; _U=' + '';
  }

  serverRequest.headers['Cookie'] = cookies;

  const response = await fetch(serverRequest);
  
  // 如果服务器返回了101状态码，表示升级协议成功
  if (response.status === 101) {
    // 使用wss.handleUpgrade方法来建立WebSocket连接
    wss.handleUpgrade(serverRequest, res.socket, Buffer.alloc(0), (ws) => {
      // 将服务器返回的响应头设置到WebSocket对象上
      ws.headers = response.headers;
      // 创建一个双向流来转发数据
      const duplex = WebSocket.createWebSocketStream(ws);
      // 将服务器返回的响应体转发到客户端
      response.body.pipe(duplex);
      // 将客户端发送的数据转发到服务器
      duplex.pipe(response.body);
    });
  } else {
    // 如果服务器返回了其他状态码，表示升级协议失败
    // 将服务器返回的响应发送给客户端
    res.send(response);
  }
}

// 监听3000端口
app.listen(3000, () => {
  console.log('Express app listening on port 3000');
});
