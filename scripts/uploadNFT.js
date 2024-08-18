
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

//import { config } from "dotenv";

//config();

// erc721 contract address
const nftContractAddress = "0x6329fa5Ae4Fc8122A29D3DE4e346366fbE3E7358";


console.log("wallet private key", process.env.WALLET_PRIVATE_KEY);

const sdk = ThirdwebSDK.fromPrivateKey(process.env.WALLET_PRIVATE_KEY, "polygon");


// addNFTs function
const addNFTs = async () => {

  const drop = await sdk.getContract(
    nftContractAddress,
    "nft-drop"
  );

  const urlArray = [];

  for (let i = 0; i < 10000; i++) {
    urlArray.push(`https://unove.space/api/nft/${i}`);
  } // 토큰번호 10000번, 10001번, 10002번 URI

  try {
    await drop.createBatch(
      urlArray
    );
    console.log("uploaded all nfts");
  } catch (error) {
    console.log(error);
  }

};

//addNFTs();
