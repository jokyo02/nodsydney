// src/index.js
// 这个模块是合并后的js代码文件，包含了handleRequest函数和Express应用的定义
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

// 定义一个handleRequest函数，用来处理不同的请求，并返回相应的响应
async function handleRequest(request) {
  //  const url = new URL(request.url);
  let serverUrl = 'https://copilot.microsoft.com';

  // 如果需要，可以将serverUrl替换为您的服务器地址
  let fetchUrl = new URL(request.url);
  fetchUrl.hostname = serverUrl;

  let serverRequest = new Request(fetchUrl, request);
  // serverRequest.headers.set('Host', 'copilot.microsoft.com');
  serverRequest.headers.set('Origin', 'https://copilot.microsoft.com');
  //  console.log("This is sydney!")

  const cookie = request.headers.get('Cookie') || '';
  let cookies = cookie;

  if (!cookie.includes('KievRPSSecAuth=')) {
    cookies += '; KievRPSSecAuth=' + '074AD7F106536BC6392FC4C907CA6AEA'; //randomString(512);
  }

  if (!cookie.includes('_RwBf=')) {
    cookies += '; _RwBf=' + '074AD7F106536BC6392FC4C907CA6AEA'; // randomString(256);
  }

  if (!cookie.includes('MUID=')) {
    cookies += '; MUID=' + '074AD7F106536BC6392FC4C907CA6AEA'; //randomString(256);
  }

  if (!cookie.includes('_U=')) {
    cookies += '; _U=' + 'xxxxxx'; //randomString(128);
  }

  serverRequest.headers.set('Cookie', cookies);

  //  return await fetch(serverRequest);
  //return await fetch(serverRequest, {cf: {resolveOverride: serverUrl}});
  //-------------
  const res = await fetch(serverRequest);
  // await fetch(serverRequest, {cf: {resolveOverride: serverUrl}});
  const newRes = new Response(res.body, res);

  //newRes.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin'));
  newRes.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
  newRes.headers.set('Access-Control-Allow-Credentials', 'true');
  newRes.headers.set('Access-Control-Allow-Headers', '*');

  // 创建一个新的URL对象，指向http://ipecho.net/plain
  let Ipurl = new URL('http://ipecho.net/plain');
  // 使用fetch函数获取该URL的响应
  let Ipresponse = await fetch(Ipurl);
  // 如果响应状态码为200，表示成功
  //   if (Ipresponse.status == 200) {
  // 获取响应的文本内容
  let textip = await Ipresponse.text();

  newRes.headers.set('TestLog', 'This is Sydney@' + textip);

  // 添加一个判断条件，如果请求的方法是OPTIONS，就返回一个带有CORS头部的空响应，状态码为204
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: newRes.headers,
    });
  }

  return newRes;
  //------------
}

// 创建一个Express应用对象
const app = express();

// 使用cors中间件来允许跨域请求
app.use(cors());

// 使用bodyParser中间件来解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 定义一个GET路由，用来处理从根路径发来的请求
app.get('/', (req, res) => {
  // 调用handleRequest函数，传入req对象，得到一个Promise对象
  handleRequest(req)
    .then((response) => {
      // 如果Promise对象成功解决，就把response对象的内容发送给客户端
      res.status(response.status).set(response.headers).send(response.body);
    })
    .catch((error) => {
      // 如果Promise对象被拒绝，就把错误信息发送给客户端，状态码为500
      res.status(500).send(error.message);
    });
});

// 定义一个POST路由，用来处理从根路径发来的请求
app.post('/', (req, res) => {
  // 调用handleRequest函数，传入req对象，得到一个Promise对象
  handleRequest(req)
    .then((response) => {
      // 如果Promise对象成功解决，就把response对象的内容发送给客户端
      res.status(response.status).set(response.headers).send(response.body);
    })
    .catch((error) => {
      // 如果Promise对象被拒绝，就把错误信息发送给客户端，状态码为500
      res.status(500).send(error.message);
    });
});

// 定义一个监听端口，可以根据你的需要修改
const port = 3000;

// 启动服务器，监听端口，打印一些信息
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Visit http://localhost:${port} to see the result`);
});
