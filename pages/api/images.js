import {
  OpenAI,
} from 'openai';

import Replicate from "replicate";


import * as fal from "@fal-ai/serverless-client";


import { insertOne } from '../../lib/api/prompt';


//nextjs /pages/api
export const config = {
	//runtime: 'edge',
	maxDuration: 180, // This function can run for a maximum of 180 seconds
};

export const maxDuration = 180; // 추가한 코드
export const dynamic = 'force-dynamic'; // 추가한 코드





const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

fal.config({
  credentials: process.env.FAL_KEY,
});




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
  
  // prompt from user and trim left and right spaces
  const prompt = req.query.p?.trim();



  const userid = req.query?.userid;
  const username = req.query?.username;

  const isReal = req.query?.real;

  console.log("isReal=", isReal);



  // check prompt is english or not

  // if prompt is not english, translate it to english

  // prompt = [\u0600-\u06FF\u0750-\u077F] // Arabic
  //const isEnglish = prompt.match(/[\u0600-\u06FF\u0750-\u077F]/) == null





  //if (!isEnglish) {



    // translate prompt to english using OpenAI API

    const completion = await openai.chat.completions.create({
      //model: "gpt-4o",
      model: "gpt-3.5-turbo",
      messages: [

        // remove Original prompt: from translated text

        {"role": "system", "content": " Translate this prompt: " + prompt + " to English."
          + " response with just translated text in English."
          + " remove: Original prompt: from translated text."
        },

        {"role": "user", "content": " Translate this prompt: " + prompt + " to English."
          + " response with just translated text in English."
          + " remove: Original prompt: from translated text."
        },

        
        /*
        {"role": "system", "content": " If this prompt: " + prompt + " is not English, translate it to English and generate just translated text in English."
          + " If this prompt: " + prompt + " is already in English, please respond with just the original prompt."

          + " If you are not sure, translate it to English and generate just translated text in English."

          + " remove Original prompt: from translated text."

          + " remove Translated text in English: from translated text."

          + " remove original prompt: from translated text."


        },

        {"role": "user", "content": " If this prompt: " + prompt + " is not English, translate it to English and generate just translated text in English."
          + " If this prompt: " + prompt + " is already in English, please respond with just the original prompt."
          + " If you are not sure, translate it to English and generate just translated text in English."

          + " remove Original prompt: from translated text."

          + " remove Translated text in English: from translated text."

          + " remove original prompt: from translated text."


        },
        */

       


      ],
      stream: true,
    });

    for await (const chunk of completion) {
      
      //console.log(
      //  chunk.choices[0].delta.content + '\n'
      //);


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






  //console.log("englishPrompt=", englishPrompt);


  //const negative_prompt = "bra, covered nipples, underwear, EasyNegative, paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans, extra fingers, fewer fingers, ((watermark:2)), (white letters:1), (multi nipples), lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, bad feet, {Multiple people}, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worstquality, low quality, normal quality, jpegartifacts, signature, watermark, blurry, bad feet, cropped, poorly drawn hands, poorly drawn face,mutation,deformed,worst quality,low quality,normal quality, jpeg artifacts, signature, extra fingers, fewer digits, extra limbs,extra arms,extra legs,malformed limbs,fused fingers, too many fingers, long neck, cross-eyed, mutated hands, polar lowres, bad body, bad proportions, gross proportions, text, error, missing fingers, missing arms, extra arms, missing legs, wrong feet bottom render,extra digit, abdominal stretch, glans, pants, briefs, knickers, kecks, thong, {{fused fingers}}, {{bad body}}";


  //const negative_prompt = "EasyNegative, paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans, extra fingers, fewer fingers, ((watermark:2)), (white letters:1), (multi nipples), lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, bad feet, {Multiple people}, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worstquality, low quality, normal quality, jpegartifacts, signature, watermark, blurry, bad feet, cropped, poorly drawn hands, poorly drawn face, mutation, deformed, worst quality, low quality, normal quality, jpeg artifacts, signature, extra fingers, fewer digits, extra limbs, extra arms, extra legs,malformed limbs,fused fingers, too many fingers, long neck, cross-eyed, mutated hands, polar lowres, bad body, bad proportions, gross proportions, text, error, missing fingers, missing arms, extra arms, missing legs, wrong feet bottom render,extra digit, abdominal stretch, glans, pants, briefs, knickers, kecks, thong, {{fused fingers}}, {{bad body}}";

  //const negative_prompt = "nsfw, NSFW, naked, nude, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans, extra fingers, fewer fingers, ((watermark:2)), (white letters:1), (multi nipples), lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, bad feet, multi arms, multi legs, bad arm anatomy, bad leg anatomy, bad hand anatomy, bad finger anatomy"
  //+ "text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck";

  const negative_prompt = "easynegative,ng_deepnegative_v1_75t,((monochrome)),((grayscale)),bad-picture-chill-75v, (worst quality, low quality:1.4), monochrome, grayscale, sketches, paintings, lowres, normalres, blurry, acnes on face, {{sperm}}, {{bra}}";

  //const negative_prompt = "";


  const resultInsertOne = await insertOne({
    prompt: prompt,
    englishPrompt: englishPrompt,
    negativePrompt: negative_prompt,
    userid: userid,
    username: username,
  });

  //console.log("resultInsertOne=", resultInsertOne);


  let input = {
      ///seed: 4234234,

      prompt: englishPrompt,

      output_quality: 90,

      //image_size: "square",
      //image_size: "square",
      image_size: "square_hd",

      disable_safety_checker: true,

      negative_prompt: negative_prompt,
  };


  let model = "";

  // random model

  
  /*
  let randomModel = Math.floor(Math.random() * 10);

  randomModel = 2;


  console.log("randomModel=", randomModel);

  let hosting = "replicate";

  if (randomModel == 0) {
    
    model = "black-forest-labs/flux-schnell";

  } else if (randomModel == 1) {

    model = "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f";
  
  } else if (randomModel == 2) {

    //model = "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f";

    model = "datacte/proteus-v0.2:06775cd262843edbde5abab958abdbb65a0a6b58ca301c9fd78fa55c775fc019";
  
  } else if (randomModel == 3) {

    model = "playgroundai/playground-v2.5-1024px-aesthetic:a45f82a1382bed5c7aeb861dac7c7d191b0fdf74d8d57c4a0e6ed7d4d0bf7d24";
  
  } else if (randomModel == 4) {
    
    model = "lucataco/dreamshaper-xl-turbo:0a1710e0187b01a255302738ca0158ff02a22f4638679533e111082f9dd1b615";
  
  } else if (randomModel == 5) {
  
    model = "black-forest-labs/flux-schnell";

  } else if (randomModel == 6) {

    model = "playgroundai/playground-v2.5-1024px-aesthetic:a45f82a1382bed5c7aeb861dac7c7d191b0fdf74d8d57c4a0e6ed7d4d0bf7d24";


  } else if (randomModel >= 7) {

    hosting = "fal";

    
    model = "fal-ai/flux-realism";

    //model = "fal-ai/fast-lcm-diffusion";

  }

  ////model = "lucataco/realistic-vision-v5:8aeee50b868f06a1893e3b95a8bb639a8342e846836f3e0211d6a13c158505b1";


  // nsfw model
  //model = "adirik/realvisxl-v4.0:85a58cc71587cc27539b7c83eb1ce4aea02feedfb9a9fae0598cebc110a3d695";
  */

  console.log("englishPrompt=", englishPrompt);



  let hosting = "";

  let randomModel = Math.floor(Math.random() * 5) + 0;
  //console.log("randomModel=", randomModel);

  //randomModel = 3;


  if (isReal == "true") {
    // randomModel is 5 or 6 or 7
    
    randomModel = Math.floor(Math.random() * 3) + 5;
  }

  console.log("randomModel=", randomModel);

  if (randomModel == 0) {
    hosting = "replicate";
    model = "datacte/proteus-v0.2:06775cd262843edbde5abab958abdbb65a0a6b58ca301c9fd78fa55c775fc019";
  
  } else if (randomModel == 1) {
    hosting = "replicate";
    model = "playgroundai/playground-v2.5-1024px-aesthetic:a45f82a1382bed5c7aeb861dac7c7d191b0fdf74d8d57c4a0e6ed7d4d0bf7d24";
  
  } else if (randomModel == 2) {
    hosting = "fal";
    model = "fal-ai/flux-pro";

  } else if (randomModel == 3) {
    hosting = "replicate";
    model = "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f";

  } else if (randomModel == 4) {
    hosting = "replicate";
    model = "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f";



  } else if (randomModel == 5) {
    hosting = "fal";
    model = "fal-ai/flux-realism";
  } else if (randomModel == 6) {
    hosting = "fal";
    model = "fal-ai/flux/dev";
  } else if (randomModel == 7) {
    hosting = "fal";
    model = "fal-ai/flux/schnell";
  } 


  let output = [];

  if (hosting == "replicate") {
    output = await replicate.run(

      model,
      { input }
    );
  
  } else if (hosting == "fal") {



    //const data = await fal.subscribe("fal-ai/flux-realism", {
    const data = await fal.subscribe(model, {

      input: {
        ///seed: 4072637067,
        prompt: englishPrompt,
        num_images: 1,
        enable_safety_checker: false,

      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    ///console.log(data);

    //const output = data.images[0]?.url;
    // output is array of images
    output = [
      data.images[0]?.url,
    ];

  }
  
  

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
    result.push({
      prompt: prompt,
      englishPrompt: englishPrompt,
      url: element
    });
  } );
  


  /*
  //result.push({ url: output });


  /// https://www.olgagpt.com/sub/createNFT.asp?userid=aaaa2&image=https://fal.media/files/tiger/ibDYR3ayLebb0wzzlKIPH.png

  //const url = "https://www.olgagpt.com/sub/createNFT.asp?userid=" + userid + "&image=" + output[0];


  // url encode image url

  // if userid is not null, create NFT

  if (userid != null && userid != 'null' && userid != "" && output[0] != null && output[0] != "") {
    const url = "https://www.olgagpt.com/sub/createNFT.asp?userid=" + userid + "&image=" + encodeURIComponent(output[0]);
    console.log(url);
    const callback = await fetch(url);
  }
  */





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
