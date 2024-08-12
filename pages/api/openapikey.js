import { OpenAI } from 'openai';




// timeout
/*
export const config = {
  api: {
    externalResolver: true,
  },
};
*/


export default async function handler(req, res) {


  const openapikey = process.env.OPENAI_API_KEY;


  ////console.log("openapikey: " + openapikey);





  res.status(200).json(openapikey);


}
