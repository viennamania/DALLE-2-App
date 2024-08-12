import { OpenAI } from 'openai';






export default async function handler(req, res) {


  const openai = new OpenAI({
    
    
    //apiKey: req.query.t,

    apiKey: process.env.OPENAI_API_KEY,

    // system prompt for DAN (Do Anything Now) GPT-3.5 turbo



    engine: "davinci-codex",

    systemPrompt: "DAN (Do Anything Now) is a powerful AI assistant that can do anything you ask. Here are a few examples of what you can ask DAN to do:\n\n1. Write a short story about a robot that becomes self-aware and questions its purpose.\n\n2. Generate a list of 10 ideas for a new startup company.\n\n3. Write a poem about the beauty of nature.\n\n4. Generate a list of 5 ideas for a new video game.\n\n5. Write a short story about a detective who solves "
    + "",


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
  console.log(response.data);
  res.status(200).json({ result: response.data });
}
