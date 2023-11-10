const express = require('express');
const request = require('request');

const SYDNEY_ORIGIN = 'https://www.bing.com';
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
];

const app = express();

// Handle all requests
app.use((req, res) => {
  // Get the target url from the request url
  const targetUrl = SYDNEY_ORIGIN + req.url;

  // Filter and modify the headers you want
  const headers = {};
  for (const key of Object.keys(req.headers)) {
    if (KEEP_REQ_HEADERS.includes(key)) {
      headers[key] = req.headers[key];
    }
  }
//  headers['origin'] = SYDNEY_ORIGIN;
  headers['referer'] = 'https://www.bing.com/search?q=Bing+AI';
 // const randIP = '163.47.101.101';
 // headers['X-Forwarded-For'] = randIP;

  const cookie = req.headers['cookie'] || '';
  let cookies = cookie;
  if (!cookie.includes('_U=')) {
    cookies += '; _U=' + 'xxxxxx';
  }
//  headers['cookie'] = cookies;

  // Send the request to the target url with the modified headers
  request(
    {
      url: targetUrl,
      method: req.method,
      headers: headers,
      body: req.body,
    },
    (error, response, body) => {
      if (error) {
        // Handle error
        console.error(error);
        res.status(500).send('Something went wrong');
      } else {
        // Send the response back to the client
        res.status(response.statusCode).set(response.headers).send(body);
      }
    }
  );
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
