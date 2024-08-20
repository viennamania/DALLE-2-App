
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
 


import {
  findOne,
  findOneByImage,
	insertOne as insertOneImage,
} from '../../lib/api/image';


import {
  findOneByUserid,
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




const chain = polygon;

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY || "",
});



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


  const existingWalletData = await findOneByUserid(
    {
      userid: userid,
    }
  );

  if (!existingWalletData) {
    return res.status(400).json({
      result: "error",
      message: "Wallet data not found",
    });
  }



  const walletPrivateKey = existingWalletData.walletPrivateKey;

  const factoryAddress = existingWalletData.factoryAddress;




  if (existingWalletData.erc721ContractAddress) {

    const contract = getContract({
      client,
      chain: chain,
      address: existingWalletData.erc721ContractAddress,
    });



    return res.status(200).json({
      result: "success",
      erc721ContractAddress: existingWalletData.erc721ContractAddress,
    });

  }





  // smartwallet account
  const personalAccount = privateKeyToAccount({
    client,
    privateKey: walletPrivateKey
  }); // private key account

  const wallet = smartWallet({
    chain: chain,
    factoryAddress: factoryAddress,
    sponsorGas: true,
  });

  // Connect the smart wallet
  const account = await wallet.connect({
    client: client,
    personalAccount: personalAccount,
  });



  console.log("=====Account address: ", account.address);








  try {
    // deploy a new erc721 contract

    const erc721ContractAddress = await deployERC721Contract({
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

    //console.log("ERC721 Contract address: ", erc721ContractAddress);

    if (!erc721ContractAddress) {
      return res.status(400).json({
        result: "error",
        message: "Failed to deploy ERC721 contract",
      });
    }


    const updatedWalletData = await updateERC721ContractAddress({
      userid: userid,
      erc721ContractAddress: erc721ContractAddress,
    });




    const contract = getContract({
      client: client,
      chain: chain,
      address: erc721ContractAddress,
    });


    // generate image
    const image = "https://image.unove.space/olga.jpg";

    const transactionMintTo = mintTo({
        contract,
        to: account.address,
        nft: {
          name: "NFT",
          description: "NFT",
          image: image,
          animation_url: image,
        },
    });



    const sendData = await sendAndConfirmTransaction({
        transaction: transactionMintTo,
        account: smartAccount,
    });





    return res.status(200).json({
      result: "success",
      erc721ContractAddress: erc721ContractAddress,
    });



  } catch (error) {

    console.error("Error: ", error);

    return res.status(500).json({
      result: "error",
      message: "Failed to deploy ERC721 contract",
    });

  }




}
