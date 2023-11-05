const uWebSockets = require('uWebSockets.js');
const http = require('http');

const {
	UWSProxy,
	createUWSConfig
} = require('uws-reverse-proxy');

// 使用process.env.PORT变量来获取Render分配的端口
const port = process.env.PORT || 80;

const proxy = new UWSProxy(
	createUWSConfig(
		uWebSockets,
		{ port }
	)
);

// 创建一个http服务器，用于接收反向代理转发的请求，并将响应返回给反向代理
const httpServer = http.createServer((req, res) => {
	console.log('Incoming request: ', req);

	res.writeHead(200);
	res.end('Hello world :)');
});
httpServer.listen(
	proxy.http.port,
	proxy.http.host,
	() => console.log(`HTTP Server listening at ${proxy.http.protocol}://${proxy.http.host}:${proxy.http.port}`)
);

proxy.start();

// 配置uWebSockets.js应用，创建的反向代理

// 设置websocket
proxy.uws.server.ws({
	upgrade : () => {
		//...
	}
	// ...
});

// 监听
// 使用'0.0.0.0'作为主机名来监听所有的网络接口
proxy.uws.server.listen('0.0.0.0', port, listening => {
	if(listening){
		console.log(`uWebSockets.js listening on port 0.0.0.0:${port}`);
	}else{
		console.error(`Unable to listen on port 0.0.0.0:${port}!`);
	}
});

// 设置反向代理的目标地址为https://sydney.bing.com
proxy.setTarget('https://sydney.bing.com');
