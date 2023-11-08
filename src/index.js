// 导入express模块
const express = require('express');
// 导入request模块
const request = require('request');


// 导入node-fetch模块
const fetch = require('node-fetch');

// 创建一个express应用对象
const app = express();

// 定义一个中间件函数，用来处理所有的请求
app.use(async (req, res) => {
  // 获取请求的URL
  const requestUrl = req.url;

  // 设置代理的目标URL
  let serverUrl = 'https://sydney.bing.com';

  // 创建一个新的URL对象，用来拼接代理的URL
  const currentUrl = new URL(requestUrl, serverUrl);

  // 创建一个新的请求对象，用来发送代理的请求
  let serverRequest = new Request(currentUrl, req);
  // 设置请求头部
  serverRequest.headers.set('Origin', 'https://www.bing.com');
  serverRequest.headers.set('Host', 'www.example.com');

  // 获取请求头部中的Cookie
  const cookie = serverRequest.headers.get('Cookie') || '';
  let cookies = cookie;
  // 如果Cookie中没有_U，就添加一个
  if (!cookie.includes('_U=')) {
    cookies += '; _U=' + 'xxxxxx';
  }

  // 设置请求头部中的Cookie
  serverRequest.headers.set('Cookie', cookies);

  // 使用fetch函数发送代理的请求，并获取响应
  const response = await fetch(serverRequest);
  // 克隆响应对象，以便后续操作
  const newResponse = response.clone();

  // 创建一个新的URL对象，指向http://ipecho.net/plain
  let Ipurl = new URL('http://ipecho.net/plain');
  // 使用fetch函数获取该URL的响应
  let Ipresponse = await fetch(Ipurl);
  // 获取响应的文本内容
  let textip = await Ipresponse.text();

  // 设置响应头部
  newResponse.headers.set('TestLog', 'This is Sydney@' + textip);
  const Guestip = req.headers.get('cf-connecting-ip');
  newResponse.headers.set('Guestip', Guestip);

  // 将响应发送给客户端
  res.status(newResponse.status).set(newResponse.headers).send(newResponse.body);
});

// 定义一个监听端口，可以根据你的需要修改
const port = 3000;

// 启动服务器，监听端口，打印一些信息
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Visit http://localhost:${port} to see the result`);
});
