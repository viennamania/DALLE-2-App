

export default async function handler(req, res) {

 
  const { balance, token } = req.body;

  //console.log('balance', balance);
  //console.log('token', token);


  const response = await fetch('https://olgagpt.com/server/processLogin.asp', {
    method: 'POST',
    body: JSON.stringify({
      userId: 'aaaa2',
      userPass: '000000'
    })
  })


  /*
  Response {
    status: 200,
    statusText: 'OK',
    headers: Headers {
      'cache-control': 'no-store,private',
      pragma: 'no-cache',
      'content-type': 'text/html; Charset=utf-8',
      expires: 'Sat, 24 Aug 2024 13:56:45 GMT',
      server: 'Microsoft-IIS/10.0',
      'set-cookie': 'UserInfo=Nation=US; path=/, ASPSESSIONIDAWAAADTS=AKJBHJNANEIBNPNKALDNELMH; secure; path=/',
      'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers,Authorization',
      'access-control-allow-methods': 'POST, GET, OPTIONS',
      'access-control-allow-origin': '*',
      'access-control-max-age': '3600',
      date: 'Sat, 24 Aug 2024 13:56:45 GMT',
      'content-length': '63'
    },
    body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
    bodyUsed: false,
    ok: true,
    redirected: false,
    type: 'basic',
    url: 'https://olgagpt.com/server/processLogin.asp'
  }
  */


  // check response
  console.log('response', response);

  response.headers.forEach((value, name) => {
    console.log(name, value);
  });

  /*
  access-control-allow-headers Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers,Authorization
  access-control-allow-methods POST, GET, OPTIONS
  access-control-allow-origin *
  access-control-max-age 3600
  cache-control no-store,private
  content-length 63
  content-type text/html; Charset=utf-8
  date Sat, 24 Aug 2024 13:59:51 GMT
  expires Sat, 24 Aug 2024 13:59:51 GMT
  pragma no-cache
  server Microsoft-IIS/10.0
  set-cookie UserInfo=Nation=US; path=/
  set-cookie ASPSESSIONIDAWAAADTS=BKJBHJNALLMIPIHBFPHCDOPK; secure; path=/
  */







  
  ////const data = await response?.json();

  res.status(200).json(
    {
      data: 'hello'
    }
  );

}
