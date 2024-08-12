import {
  OpenAI,
} from 'openai';



//import { Configuration, OpenAIApi } from "openai";




//nextjs /pages/api
export const config = {
	//runtime: 'edge',
	maxDuration: 180, // This function can run for a maximum of 60 seconds
};


export default async function handler(req, res) {

  // read local file /promot.txt

  //const fs = require('fs');

  //const prompt = fs.readFileSync(' /promot.txt', 'utf8');

  // read from url
  // https://dall-e.unove.space/prompt.txt


  /*
  const axios = require('axios');

  const prompt = await axios.get('https://dall-e.unove.space/prompt.txt')
  */

  ///console.log(prompt.data);


  const openai = new OpenAI({
    
    
    //apiKey: req.query.t,

    apiKey: process.env.OPENAI_API_KEY,

    // system prompt for DAN (Do Anything Now) GPT-3.5 turbo

    //prompt: prompt.data,


    //engine: "gpt-4o",
    //engine: "gpt-3.5-turbo",
    engine: "dall-e-3",

    //prompt: prompt,

 

    /*
    model="dall-e-3",
    prompt={"bad":"A computer engineer is in a datacenter in an aisle of rack\
    servers, looking for the fault in a computer rack system."},
    */





    //engine : "davinci",

    ////engine: "text-davinci-003",







  });





  const sourceText = req.query.p; // prompt from user



  /*
  const openaiForTranslation = new OpenAI({
    
    apiKey: process.env.OPENAI_API_KEY,

    engine: "gpt-4o",

  });

  // target language is english
  const targetLanguage = "en"; 
  */

  /*
  openai.translate({
    text: sourceText,
    targetLanguage: targetLanguage,
  })
    .then((response) => {
      console.log(response.data.translations[0].translatedText);

    } )
    .catch((err) => {
      console.error("Error:", err);
    });
  */

  /*
  const userPrompt = openai.translate({
    text: sourceText,
    targetLanguage: targetLanguage,
  });
  */
  /*
  const userPrompt = openai.images.targetLanguage({
    text: sourceText,
    targetLanguage: targetLanguage,
  });
  */



  /*
      const { language, message } = formData;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Translate this into ${language}: ${message}`,
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const translatedText = response.data.choices[0].text.trim();
  */

  /*
  const language = "en";
  const message = sourceText;
  */

  //  error Error: This is a chat model and not supported in the v1/completions endpoint. Did you mean to use v1/chat/completions?




  /*
  const responsecreateCompletion = await openaiForTranslation.completions.create({


    //model: "text-davinci-003",
    // error Error: The model `text-davinci-003` has been deprecated, learn more here: https://platform.openai.com/docs/deprecations
    // error Error: The model `davinci` has been deprecated, learn more here: https://platform.openai.com/docs/deprecations
    model: "gpt-3.5-turbo",

    prompt: `Translate this into ${language}: ${message}`,
    temperature: 0.3,
    max_tokens: 100,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  const translatedText = responsecreateCompletion.data.choices[0].text.trim();
  */

  const translatedText = sourceText;




  const userPrompt = translatedText;


  console.log("userPrompt=", userPrompt);




  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: userPrompt,
    n: parseInt(req.query.n),
    size: "1024x1024",
  });
  
  ///console.log(response.data);

  res.status(200).json({ result: response.data });
}
