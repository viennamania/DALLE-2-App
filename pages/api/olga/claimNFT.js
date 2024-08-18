import {
  OpenAI,
} from 'openai';

import Replicate from "replicate";


import * as fal from "@fal-ai/serverless-client";


import {
  createThirdwebClient,
  getContract,
  sendAndConfirmTransaction,
} from "thirdweb";

import { polygon } from "thirdweb/chains";


import {
  privateKeyToAccount,
  smartWallet,
  getWalletBalance,
  
 } from "thirdweb/wallets";


import {
  claimTo,
  mintTo,
  mintAdditionalSupplyTo,
  totalSupply,
  nextTokenIdToMint,

  //nextTokenIdToClaim,

  getTotalClaimedSupply,

  safeTransferFrom,

  tokenUri,

} from "thirdweb/extensions/erc721";
 




import {
  findOneByImage,
	insertOne,
} from '../../../lib/api/image';





//nextjs /pages/api
export const config = {
	//runtime: 'edge',
	maxDuration: 60, // This function can run for a maximum of 60 seconds
};

export const maxDuration = 60; // 추가한 코드
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





const chain = polygon;

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY || "",
});


  



//console.log("=====Account address: ", account.address);


// erc721 contract address
const nftContractAddress = "0xf7EC05E78477939CfaD0BfC87C9438a6Be05ACa8";





export default async function handler(req, res) {


  // get parameters from the request

  const image = req.query.image;

  console.log("image: ", image);




  if (!image) {
    return res.status(400).json({
      result: "error",
      message: "image is required",
    });
  }


  // if already minted, return the token id

  const existingData = await findOneByImage(
    {
      image: image,
    }
  );

  if (existingData) {

    return res.status(200).json({
      result: "success",
      message: "Already minted",
      tokenId: existingData.tokenid,
      opensea: `https://opensea.io/assets/matic/${nftContractAddress}/${existingData.tokenid}`,
    });

  }




  const contract = getContract({
    client,
    chain: chain,
    //address: nftDropAddress, // deploy a drop contract from thirdweb.com/explore
    address: nftContractAddress, // deploy a drop contract from thirdweb.com/explore
  });



  const totalClaimedSupply = await getTotalClaimedSupply({
    contract: contract,
  });
  

  const tokenId = parseInt(totalClaimedSupply.toString(), 10);

  console.log("Token ID: ", tokenId);
  

  const result = await insertOne({
    image: image,
    tokenid: tokenId,
  });

  ///console.log("result: ", result);







  // smartwallet account
  const personalAccount = privateKeyToAccount({
    client,
    privateKey: process.env.WALLET_PRIVATE_KEY || "",
  }); // private key account




  // Configure the smart wallet

  const wallet = smartWallet({
    chain: chain,
    factoryAddress: "0x9Bb60d360932171292Ad2b80839080fb6F5aBD97", // your own deployed account factory address
    sponsorGas: true,
  });




  // Connect the smart wallet
  const account = await wallet.connect({
    client: client,
    personalAccount: personalAccount,
  });


  console.log("=====Account address: ", account.address);





  const toAddress = account.address;






  //const image = 'https://vzrcy5vcsuuocnf3.public.blob.vercel-storage.com/G3GYQwQ-wyenYZzp3CNgNZo7MWZqKONinhm0sq.png';


  /*
  const transactionMintTo = mintTo({
    contract,
    to: toAddress,
    nft: {
      name: "OLGA NFT",
      description: "OLGA NFT",


      image: image,


      //animation_url: imageUrl,

      attributes: [
        
        {
          trait_type: "DancerCreatorName",
          value: "OLGA",
        },
        

      ],

    },
  });


  const sendData = await sendAndConfirmTransaction({
    transaction: transactionMintTo,
    account: account,
  });
  */


  const transactionClaimTo = claimTo({
    contract: contract,
    to: toAddress,
    quantity: BigInt(1),
  });



  const sendData = await sendAndConfirmTransaction({
    transaction: transactionClaimTo,
    account: account,
  });



  console.log("Claimed successfully!");





  res.status(200).json({
    result: "success",
    message: "Minted successfully!",
    transactionHash: sendData.transactionHash,
    tokenId: tokenId,
    opensea: `https://opensea.io/assets/matic/${nftContractAddress}/${tokenId}`,
  });


}
