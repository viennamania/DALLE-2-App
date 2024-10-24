import Head from "next/head";
import { use, useEffect, useState } from "react";

import styles from "../styles/Home.module.css";

import axios from "axios";

import Image from "next/image";

import { useSearchParams } from 'next/navigation'
 

/////import { Configuration, OpenAIApi } from "openai";


import { PutBlobResult } from '@vercel/blob';


import { usePathname, useRouter } from 'next/navigation'

///import { UserIcon } from "../components/icons/UserIcon";

import { toast } from 'react-toastify';


import { createThirdwebClient } from "thirdweb";


import {polygon } from "thirdweb/chains";

import {
  ConnectButton,
  useActiveWallet,
  useActiveAccount,
  useConnectModal,
  useAutoConnect,
  useDisconnect,
} from 'thirdweb/react';
import {createWallet, walletConnect} from 'thirdweb/wallets';




const client = createThirdwebClient({
  clientId: "980fc843a32b4172b465b766a7459af1",
});


const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("pro.tokenpocket"),
];




const chain = polygon;




export default function Home() {

  
  useAutoConnect({client, wallets});
  const {connect} = useConnectModal();
  const {disconnect} = useDisconnect();
  const wallet = useActiveWallet();

  ///console.log("wallet=", wallet);

  const activeAccount = useActiveAccount();

  ///console.log("activeAccount=", activeAccount);

  const connectWallet = async () => {
    await connect({
      chain,
      client,
      wallets,
      size: 'compact',
      showThirdwebBranding: false,
    });
  };

  const disconnectWallet = () => {
    if (wallet) {
      disconnect(wallet);
    }
  };

  


  // get parameter from url

  const searchParams = useSearchParams()
 

  const username = searchParams.get('userid')

  const userid = searchParams.get('token');


  //console.log("userid=", userid);

  const router = useRouter();


  // wallet address
  const [walletAddress, setWalletAddress] = useState("");
  const [erc721ContractAddress, setErc721ContractAddress] = useState("");


  useEffect(() => {
    if (userid != null && userid != 'null' && userid != "" ) {
      axios
        .get(`/api/walletByUserid?userid=${userid}`)
        .then((res) => {
          setWalletAddress(res.data.walletAddress);
          setErc721ContractAddress(res.data.erc721ContractAddress);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } , [ userid ]);

  console.log("walletAddress=", walletAddress);
  console.log("erc721ContractAddress=", erc721ContractAddress);

  //const [token, setToken] = useState("");


  const [prompt, setPrompt] = useState("");
  const [number, setNumber] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  // check if prompt is real picture
  // 真实图片
  const [checkIsRealPicture, setCheckIsRealPicture] = useState(false);



  function getImages() {


    //console.log("prompt=", prompt);

    //if (token != "" && prompt != "") {

    if (prompt != "") {



      setError(false);
      setLoading(true);
      axios
        
        ////.post(`/api/images?t=${token}&p=${prompt}&n=${number}`)

        .post(`/api/images?p=${prompt}&n=${number}&userid=${userid}&username=${username}&real=${checkIsRealPicture}`)


        .then((res) => {

          //console.log("res.data.result=", res.data.result);

          if (res.data.result.length === 0) {
            toast.error("没有找到图片");
            setError(true);
          } else {
            toast.success("成功生成图片");

            setResults(res.data.result);
            setLoading(false);
          }
        })
        .catch((err) => {

          toast.error("生成图片失败");

          setLoading(false);
          setError(true);

          
          console.log("err=", err);

          /*
          - error Error: Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system.
          */



        });


    } else {
      
      setError(true);

    }
  }

  //const [type, setType] = useState("webp");
  const [type, setType] = useState("png");


  const [loadingDownload, setLoadingDownload] = useState(false);

  function download(prompt, englishPrompt, url, type, userid, username) {

    if (confirm("您确定要下载到相册吗？")) {


      setLoadingDownload(true);

      axios
        .post(`/api/download`, {
          prompt,
          englishPrompt,
          url,
          type,
          userid,
          username,
        })
        .then((res) => {

          if (res.data.result === "") {
            toast.error("下载失败");
          } else {
            toast.success("成功下载图片");
          }


          ///console.log("res.data.result=", res.data.result);





          /*
          const link = document.createElement("a");

          link.href = res.data.result;

          link.download = `${prompt}.${type.toLowerCase()}`;

          link.click();
          */
          


          
          // save image to local album in mobile

          // res.data.result is base64 image

          ////console.log("res.data.result=", res.data.result);

          
      


          // get my images from api

          
          
          axios
            .get(`/api/getImages?userid=${userid}`)
            .then((res) => {
              setMyImages(res.data);

            })
            .catch((err) => {
              console.log(err);
            }
          );
          
          
          




          if (userid != null && userid != 'null' && userid != "" ) {


            //window.open("https://olgagpt.com/sub/deposit_request_krw.asp", "_self");

          }

          setLoadingDownload(false);
          

        })
        .catch((err) => {
          console.log(err);
          setLoadingDownload(false);
        });

    }

  }





    const [formData, setFormData] = useState({
      language: "en",
      message: "",
    });
    ///const [error, setError] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [translation, setTranslation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    /*
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

  
    const openai = new OpenAIApi(configuration);
    

    /*
    const openai = new OpenAIApi({
      apiKey: process.env.OPENAI_API_KEY,
    });
    




  
    const translate = async () => {
      const { language, message } = formData;
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Translate this into ${language}: ${message}`,
        temperature: 0.3,
        max_tokens: 100,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
  
      const translatedText = response.data.choices[0].text.trim();
      setIsLoading(false);
      setTranslation(translatedText);
    };




    // translate prompt to english



    useEffect(() => {

      setFormData({ ...formData, message: prompt });


      if (formData.message) {
        setIsLoading(true);
        translate();
      }
    } , [formData.message]);



    console.log("translation=", translation);

    */

  
  /* if userid is not null,
  get erc721ContractAddress from api */

  /*
  const [erc721ContractAddress, setErc721ContractAddress] = useState("");
  const [totalSupply, setTotalSupply] = useState(0);
  // loading erc721ContractAddress
  const [loadingErc721ContractAddress, setLoadingErc721ContractAddress] = useState(false);

  useEffect(() => {
      
    if (userid != null && userid != 'null' && userid != "" ) {

      setLoadingErc721ContractAddress(true);

      axios
        .get(`/api/erc721ContractAddress?userid=${userid}`)
        .then((res) => {

          ///console.log("res", res);

          setErc721ContractAddress(res.data.erc721ContractAddress);

          setTotalSupply(res.data.totalSupply);

        })
        .catch((err) => {
          console.log(err);
        });

      setLoadingErc721ContractAddress(false);

    }

  }, [ userid ]);
  */


  //console.log("erc721ContractAddress=", erc721ContractAddress);
  //console.log("totalSupply=", totalSupply);



  // my images from api
  const [myImages, setMyImages] = useState([]);
  // loading my images
  const [loadingMyImages, setLoadingMyImages] = useState(false);
  useEffect(() => {

    if (userid != null && userid != 'null' && userid != "" ) {
      setLoadingMyImages(true);
      axios
        .get(`/api/getImages?userid=${userid}`)
        .then((res) => {
          if (res.data.length > 0) {
            
            setMyImages(res.data);



          } else {
            
          
          }

          setLoadingMyImages(false);

        })
        .catch((err) => {
          console.log(err);

          setLoadingMyImages(false);
        }
      );
      
    }

  }, [ userid ]);


  ///console.log("myImages=", myImages);


  // deploy ERC721 contract
  const [loadingDeployErc721Contract, setLoadingDeployErc721Contract] = useState(false);
  const deployErc721Contract = () => {

    if (userid == null || userid == 'null' || userid == "" ) {
      return;
    }
    
    //if (confirm("Are you sure you want to deploy ERC721 contract?")) {
    // chinese confirm
    if (confirm("您确定要部署ERC721合约吗？")) {

      setLoadingDeployErc721Contract(true);
      axios
        .get(`/api/deployErc721Contract?userid=${userid}`)
        .then((res) => {

          toast.success("成功部署ERC721合约");

          setErc721ContractAddress(res.data.erc721ContractAddress);
          setLoadingDeployErc721Contract(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingDeployErc721Contract(false);
        });

    }

  };






  // mint nft array of images
  const [loadingMintNFTs, setLoadingMintNFTs] = useState([]);
  useEffect(() => {
      setLoadingMintNFTs(
          new Array(myImages.length).fill(false)
      );
  } , [myImages]);
  


  const mintNFT = async (image, prompt, index) => {

    if (userid == null || userid == 'null' || userid == "" ) {
      return;
    }


    // confirm mint NFT
    //if (confirm("Are you sure you want to mint NFT?")) {
    // chinese confirm
    if (confirm("您确定要铸造NFT吗？")) {

      setLoadingMintNFTs(
          loadingMintNFTs.map((value, i) => {
              return i === index ? true : value;
          }
      ));

      try {

        const response = await fetch("/api/mintNFTByUserid?userid=" 
          + userid 
          + "&image=" + image
          + "&prompt=" + prompt ,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {



          throw new Error("Failed to mint NFT");
        }

        toast.success("成功铸造NFT");


        const data = await response.json();


        setLoadingMintNFTs(
            loadingMintNFTs.map((value, i) => {
                return i === index ? false : value;
            }
        ));


        if (userid != null && userid != 'null' && userid != "" ) {
          setLoadingMyImages(true);
          axios
            .get(`/api/getImages?userid=${userid}`)
            .then((res) => {
              setMyImages(res.data);
            })
            .catch((err) => {
              console.log(err);
            }
          );
          setLoadingMyImages(false);
        }



      } catch (error) {

        console.error("Error: ", error);

        //toast.error("Failed to mint NFT");

        setLoadingMintNFTs(
            loadingMintNFTs.map((value, i) => {
                return i === index ? false : value;
            }
        ));

      }

    }

  }



  // delete my image
  const [loadingDeleteMyImage, setLoadingDeleteMyImage] = useState([]);
  useEffect(() => {
      setLoadingDeleteMyImage(
          new Array(myImages.length).fill(false)
      );
  } , [myImages]);

  const deleteMyImage = async (image, index) => {
      
      if (userid == null || userid == 'null' || userid == "" ) {
        return;
      }
  
      //if (confirm("Are you sure you want to delete this image?")) {
      // chinese confirm
      if (confirm("您确定要删除这张图片吗？")) {
  
        setLoadingDeleteMyImage(
            loadingDeleteMyImage.map((value, i) => {
                return i === index ? true : value;
            }
        ));
  
        try {
  
          const response = await fetch("/api/removeOneImage?userid=" + userid + "&image=" + image, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          });
  
          if (!response.ok) {
              throw new Error("Failed to delete image");
          }

          toast.success("成功删除图片");

          ///const data = await response.json();

          setLoadingDeleteMyImage(
              loadingDeleteMyImage.map((value, i) => {
                  return i === index ? false : value;
              }
          ));

          if (userid != null && userid != 'null' && userid != "" ) {

            setLoadingMyImages(true);

            axios
              .get(`/api/getImages?userid=${userid}`)
              .then((res) => {
                setMyImages(res.data);
              })
              .catch((err) => {
                console.log(err);
              }
            );

            setLoadingMyImages(false);

          }

        } catch (error) {

          console.error("Error: ", error);

          //toast.error("Failed to delete image");

          setLoadingDeleteMyImage(
              loadingDeleteMyImage.map((value, i) => {
                  return i === index ? false : value;
              }
          ));

        }

      }

  }



  //downloadToAlbum(myImage.image, myImage.prompt);
  const downloadToAlbum = (image, prompt) => {

    if (confirm("您确定要下载到相册吗？")) {
        
        // download image to local album in mobile

        
        const link = document.createElement("a");

        link.href = image;

        link.download = `${prompt}.${type.toLowerCase()}`;

        link.click();
        


  
      }

  };





  const [loginSession, setLoginSession] = useState("");
  console.log("loginSession=", loginSession);

  // POWER balance
  const [powerBalance, setPowerBalance] = useState(0);
  // 
  // https://www.olgagpt.com/sub/pointBalance.asp?balance=POWER&token=06eb43de00654b4fb9e2af4ba70e217f1bDbJsIsIxNIjPARc4

  // {"rescode":"Success","balance":"POWER","token":"06eb43de00654b4fb9e2af4ba70e217f1bDbJsIsIxNIjPARc4","amount":"1096"}

  useEffect(() => {

    const fetchData = async () => {

      if (userid != null && userid != 'null' && userid != "" ) {

        axios
          .post(`/api/pointBalance`, {balance: "POWER", token: userid})
          .then((res) => {

            //console.log("res.data", res.data);
            /*
            {
                "rescode": "Fail",
                "resmsg": "정상적으로 발급된 토큰이 아닙니다."
            }
              {
                "rescode": "Success",
                "balance": "POWER",
                "token": "06eb43de00654b4fb9e2af4ba70e217f1bDbJsIsIxNIjPARc4",
                "amount": "46"
            }
            */

            if (res.data.rescode === "Success") {
              setPowerBalance(res.data.amount);
              setLoginSession(res.data.token);
            } else {
              setPowerBalance(0);
            }

          })
          .catch((err) => {
            console.log(err);
          });

   
      } else {
        setPowerBalance(0);
      }

    };

    fetchData();

    // interval 1 second
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(interval);

  }, [userid]);

          





  return (


    <div className="">

      <Head>
        <title>Create Images With GhatGPT 4o</title>

        <meta property="og:type" content="website"></meta>
        <meta property="og:site_name" content="Olga"></meta>
        <meta property="og:image:width" content="1400"></meta>
        <meta property="og:image:height" content="1400"></meta>
        <meta property="og:title" content="Create images with ChatGPT 4o"></meta>
        <meta property="og:description" content="Create images with ChatGPT 4o"></meta>
        <meta property="og:image" content="https://image.olgaai.io/logo-chatgpt.png"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:image" content="https://image.olgaai.io/logo-chatgpt.png"></meta>


      </Head>

      {/*
      <div
        className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl
        bg-yellow-400
      ">
      */}

      
      <div
        className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4
          bg-gradient-to-b from-green-400 to-blue-500
        "
      >


          <div className='flex flex-row items-center'>
            <Image
              
              //src="/icon-chatgpt-dark.png"
              src="/icon-olga-dark.png"
              alt="Next Chat"
              width={35}
              height={35}
            />

            <span className="text-lg font-bold ml-2">ChatGPT</span>
          </div>


      </div>
      






      <main
        className="
        flex flex-col items-center justify-start gap-2 mb-24 p-4 min-h-screen
        bg-gradient-to-r from-green-400 to-blue-500
        "
      >

        {/*
        <Image
          src="/logo-chatgpt.png"
          alt="Logo"
          width={50}
          height={50}
        />
        

        <h1 className={styles.title}>
          Create images with <span className={styles.titleColor}>ChatGPT 4o</span>
        </h1>
        */}


        <div className='flex flex-row gap-5 items-center justify-center p-2'>
          <h1 className="text-sm font-semibold text-black">
            <span className='
              bg-white text-black font-semibold
              p-2
            '>Create images with
            </span>
            
            <span className="
              bg-black text-white font-semibold
              p-2
            ">ChatGPT 4o</span>
          </h1>
        </div>




        
        {/*
        <ConnectButton
          client={client}
          wallets={wallets}
          theme={"light"}
          connectButton={{ label: "Connect Wallet" }}
          connectModal={{ size: "compact" }}
        />
        */}

        {wallet && (
          <div className="flex flex-row items-center justify-center gap-2">
            <span className="text-sm text-yellow-400 font-bold">
              {activeAccount.address.slice(0, 4)}...
              {activeAccount.address.slice(-4)}
          </span>
          </div>
        )}
        
        {!wallet ? (
          <button
            onClick={connectWallet}
            className="
               bg-[#FFFFFF] px-6 text-[#04080F]
              rounded-xl border-2 border-sky-500 py-2
              "
            >
            <Image
              src="/olga/images/logo-tokenpocket.png"
              alt="Wallet"
              width={200}
              height={40}
            />
          </button>
        ) : (
          <button
            onClick={disconnectWallet}
            className="
              h-10 bg-gradient-to-r from-green-400 to-blue-500
              hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-600
              text-white px-6 py-2 rounded-xl border-2 border-sky-500
              text-sm text-center
              "
            >
            Disconnect Wallet
          </button>
        )}

        {/* login button */}
        {/*
        {loginSession === "" && (


        
          <button
            onClick={() => {
              //window.open("https://olgagpt.com/sub/login.asp", "_self");
              window.open("https://olgagpt.com/login.asp", "_self");
            }}
            className="
            bg-gradient-to-r from-green-400 to-blue-500
            hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-600
            text-white px-6 py-2 rounded-xl border-2 border-sky-500
            "
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <Image
                src="/icon-olga-dark.png"
                alt="Logo"
                width={24}
                height={24}
              />
              <span className="text-white">登录</span>
            </div>
         
          </button>



        )}
        */}

        {loginSession === "" && (
                     
          <button
            className='h-20 flex flex-col items-center justify-start p-2
            border-2 border-yellow-400 rounded-xl
            hover:bg-yellow-400 hover:text-black
            '
            
            onClick={() => {
              window.open("https://olgagpt.com/main.asp",
                "_parent");
            }}
          >
              <Image
                src="/menu05.png"
                alt="Logo"
                width={40}
                height={40}
                className='size-10'
              />
              {/* login chinse language */}
              <span className="text-xs xl:text-sm font-bold">
                OLGA 登录
              </span>
          </button>

        )}







        {/* logout button */}

        {/* if userid is not null, show userid */}
        
        {loginSession != ""
          && userid != null && userid != 'null' && userid != "" ? (

          <div className="mt-0 flex flex-col items-center justify-center gap-2">

          <div className="flex flex-row items-center justify-center gap-5 mt-2">

            <div className="flex flex-row items-center justify-center gap-2">
              <Image
                src="/olga/images/avatar.svg"
                alt="avatar"
                width={24}
                height={24}
              />
              <span className="text-yellow-400 text-xl font-bold">
                {' '}{username}
              </span>
            </div>

            {/* POWER balance */}
            {/* https://www.olgagpt.com/sub/pointBalance.asp?balance=POWER&token=06eb43de00654b4fb9e2af4ba70e217f1bDbJsIsIxNIjPARc4 */}

            <div className="flex flex-row items-center justify-center gap-2">
              <Image
                src="/olga/images/starfill.svg"
                alt="POWER"
                width={24}
                height={24}
              />
              <span className="text-yellow-400 text-xl font-bold">
                {' '}{powerBalance}
              </span>
            </div>

          </div>
          

            {/*}
            {totalSupply > 0 && erc721ContractAddress != "" ? (
              <a
                href={`https://opensea.io/assets/matic/${erc721ContractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/icon-opensea.png"
                  alt="Logo"
                  width={32}
                  height={32}
                />
              </a>
            ) : ( <></> )}
             */}

          </div>
          
        ) : ( <></> )}
        


          {/* margin top 10px */}
          {/* 镜像制作费用 50 POWER */}
          {/*
          <div
            className="mt-0"
          >
            <h3>* 镜像制作费用 50 POWER</h3>
          </div>
          */}

      



     
          <div
            className="mt-4 w-full lg:w-1/2 xl:w-1/2 flex flex-col xl:flex-row items-center justify-center gap-2
            rounded-xl border-2 border-white bg-gradient-to-r from-yellow-400 to-yellow-500
            p-4
            

            "
          >




          
            {/*
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={process.env.OPENAI_API_KEY}
            />
            */}

            {/* chatgpt logo small image */}
            {/* align vertical center */}
            {/* round full light gray border */}
            {/* padding 1px */}
            {/* when loading show rotating loading image */}

            <div className="w-full flex flex-row items-center justify-center gap-2">
              
              {loading ? (
                <Image
                  style = {{verticalAlign: "middle", border: "1px solid #ddd", borderRadius: "50%", padding: "4px"}}
                  src="/chatgpt-loading.gif"
                  alt="Logo"
                  width={28}
                  height={28}
                />
              ) : (

                <Image
                  style = {{verticalAlign: "middle", border: "1px solid #ddd", borderRadius: "50%", padding: "4px"}}
                  src="/logo-chatgpt.png"
                  alt="Logo"
                  width={28}
                  height={28}
                />

              )}

              {/* width 80% */}
              {loading ? (
                
                
                <textarea
                  className=" w-full rounded-xl border-2 border-sky-500 p-2"
                  disabled
                  style = {{width: "80%"}}
                  id="prompt"
                  
                  //type="text"

                  value={prompt}
                  //placeholder="Prompt"
                  placeholder="Loading..."
                />



              ) : (
                <textarea
                  className=" w-full rounded-xl border-2 border-sky-500 p-2"
                  id="prompt"
                  
                  //type="text"

                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  //placeholder="Prompt"
                  placeholder="您想要制作的图像消息 ChatGPT 4o"
                  
                />
              )}

            </div>


            <div className=" xl:w-60 flex flex-row xl:flex-col items-center justify-center gap-2">

              {/* hidden */}
              <input
                style = {{display: "none"}}
                id="number"
                type="number"
                value={number}
                onChange={(e) => setNumber(
                  Number(e.target.value)
                )}
                placeholder="Number of images"
                max="10"
              />

              {/* check box for real picture */}

              <div className="mb-2 text-sm flex flex-row items-center justify-center gap-2">
                <input
                  type="checkbox"
                  id="checkIsRealPicture"
                  value={
                    checkIsRealPicture.toString()
                  }
                  onChange={(e) => setCheckIsRealPicture(e.target.checked)}
                />
                真实图片
              </div>


              {/*}
              <button onClick={getImages}>Get {number} Images</button>
              */}
              {loading ? (
                <button hidden>生成图片</button>
              ) : (
                <div className="flex flex-row items-center justify-center gap-2">
                  <button
                    disabled={loading || prompt === ""}
                    onClick={getImages}
                    className="
                    bg-gradient-to-r from-green-400 to-blue-500
                    hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-600
                    rounded-xl border-2 border-sky-500 p-2
                    "
                  >
                    <div className="flex flex-row items-center justify-center gap-2">
                      <Image
                        src="/icon-ai-image.png"
                        alt="Logo"
                        width={24}
                        height={24}
                      />
                      <span className="text-white">生成图片</span>
                    </div>
                  
                  </button>
                  {/* reset button */}
                  <button
                    onClick={() => {
                      setResults([]);
                      setPrompt("");
                      setNumber(1);
                      setCheckIsRealPicture(false);
                    }}
                    className="
                    bg-gradient-to-r from-green-400 to-blue-500
                    hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-600
                    rounded-xl border-2 border-sky-500 p-2
                    "
                  >
                    重置
                  </button>

                </div>
              )}



            </div>



          </div>
        
        <div>

        </div>




        <div className="xl:w-1/2 flex flex-col items-center justify-center gap-2 ">

          
          <small
            //style = {{display: "none"}}
            className="hidden"
          >
            Download as:{" "}
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="webp">Webp</option>
              <option value="png">Png</option>
              <option value="jpg">Jpg</option>
              <option value="gif">Gif</option>
              <option value="avif">Avif</option>
            </select>
            {" "}
            Click the image below and save.
          </small>
          <br />
        
          {error ? ( <div className={styles.error}>Something went wrong. Try again.</div> ) : ( <></> )}




          


          {loading ? (
    
              <Image
                src="/chatbot-loading.gif"
                alt="Logo"
                width={200}
                height={100}
              />
              
          ) : (

            <>

                {results.map((result) => {
                  return (


                    <div className="flex flex-col items-center justify-center gap-2">

                      <div 
                        key={result.url}
                        className="w-full border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <img
                          className={styles.imgPreview}
                          src={result.url}
                          //onClick={() => download(result.url)}
                        />
                      </div>

                      {/* Olga login 하면 이미지를 저장할수 있습니다. 중국어로 변경 */}
                      {loginSession === "" && (
                        <div className="flex flex-row items-center justify-center gap-2">
                          {/* dot */}
                          <span className="text-red-600 text-2xl">•</span>
                          {' '}
                          <span
                            className="text-lg text-yellow-400"
                          >Olga 登录后，您可以保存图片。</span>
                        </div>
                      )}


                    </div>
                  );
                })}


            </>

          )}

        </div>

   


          {/* download button */}
          {/* download image and anchor goto https://www.olgagpt.com/sub/deposit_request_krw.asp new window */}
          {/* margin top 20px */}
          {loginSession != ""
          && !loading && results.length > 0 && userid != null && userid != 'null' && userid != ""  && (

            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              
              {/* * 镜像制作费用 50 POWER*/}
              <div className="flex flex-row items-center justify-center gap-2">
                {/* dot */}
                <span className="text-red-600 text-2xl">•</span>
                {' '}
                <span
                  className="text-sm text-white"
                >镜像制作费用</span>
                {' '}<span className="text-yellow-400 font-bold text-2xl">50</span>
                {' '}<span
                  className="text-sm text-white"
                >
                  POWER</span>
              </div>


              <button
                disabled={loadingDownload}
                style = {{marginTop: "10px"}}
                onClick={() => {

                  download(
                    results[0].prompt,
                    results[0].englishPrompt,
                    results[0].url,
                    type,
                    userid,
                    username
                  );

                } }
                className="
                bg-gradient-to-r from-green-400 to-blue-500
                hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-600
                rounded-xl border-2 border-sky-500 p-2
                "
              >

                {
                loadingDownload ?
                  <div className="flex flex-row items-center justify-center gap-2">
                    <Image
                      src="/logo-opensea.png"
                      alt="Logo"
                      width={24}
                      height={24}
                      className="animate-spin"
                    />
                    <span>下载中...</span>
                  </div>
                  :
                  <div className="flex flex-row items-center justify-center gap-2">
                    <Image
                      src="/logo-opensea.png"
                      alt="Logo"
                      width={24}
                      height={24}
                    />
                    <span className="text-white">
                      将图片铸造成NFT
                    </span>
                  </div>

                }
              </button>

            </div>
          )}

      


          {/* erc721ContractAddress */}
          {loginSession != ""
          && walletAddress && walletAddress != "" && (
            <>

              {erc721ContractAddress != "" && erc721ContractAddress != null && erc721ContractAddress != undefined ? (
                <div className="mt-0 flex flex-col items-center justify-center gap-2">
                  
                  {/* button for new window goto opensea */}
                  {/*
                  <button
                    onClick={() => {
                      window.open(`https://opensea.io/assets/matic/${erc721ContractAddress}`, "_self");

                    }}
                  >
                    <Image
                      src="/icon-opensea.png"
                      alt="Logo"
                      width={50}
                      height={50}
                    />
                  </button>
                  <span className="text-center text-sm text-gray-500">
                    {erc721ContractAddress}
                  </span>
                  */}

                </div>
              ) : (
                <div className="mt-2 text-center text-sm text-gray-500 p-2">
          
                  {/* button for deploy ERC721 contract */}
                  
                  <button
                    disabled={loadingDeployErc721Contract}
                    onClick={() => {

                      deployErc721Contract();

                    }}
                    className={`
                      ${loadingDeployErc721Contract ? "bg-gray-200" : "bg-blue-500"
                      } text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline
                        rounded-xl border-2 border-sky-500 p-2 
                      `}
                  >
                    {loadingDeployErc721Contract ?
                      "部署中..." :
                      "部署ERC721合约"
                    }
                    
                  </button>
                  

                </div>
              )}

            </>

          )}


            { loadingMyImages ? (
              <div className="
                w-full
                flex flex-row items-center justify-center gap-2">
                <Image
                  src="/logo-chatgpt.png"
                  alt="Logo"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
                <span className="text-yellow-400 text-xl font-bold">加载中...</span>
              </div>
            ) : (

              <>

              {/* if userid is 'songpa', show my images */}
              {loginSession != ""
              && userid != null && userid != 'null' && userid != "" && (

                <div className="w-full flex flex-col items-center justify-center gap-2 mt-4">


                  <div className="w-full flex flex-row items-center justify-start gap-2">
                    {/* dot */}
                    <span className="text-red-600 text-2xl">•</span>
                    {' '}
                    <div className="text-center">
                      <span className="text-white text-xs">我的图片</span>{' '}
                      <span className="text-2xl text-yellow-400 font-bold">{myImages.length}</span>{' '}
                      <span className="text-white text-xs">张</span>
                    </div>
                  </div>


              

                  <div className="
                  
                    xl:w-1/2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                  

                    {myImages.map((myImage, index) => {


                      return (


                        <div
                          key={myImage._id}
                          className="border border-gray-200 rounded-xl overflow-hidden flex flex-col items-center justify-center gap-2
                          bg-white
                          pb-4
                          "
                        >

                          {/* opensea logo is located top and left side of image overlapping */}

                          <div  className="relative w-full h-full">

                            {myImage.erc721ContractAddress !== "" && myImage.erc721ContractAddress !== null && myImage.erc721ContractAddress !== undefined && (
                              <Image
                                className="absolute top-1 left-1"
                                src="/icon-opensea.png"
                                alt="Logo"
                                width={20}
                                height={20}
                              />
                            )}

                            <Image
                              // when click image, preview image
                              onClick={() => {
                                window.open(myImage.image, "_blank");
                              } }
                              
                              src={myImage.image}
                              alt="My Image"
                              width={400}
                              height={400}
                              //onClick={() => download(myImage.image)}
                              // object-fit: cover;

                              //style = {{objectFit: "cover"}}

                              //className={styles.imgPreview}
                              /*
                              .imgPreview {
                                width: 100%;
                                border-radius: 10px;
                              }

                              .imgPreview:hover,
                              .imgPreview:focus,
                              .imgPreview:active {
                                transform: scale(1.1);
                                cursor: pointer;
                                transition-duration: 1s;
                              }
                              */

                              className="
                              hover:scale-110
                              cursor-pointer
                              transition-transform
                              duration-1000
                              "
                            

                              style = {
                                {
                                  objectFit: "cover",
                                  width: "100%",
                                  height: "100%",
                                }
                              }

                            />

                          </div>



                          {/* myImage.created_at */}
                          <div className="text-center text-xs xl:text-sm text-gray-500 p-1"> 
                            {new Date(myImage.createdAt).toLocaleString()}
                          </div>
                          {/* prompt */}
                          <div className="text-center text-xs xl:text-sm text-gray-500 p-2"> 
                            {myImage.prompt}
                          </div>

                          {/* mint NFT button */}

                          {erc721ContractAddress !== "" && erc721ContractAddress !== null && erc721ContractAddress !== undefined && (

                            <>

                              {myImage.erc721ContractAddress === "" || myImage.erc721ContractAddress === null || myImage.erc721ContractAddress === undefined ? (
                                
                                <div className="flex flex-row items-center justify-center gap-2">

                                  <div className="flex flex-row items-center justify-center gap-2">

                                    {/*
                                    <span className=" text-xs font-bold text-[#d3a947]">
                                      价格 : 100 POWER
                                    </span>
                                    */}

                                    <button
                                      disabled={loadingMintNFTs[index]}
                                      onClick={() => mintNFT(myImage.image, myImage.prompt, index)}
                                      className={`
                                        ${loadingMintNFTs[index] ? 
                                        //"bg-gray-200" : "bg-blue-500"
                                        "bg-gray-200" : "bg-[#d3a947]"
                                        } text-white text-sm px-4 rounded focus:outline-none focus:shadow-outline mb-0
                                          p-2 
                                        `}
                                    >
                                      <div className="flex flex-row items-center justify-center gap-2">
                                        <Image
                                          src="/logo-opensea.png"
                                          alt="Logo"
                                          width={20}
                                          height={20}
                                          className={`${loadingMintNFTs[index] ? "animate-spin" : ""}`}
                                        />
                                        <span className={`${loadingMintNFTs[index] ? "text-gray-500" : "text-white"}`}>
                                          {
                
                                            loadingMintNFTs[index] ? "铸造中..." :
                                              "铸造"
                                          }
                                        </span>
                                      </div>

                          

                                    </button>

                                  </div>

                                  {/* delete button */}
                                  <button
                                    disabled={loadingDeleteMyImage[index]}
                                    onClick={() => deleteMyImage(myImage.image, index)}
                                    className={`
                                      ${loadingDeleteMyImage[index] ? "bg-gray-200" : "bg-red-500"
                                      } text-white text-sm py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                                  >
                                    {
                                      ////loadingDeleteMyImage[myImages.indexOf(myImage)] ? "Deleting..." : "Delete"
                                      // chinese
                                      loadingDeleteMyImage[myImages.indexOf(myImage)] ? "删除中..." : "删除"
                                    }
                                  </button>


                                </div>
                              


                              ) : (
                                <div className="text-center text-xs xl:text-sm text-gray-500 p-2">

                                {/* OpenSea Logo */}
                                {/*
                                <Image
                                  src="/icon-opensea.png"
                                  alt="Logo"
                                  width={20}
                                  height={20}
                                />
                              
                                <button
                                  // goto opensea
                                  onClick={() => {
                                    window.open(`https://opensea.io/assets/matic/${myImage.erc721ContractAddress}/${myImage.tokenid}`, "_blank");
                                  }}
                                >
                                  <Image
                                    src="/icon-opensea.png"
                                    alt="Logo"
                                    width={20}
                                    height={20}
                                  />
                                
                                </button>
                                */}
                                </div>
                              )}

                            </>


                          )}

                          {/* download from cloud image myImage.image to local album in mobile */}
                          {/*
                          <button
                            className="text-sm text-white bg-blue-500 p-2 rounded-lg"
                            onClick={
                              () => {
                                
                                downloadToAlbum(myImage.image, myImage.prompt);

                              }
                            }
                          >
                            下载到相册
                          </button>

                          */}



                        </div>
                      );
                    })}

                  </div>
       

                </div>

              )}

            </>

        )}




      </main>

      {/* footer */}
      {/* fixed bottom */}
      {/* menu01.png => Coming Soon */}
      {/* menu02.png => current page */}
      {/* menu03.png => 'https://olgaai.io/' */}
      {/* menu04.png => 'https://olgagpt.com/sub/order_list.asp' */}
      {/* menu05.png => 'https://olgagpt.com/main.asp' */}
 

      <div className=" fixed z-50 text-black
        left-0 right-0 
        bottom-0
        bg-white
        flex flex-col items-center justify-center gap-2
        
      ">
        <div className="grid grid-cols-5 border border-gray-200 gap-2
          md:w-1/2 xl:w-2/5

          pl-2 pr-2
        ">

          <button
            className=" h-24 flex flex-col items-center justify-start
            hover:bg-gray-200 hover:text-black
            p-2"

            onClick={() => {
              router.push(
                `/feeds?userid=${username}&token=${userid}`
              );
            }}
          >
            <Image
              src="/menu01.png"
              alt="Logo"
              width={40}
              height={40}
            />
            <span className="text-xs xl:text-sm font-bold">
              SNS
            </span>
          </button>


          <button
            // selected
            //className=" h-24 flex flex-col items-center justify-start  bg-cadetblue "

            className="
              h-24 flex flex-col items-center justify-start text-white
              p-2
              bg-blue-500 hover:bg-blue-700
            "
          >
            <Image
              src="/menu02.png"
              alt="Logo"
              width={40}
              height={40}
            />
            <span className="text-xs xl:text-sm font-bold">
              Image<br/>Generator
            </span>
          </button>

          <button
            className=" h-24 flex flex-col items-center justify-start
            hover:bg-gray-200 hover:text-black
            p-2"
            onClick={() => {
              // Coming soon
              window.open("https://olgaai.io/" + userid + "/" + username, "_self");
            }}
          >
            <Image
              src="/menu03.png"
              alt="Logo"
              width={40}
              height={40}
            />
            <span className="text-xs xl:text-sm font-bold">
              Chat GPT
            </span>
          </button>

          <button
            className=" h-24 flex flex-col items-center justify-start
            hover:bg-gray-200 hover:text-black
            p-2"
            onClick={() => {
              // '/collection?userid=${userid}&token=${token}'
              /*
              router.push(
                {
                  pathname: "/collection",
                  search: `?userid=${username}&token=${userid}`,
                }
              );
              */

              window.open(
                "/collection?userid=" + username + "&token=" + userid,
                "_self"
              );

            }}
          >
            <Image
              src="/menu04.png"
              alt="Logo"
              width={40}
              height={40}
            />
            <span className="text-xs xl:text-sm font-bold">
              My NFT
            </span>
          </button>
          <button
            className=" h-24 flex flex-col items-center justify-start
            hover:bg-gray-200 hover:text-black
            p-2"
            onClick={() => {
              window.open("https://olgagpt.com/main.asp", "_parent");
            }}
          >
            <Image
              src="/menu05.png"
              alt="Logo"
              width={40}
              height={40}
            />
            <span className="text-xs xl:text-sm font-bold">
              OLGA
            </span>
          </button>

        </div>

      </div>


      {/*
      <footer className={styles.footer}>

        <a
          href="https://www.olgagpt.com/"
          target="_blank"
          rel="noopener noreferrer"
        >


        <Image
          style={ {marginTop: "100px", border: "1px solid #ddd", borderRadius: "4px"} }
          src="/olga.jpg"
          priority = {true}
          alt="Logo"
          width={400}
          height={200}
        />

        </a>

      </footer>
      */}

    </div>

  );
}
