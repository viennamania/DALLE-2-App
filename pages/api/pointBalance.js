

  // https://www.olgagpt.com/sub/pointBalance.asp?balance=POWER&token=06eb43de00654b4fb9e2af4ba70e217f1bDbJsIsIxNIjPARc4
  // {"rescode":"Success","balance":"POWER","token":"06eb43de00654b4fb9e2af4ba70e217f1bDbJsIsIxNIjPARc4","amount":"1096"}


export default async function handler(req, res) {

 
  const { balance, token } = req.body;

  //console.log('balance', balance);
  //console.log('token', token);


  const response = await fetch(`https://www.olgagpt.com/sub/pointBalance.asp?balance=${balance}&token=${token}`);
  const data = await response.json();

  res.status(200).json(data);

}
