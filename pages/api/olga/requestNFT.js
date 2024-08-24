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
  mintTo,
  mintAdditionalSupplyTo,
  totalSupply,
  nextTokenIdToMint,

  safeTransferFrom,

  tokenUri,

} from "thirdweb/extensions/erc721";


import {
  findOneByUserid,
  insertOne as insertOneWallet,
  updateERC721ContractAddress,
} from '../../../lib/api/wallet';

import {
  findOneByImage,
  updateOneByImage,
} from '../../../lib/api/image';
import { token } from 'thirdweb/extensions/vote';



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


  

// requestNFT?userid=ddddd@token=3edffdss&image=3ddffsafasf.png&price=100&salesno=24082400001


export default async function handler(req, res) {


  // get parameters from the request

  ///console.log(req.query);


  const userid = req.query.token;

  console.log("userid: ", userid);



  const username = req.query.userid;




  console.log("userid: ", userid);

  if (!userid) {
    return res.status(400).json({
      result: "error",
      message: "userid is required",
    });
  }


  const image = req.query.image;

  console.log("image: ", image);

  if (!image) {
    return res.status(400).json({
      result: "error",
      message: "image is required",
    });
  }

  const prompt = req.query.prompt;

  console.log("prompt: ", prompt);

  const price = req.query.price;
  console.log("price: ", price);

  const salesno = req.query.salesno;
  console.log("salesno: ", salesno);



  ///console.log("image: ", image);


  const existingWalletData = await findOneByUserid( { userid: userid } );

  
  ///console.log("existingWalletData: ", existingWalletData);



  if (!existingWalletData) {
    return res.status(400).json({
      result: "error",
      message: "Wallet data not found",
    });
  }


  // check claimed NFT exists by image

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
      opensea: `https://opensea.io/assets/matic/${existingWalletData.erc721ContractAddress}/${existingData.tokenid}`,
    });

  }






 
  const walletPrivateKey = existingWalletData.walletPrivateKey;
  const factoryAddress = existingWalletData.factoryAddress;
  const erc721ContractAddress = existingWalletData.erc721ContractAddress;


  // smartwallet account
  const personalAccount = privateKeyToAccount({
    client,
    privateKey: walletPrivateKey
  }); // private key account




  // Configure the smart wallet

  const wallet = smartWallet({
    chain: chain,
    factoryAddress: factoryAddress, // your own deployed account factory address
    sponsorGas: true,
  });




  // Connect the smart wallet
  const account = await wallet.connect({
    client: client,
    personalAccount: personalAccount,
  });

  

  console.log("=====Account address: ", account.address);



  const contract = getContract({
    client,
    chain: chain,
    address: erc721ContractAddress,
  });







  const toAddress = account.address;

  //const image = 'https://vzrcy5vcsuuocnf3.public.blob.vercel-storage.com/G3GYQwQ-wyenYZzp3CNgNZo7MWZqKONinhm0sq.png';



  const transactionMintTo = mintTo({
    contract,
    to: toAddress,
    nft: {
      name: "NFT",
      description: prompt,


      image: image,


      animation_url: image,

      attributes: [
        /*
        {
          trait_type: "DancerCreatorName",
          value: "박승현",
        },
        */

      ],

    },
  });

  try {

    const sendData = await sendAndConfirmTransaction({
      transaction: transactionMintTo,
      account: account,
    });

    console.log("Minted successfully!");

    console.log(`Transaction hash: ${sendData.transactionHash}`);

    
    const nextTokenid = await nextTokenIdToMint({
      contract: contract,
    });

    console.log("Next Token ID to mint: ", nextTokenid);
    // BigInt to string
    console.log("Next Token ID to mint: ", nextTokenid.toString());    

    const tokenid = parseInt(nextTokenid.toString(), 10) - 1;

    console.log("Token ID: ", tokenid);



    const updateImageData = await updateOneByImage(
      {
        image: image,
        erc721ContractAddress: erc721ContractAddress,
        tokenid: tokenid,
        transactionHash: sendData.transaction,
        saleInfo: {
          price: price,
          salesno: salesno,
        },
      }
    );
    


    res.status(200).json({
      result: "success",
      message: "Minted successfully!",
      transactionHash: sendData.transactionHash,
      erc721ContractAddress: erc721ContractAddress,
      tokenid: tokenid,
      openurl: `https://opensea.io/assets/matic/${erc721ContractAddress}/${tokenid}`,
     
    });


  } catch (error) {

    console.error("Error: ", error);

    return res.status(500).json({
      result: "error",
      message: "Failed to mint NFT",
    });

  }


}
