import clientPromise from '../mongodb';

export interface PromptProps {
  prompt: string;
  englishPrompt: string;
  negativePrompt: string;
  createdAt: string;
}

export async function insertOne(data: any) {

  //console.log('insertOne data: ' + JSON.stringify(data));

  if (!data.prompt) {
    return null;
  }

  if (!data.englishPrompt) {
    return null;
  }

  if (!data.negativePrompt) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('vienna').collection('prompts');


  const result = await collection.insertOne(
    {
      prompt: data.prompt,
      englishPrompt: data.englishPrompt,
      negativePrompt: data.negativePrompt,
      createdAt: new Date().toISOString(),
    }
  );

  return {
    result: result,
  };

}




export async function findOne(data: any) {

  console.log('findOne data: ' + JSON.stringify(data));

  if (!data.tokenid) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('vienna').collection('images');

  const result = await collection.findOne<ImageProps>(
    {
      tokenid: data.tokenid,
    },
  );

  return result;
}


