import { OpenAI } from 'openai';






export default async function handler(req, res) {


  const openapikey = process.env.OPENAI_API_KEY;


  return openapikey;
}
