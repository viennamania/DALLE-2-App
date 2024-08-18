import clientPromise from '../mongodb';

export interface ImageProps {
  image: string;
  tokenid: number;
  createdAt: string;
  updatedAt: string;
}

export async function insertOne(data: any) {

  //console.log('insertOne data: ' + JSON.stringify(data));

  if (!data.image) {
    return null;
  }

  if (!data.tokenid) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('vienna').collection('images');




  const check = await collection.findOne<ImageProps>(
    {
      image: data.image,

    },
  );

  ///console.log('checkUser: ' + checkUser);


  if (check) {

    const result = await collection.updateOne(
      { image: data.image },
      { $set: { tokenid: data.tokenid, updatedAt: new Date().toISOString() } }
    );

    if (result.modifiedCount === 0) {
      return null;
    } else {
      return {
        image: data.image,
        tokenid: data.tokenid,
        updatedAt: new Date().toISOString(),
      };
    }

  }


  
  const result = await collection.insertOne(
    {
      image: data.image,
      tokenid: data.tokenid,
      createdAt: new Date().toISOString(),
    }
  );

  return {
    image: data.image,
    tokenid: data.tokenid,
    createdAt: new Date().toISOString(),
  };

}




export async function findOne(data: any) {

  console.log('findOne data: ' + JSON.stringify(data));

  if (!data.tokenid) {
    return null;
  }

  const tokenid = parseInt(data.tokenid);


  const client = await clientPromise;
  const collection = client.db('vienna').collection('images');

  const result = await collection.findOne<ImageProps>(
    {
      tokenid: tokenid,
    },
  );

  ///console.log('findOne result: ' + JSON.stringify(result));


  return result;
}


