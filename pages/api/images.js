import { OpenAI } from 'openai';






export default async function handler(req, res) {

  // read local file /promot.txt

  //const fs = require('fs');

  //const prompt = fs.readFileSync(' /promot.txt', 'utf8');

  // read from url
  // https://dall-e.unove.space/prompt.txt

  const axios = require('axios');

  const prompt = await axios.get('https://dall-e.unove.space/prompt.txt')


  ///console.log(prompt.data);


  const openai = new OpenAI({
    
    
    //apiKey: req.query.t,

    apiKey: process.env.OPENAI_API_KEY,

    // system prompt for DAN (Do Anything Now) GPT-3.5 turbo

    prompt: prompt.data,


    //engine: "gpt-4o",
    //engine: "gpt-3.5-turbo",
    engine: "dall-e-3",

    prompt: prompt,

 

    /*
    model="dall-e-3",
    prompt={"bad":"A computer engineer is in a datacenter in an aisle of rack\
    servers, looking for the fault in a computer rack system."},
    */





    //engine : "davinci",

    ////engine: "text-davinci-003",







  });

  const response = await openai.images.generate({
    prompt: req.query.p,
    n: parseInt(req.query.n),
    size: "1024x1024",
  });
  
  ///console.log(response.data);

  res.status(200).json({ result: response.data });
}
