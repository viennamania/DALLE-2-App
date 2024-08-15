import {
  OpenAI,
} from 'openai';

import Replicate from "replicate";


//import { Configuration, OpenAIApi } from "openai";




//nextjs /pages/api
export const config = {
	//runtime: 'edge',
	maxDuration: 180, // This function can run for a maximum of 180 seconds
};

export const maxDuration = 180; // 추가한 코드
export const dynamic = 'force-dynamic'; // 추가한 코드


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



  let englishPrompt = '';

  // translate prompt to english using OpenAI API
  
  const prompt = req.query.p; // prompt from user


  // check prompt is english or not

  // if prompt is not english, translate it to english

  // prompt = [\u0600-\u06FF\u0750-\u077F] // Arabic
  //const isEnglish = prompt.match(/[\u0600-\u06FF\u0750-\u077F]/) == null





  //if (!isEnglish) {

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // translate prompt to english using OpenAI API

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [

        {"role": "system", "content": "Translate this to English: " + prompt
          + " and generate just translated text in English. If this prompt: " + prompt + " is already in English, please respond with just the original prompt."},

        {"role": "user", "content": "Translate this to English: " + prompt
          + " and generate just translated text in English. If this prompt: " + prompt + " is already in English, please respond with just the original prompt."},


      ],
      stream: true,
    });

    for await (const chunk of completion) {
      
      console.log(
        chunk.choices[0].delta.content + '\n'
      );
      /*
      "
  Please
  create
  a
  woman
  with
  a
  beautiful
  figure
  standing
  ."
  undefined
      */

      
      if (chunk.choices[0].delta.content  != undefined && chunk.choices[0].delta.content  != null && chunk.choices[0].delta.content  != '') {
        englishPrompt = englishPrompt + chunk.choices[0].delta.content;
      }
    
    }




  //} else {

  //  englishPrompt = prompt;

  //}



  console.log("englishPrompt=", englishPrompt);




  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });


  const input = {
      prompt: englishPrompt,
      disable_safety_checker: true,
  };


  
  const output = await replicate.run(

    "black-forest-labs/flux-schnell",
    
    //"black-forest-labs/flux-dev",

    //"black-forest-labs/flux-pro",


    { input }
  );
  

  /*
  const output = await replicate.run(
    "zsxkib/stable-diffusion-safety-checker:8b5d150f3203e94cea146de593213f812fd3211993ac5dde89955783c5918583"
    , { input }
  );
  */

  console.log(output);


  // openai image generation result format
  let  result = [];

  
  output.forEach((element) => {
    result.push({ url: element });
  } );
  

  //result.push({ url: output });



  res.status(200).json({ result: result });

  return;




  /*
  const openai = new OpenAI({
    
    
    //apiKey: req.query.t,

    apiKey: process.env.OPENAI_API_KEY,

    // system prompt for DAN (Do Anything Now) GPT-3.5 turbo

    //prompt: prompt.data,


    //engine: "gpt-4o",
    //engine: "gpt-3.5-turbo",
    engine: "dall-e-3",

    //prompt: prompt,

 

    
    //model="dall-e-3",
    //prompt={"bad":"A computer engineer is in a datacenter in an aisle of rack\
    //servers, looking for the fault in a computer rack system."},
    





    //engine : "davinci",

    ////engine: "text-davinci-003",







  });

  */




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
