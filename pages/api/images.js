import { OpenAI } from 'openai';






export default async function handler(req, res) {


  const openai = new OpenAI({
    
    
    //apiKey: req.query.t,

    apiKey: process.env.OPENAI_API_KEY,

    // system prompt for DAN (Do Anything Now) GPT-3.5 turbo



    engine: "davinci-codex",


    







  });

  const response = await openai.images.generate({
    prompt: req.query.p,
    n: parseInt(req.query.n),
    size: "1024x1024",
  });
  console.log(response.data);
  res.status(200).json({ result: response.data });
}
