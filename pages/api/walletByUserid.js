
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



import { ethers } from "ethers";


import {
  findOne,
  findOneByImage,
	insertOne as insertOneImage,
} from '../../lib/api/image';


import {
  findOneByUserid,
  insertOne as insertOneWallet,
} from '../../lib/api/wallet';




const chain = polygon;

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY || "",
});


 const factoryAddress = "0x9Bb60d360932171292Ad2b80839080fb6F5aBD97"; // your own deployed account factory address 


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



  let walletAddress = null;
  let erc721ContractAddress = null;

 
  const existingWalletData = await findOneByUserid(
    {
      userid: userid,
    }
  );


  // if not exist, create a new wallet address
  if (!existingWalletData) {

    const walletPrivateKey = ethers.Wallet.createRandom().privateKey;

    // smartwallet account
    const personalAccount = privateKeyToAccount({
      client,
      privateKey: walletPrivateKey
    }); // private key account

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

    walletAddress = account.address;


    const walletData = await insertOneWallet({
      userid: userid,
      walletPrivateKey: walletPrivateKey,
      factoryAddress: factoryAddress,
      walletAddress: walletAddress,
    });

    console.log("walletData: ", walletData);

  } else {
    walletAddress = existingWalletData.walletAddress;
    erc721ContractAddress = existingWalletData.erc721ContractAddress;
    
  }


  return res.status(200).json({
    result: "success",
    walletAddress: walletAddress,
    erc721ContractAddress: erc721ContractAddress,
  });


}
