import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';

export interface ImageProps {
  _id: string;
  prompt: string;
  englishPrompt: string;
  image: string;
  erc721ContractAddress: string;
  tokenid: number;
  createdAt: string;
  updatedAt: string;
  userid: string;
  username: string;
  likes: number;

}

export async function insertOne(data: any) {

  //console.log('insertOne data: ' + JSON.stringify(data));

  if (!data.userid) {
    return null;
  }

  if (!data.prompt) {
    return null;
  }


  if (!data.url) {
    return null;
  }

  if (!data.image) {
    return null;
  }




  const client = await clientPromise;
  const collection = client.db('vienna').collection('images');


  // check if image already exists
  const existing = await collection.findOne<ImageProps>(
    {
      url: data.url,
    },
  );

  if (existing) {
    console.log('image already exists');
    return null;
  }

  
  const result = await collection.insertOne(
    {
      userid: data.userid,
      username: data?.username,
      prompt: data.prompt,
      englishPrompt: data.englishPrompt,
      url: data.url,
      image: data.image,
      erc721ContractAddress: data.erc721ContractAddress,
      tokenid: data.tokenid,
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


// find one by url
export async function findOneByUrl(data: any) {

  console.log('findOne data: ' + JSON.stringify(data));

  if (!data.url) {
    return null;
  }

  const client = await clientPromise;

  const collection = client.db('vienna').collection('images');

  const result = await collection.findOne<ImageProps>(
    {
      url: data.url,
    },
  );

  ///console.log('findOne result: ' + JSON.stringify(result));


  return result;

}



export async function findOneByImage(data: any) {

  console.log('findOne data: ' + JSON.stringify(data));

  if (!data.image) {
    return null;
  }




  const client = await clientPromise;
  const collection = client.db('vienna').collection('images');

  const result = await collection.findOne<ImageProps>(
    {
      image: data.image,
    },
  );

  ///console.log('findOne result: ' + JSON.stringify(result));


  return result;
}


// update image by image
export async function updateOneByImage(data: any) {
  
  console.log('updateOneByImage data: ' + JSON.stringify(data));
  /*
  {"image":"https://vzrcy5vcsuuocnf3.public.blob.vercel-storage.com/OYTpmpp-X3KKAlnTGfjRPjMRo1ViE2fGJfwk4w.png",
  "erc721ContractAddress":"0x004dAa3329b00572A6dF3E63A22Ee791dA700b1a",
  "tokenId":1}
  */


  if (!data.image) {
    return null;
  }

  if (!data.erc721ContractAddress) {
    return null;
  }

  if (!data.tokenid) {
    return null;
  }


  const saleInfo = data.saleInfo;


  const tokenid = parseInt(data.tokenid);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('images');

  const result = await collection.updateOne(
    {
      image: data.image,
    },
    {
      $set: {
        erc721ContractAddress: data.erc721ContractAddress,
        tokenid: tokenid,
        updatedAt: new Date().toISOString(),
        saleInfo: saleInfo,
        likes: 0,
      },
    },
  );

  console.log('updateOneByImage result: ' + JSON.stringify(result));




  return {
    result: result,
  };

}




// find all (image) by userid ordr by createdAt desc recent 100 images
export async function findAll(data: any) {
  

  const client = await clientPromise;
  const collection = client.db('vienna').collection('images');

  // _id, userid, prompt, englishPrompt, image, erc721ContractAddress, tokenid, createdAt

  try {
    const result = await collection.find (
      {},
      {
        projection: {
          _id: 1,
          userid: 1,
          prompt: 1,
          englishPrompt: 1,
          image: 1,
          erc721ContractAddress: 1,
          tokenid: 1,
          createdAt: 1,
        }
      }
    ).sort({createdAt: -1}).limit(500).toArray();


    ///console.log('findAll result: ' + JSON.stringify(result));

    return result;

  } catch (error) {
    console.log('findAll error: ' + error);
  }


  return null;

}



// find all (image) by userid ordr by createdAt desc recent 5 images
export async function findAllByUserid(data: any) {
  
  ///console.log('findAllByUserid data: ' + JSON.stringify(data));

  if (!data.userid) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('images');

  const result = await collection.find(
    {
      userid: data.userid,
    },
    {
      projection: {
        _id: 1,
        userid: 1,
        prompt: 1,
        englishPrompt: 1,
        image: 1,
        erc721ContractAddress: 1,
        tokenid: 1,
        createdAt: 1,
      }
    },

  ).sort({createdAt: -1}).toArray();

  ///console.log('findAllByUserid result: ' + JSON.stringify(result));

  return result;
}


// delete image by image
export async function deleteOneByImage(data: any) {
  
  console.log('deleteOneByImage data: ' + JSON.stringify(data));

  if (!data.image) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('images');

  // when erc721ContractAddress is null, delete image

  // check erc721ContractAddress is null

  const resultCheck = await collection.findOne<ImageProps>(
    {
      image: data.image,
    },
  );

  if (!resultCheck) {
    return null;
  }

  if (resultCheck.erc721ContractAddress) {
    return null;
  }

  const result = await collection.deleteOne(
    {
      image: data.image,
    },
  );

  

  return {
    result: result,
  };

}



// find all Nfts
export async function findAllNFTs(data: any) {
    
  ///console.log('findAllNFTs data: ' + JSON.stringify(data));

  const client = await clientPromise;
  const collection = client.db('vienna').collection('images');

  // select erc721ContractAddress is not null and not empty string and not undefined

  const result = await collection.find(
    {
      erc721ContractAddress:
      {
        $ne: '',
      }
    },
    {
      projection: {
        _id: 1,
        userid: 1,
        username: 1,
        prompt: 1,
        englishPrompt: 1,
        image: 1,
        erc721ContractAddress: 1,
        tokenid: 1,
        createdAt: 1,
        updatedAt: 1,
        likes: 1,

      }
    },
  ).sort({updatedAt: -1}).toArray();

  return result;
}



// find all (image) by userid ordr by createdAt desc recent 5 images
export async function findAllNFTsByUserid(data: any) {
  
  ///console.log('findAllByUserid data: ' + JSON.stringify(data));

  if (!data.userid) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('images');

  // select erc721ContractAddress is not null and not empty string and not undefined

  const result = await collection.find(
    {
      userid: data.userid,
      erc721ContractAddress:
      {
        $ne: '',
      }
    },
    {
      projection: {
        _id: 1,
        userid: 1,
        prompt: 1,
        englishPrompt: 1,
        image: 1,
        erc721ContractAddress: 1,
        tokenid: 1,
        createdAt: 1,
        updatedAt: 1,
        likes: 1,
      }
    },
  ).sort({updatedAt: -1}).toArray();

  return result;
}










// update image by image
export async function likeOneByImage(data: any) {
  
  console.log('linkeOneByImage data: ' + JSON.stringify(data));

 

  if (!data.imageid) {
    return null;
  }

  if (!data.userid) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('vienna').collection('images');

  // likes count plus one
  // if likes is null, set likes to 1
  const result = await collection.updateOne(
    {
      _id: new ObjectId(data.imageid),
    },

    // if likes is not exist, set likes to 1
    // if likes is exist, increment likes by 1
    {
      $inc: {likes: 1},
    },

  );

  if (!result) {
    return null;
  }


  // add imageLike
  const collectionImageLikes = client.db('vienna').collection('imageLikes');
  const resultImageLikes = await collectionImageLikes.insertOne(
    {
      imageid: data.imageid,
      userid: data.userid,
      createdAt: new Date().toISOString(),
    }
  );


  return {
    result: resultImageLikes,
  };

}
