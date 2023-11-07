// src/app.js
// 这个模块是Express应用的入口文件，引入了其他的模块，定义了路由，启动了服务器
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { handleRequest } from './handleRequest.js';

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
