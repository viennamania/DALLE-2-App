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


  res.status(200).json(openapikey);


}
