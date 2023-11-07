// src/handleRequest.js
// 这个模块定义了一个handleRequest函数，用来处理不同的请求，并返回相应的响应
import fetch from 'node-fetch';

export async function handleRequest(request) {
  //  const url = new URL(request.url);
  let serverUrl = 'https://sydney.bing.com';

  // 如果需要，可以将serverUrl替换为您的服务器地址
  let fetchUrl = new URL(request.url);
  fetchUrl.hostname = serverUrl;

  let serverRequest = new Request(fetchUrl, request);
  //  serverRequest.headers.set('Host', 'sydney.bing.com');
  serverRequest.headers.set('Origin', 'https://www.bing.com');
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
