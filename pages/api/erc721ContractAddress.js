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
  lazyMint,
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
 

import { ethers } from "ethers";


import {
  findOneByImage,
	insertOne as insertOneImage,
} from '../../lib/api/image';


import {
  findOne as findOneWallet,
  insertOne as insertOneWallet,
  updateERC721ContractAddress,
} from '../../lib/api/wallet';



import { deployERC721Contract } from 'thirdweb/deploys';



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
//const nftContractAddress = "0xf7EC05E78477939CfaD0BfC87C9438a6Be05ACa8";





export default async function handler(req, res) {


  // get userid from the request
  const userid = req.query.userid;

  console.log("userid: ", userid);

  if (!userid) {
    return res.status(400).json({
      result: "error",
      message: "userid is required",
    });
  }




  let walletPrivateKey = null;

  let erc721ContractAddress = null;


  // use existing my wallet address or create a new wallet address


  const existingWalletData = await findOneWallet(
    {
      userid: userid,
    }
  );


  // if not exist, create a new wallet address
  if (!existingWalletData) {


    walletPrivateKey = ethers.Wallet.createRandom().privateKey;

    // smartwallet account
    const personalAccount = privateKeyToAccount({
      client,
      privateKey: process.env.WALLET_PRIVATE_KEY || "",
    }); // private key account

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

    const walletAddress = account.address;


    const walletData = await insertOneWallet({
      userid: userid,
      walletPrivateKey: walletPrivateKey,
      walletAddress: walletAddress,
    });

    console.log("walletData: ", walletData);


  } else {

    // get wallet address from the existing wallet data

    const walletAddress = existingWalletData.walletAddress;
    walletPrivateKey = existingWalletData.walletPrivateKey;



    erc721ContractAddress = existingWalletData.erc721ContractAddress;

  }



  // smartwallet account
  const personalAccount = privateKeyToAccount({
    client,
    privateKey: walletPrivateKey
  }); // private key account

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






  if (!erc721ContractAddress) {


    try {
      // deploy a new erc721 contract

      erc721ContractAddress = await deployERC721Contract({
        chain,
        client,
        account,

        /*  type ERC721ContractType =
          | "DropERC721"
          | "TokenERC721"
          | "OpenEditionERC721";
        */

        //type: "DropERC721",

        type: "TokenERC721",
        
        
        params: {
          name: "My NFT",
          description: "My NFT",
          symbol: "MYNFT",
        },

      });

      console.log("ERC721 Contract address: ", erc721ContractAddress);


    } catch (error) {

      console.error("Error: ", error);

      return res.status(500).json({
        result: "error",
        message: "Failed to deploy ERC721 contract",
      });

    }


    const updatedWalletData = await updateERC721ContractAddress({
      userid: userid,
      erc721ContractAddress: erc721ContractAddress,
    });

    console.log("updatedWalletData: ", updatedWalletData);


  }




  console.log("ERC721 Contract address: ", erc721ContractAddress);


  // get the token id
  const contract = getContract({
    client,
    chain: chain,
    address: erc721ContractAddress,
  });

  const nextTokenId = await nextTokenIdToMint({
    contract: contract,
  });

  ///console.log("nextTokenId: ", nextTokenId);

  const totalSupply = parseInt(nextTokenId.toString(), 10);


  


  return res.status(200).json({
    result: "success",
    erc721ContractAddress: erc721ContractAddress,
    totalSupply: totalSupply,
  });


}
