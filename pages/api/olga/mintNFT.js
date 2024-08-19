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
} from '../../../lib/api/image';


import {
  findOne as findOneWallet,
  insertOne as insertOneWallet,
  updateERC721ContractAddress,
} from '../../../lib/api/wallet';



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
      tokenid: existingData.tokenid,
      opensea: `https://opensea.io/assets/matic/${existingData.erc721ContractAddress}/${existingData.tokenid}`,
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







  
  const contract = getContract({
    client,
    chain: chain,
    address: erc721ContractAddress,
  });



  /*
  const transactionClaimTo = claimTo({
    contract: contract,
    to: account.address,
    quantity: BigInt(1),
  });



  const sendData = await sendAndConfirmTransaction({
    transaction: transactionClaimTo,
    account: account,
  });



  console.log("Claimed successfully!");

  */



  
  const transactionMintTo = mintTo({
    contract,
    to: account.address,
    nft: {
      name: "NFT",
      description: "NFT",
      image: image,
      animation_url: image,

      attributes: [
        {
          trait_type: "CreatorName",
          value: "OLGA",
        },
      ],

    },
  });

  try {

    const sendData = await sendAndConfirmTransaction({
      transaction: transactionMintTo,
      account: account,
    });

    if (!sendData) {
      return res.status(500).json({
        result: "error",
        message: "Failed to mint",
      });
    }


    console.log("Minted successfully!");




  } catch (error) {

    console.error("Error: ", error);

    return res.status(500).json({
      result: "error",
      message: "Failed to mint",
    });

  }
  

  // get the token id
  const nextTokenId = await nextTokenIdToMint({
    contract: contract,
  });




  const tokenid = parseInt(nextTokenId.toString(), 10) - 1;

  console.log("Token ID: ", tokenid);


  /*
  // Lazy Mint NFT
  const nfts = [
    {
      name: "NFT",
      description: "NFT",
      image: image,
    },

  ];

  

  const transactionLazyMint = lazyMint({
    contract: contract,
    nfts: nfts,
  });

  const data = await sendAndConfirmTransaction({
    transaction: transactionLazyMint,
    account: account,
  });



  console.log("Lazy Minted successfully!");
  console.log("Transaction Hash: ", data.transactionHash);
  */


  


  const result = await insertOneImage({
    image: image,
    erc721ContractAddress: erc721ContractAddress,
    tokenid: tokenid,
  });







  return res.status(200).json({
    result: "success",
    message: "Minted successfully!",
    tokenid: tokenid,
    opensea: `https://opensea.io/assets/matic/${erc721ContractAddress}/${tokenid}`,
  });





  //let walletPrivateKey = ethers.Wallet.createRandom().privateKey;



  // use existing contract address or deploy a new contract


  /*

  const address = await deployERC721Contract({
    chain,
    client,
    account,
    type: "DropERC721",
    params: {
      name: "My Drop",
      symbol: "MYNFT",
    },
  });
  console.log("Contract address: ", address);
  const contract = getContract({ address, chain, client });

  */



  /*
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

  */




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



  



  /*

  res.status(200).json({
    result: "success",
    message: "Minted successfully!",
    transactionHash: sendData.transactionHash,
    tokenId: tokenId,
    opensea: `https://opensea.io/assets/matic/${nftContractAddress}/${tokenId}`,
  });
  */

}
