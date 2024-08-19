import clientPromise from '../mongodb';


export interface WalletProps {
  userid: string;
  walletAddress: string;
  walletPrivateKey: string;
}

export async function insertOne(data: any) {

  //console.log('insertOne data: ' + JSON.stringify(data));

  if (!data.userid) {
    return null;
  }

  if (!data.walletAddress) {
    return null;
  }

  if (!data.walletPrivateKey) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('vienna').collection('wallets');



  
  const result = await collection.insertOne(
    {
      userid: data.userid,
      walletAddress: data.walletAddress,
      walletPrivateKey: data.walletPrivateKey,
      createdAt: new Date().toISOString(),
    }
  );

  return {
    result: result,
  };

}




export async function findOne(data: any) {

  console.log('findOne data: ' + JSON.stringify(data));

  if (!data.userid) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('vienna').collection('wallets');

  const result = await collection.findOne<WalletProps>(
    {
      userid: data.userid,
    },
  );


  return result;
}



// updateERC721ContractAddress
export async function updateERC721ContractAddress(data: any) {

  console.log('updateERC721ContractAddress data: ' + JSON.stringify(data));

  if (!data.userid) {
    return null;
  }

  if (!data.erc721ContractAddress) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('vienna').collection('wallets');

  const result = await collection.updateOne(
    { userid: data.userid },
    { $set: { erc721ContractAddress: data.erc721ContractAddress, updatedAt: new Date().toISOString() } }
  );

  return {
    result: result,
  };

}
