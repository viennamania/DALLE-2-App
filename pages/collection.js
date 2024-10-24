import Head from "next/head";
import { use, useEffect, useState } from "react";

import styles from "../styles/Home.module.css";

import axios from "axios";

import Image from "next/image";

import { useSearchParams } from 'next/navigation'
 

/////import { Configuration, OpenAIApi } from "openai";


import { PutBlobResult } from '@vercel/blob';


import { usePathname, useRouter } from 'next/navigation'

import { useAnimation, motion, m } from "framer-motion";

// toasts
import { toast } from 'react-toastify';




export default function Home() {

  // get parameter from url

  const searchParams = useSearchParams()
 

  const username = searchParams.get('userid')

  const userid = searchParams.get('token');


  console.log("userid=", userid);

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

        .post(`/api/images?p=${prompt}&n=${number}&userid=${userid}&real=${checkIsRealPicture}`)


        .then((res) => {

          //console.log("res=", res);

          setResults(res.data.result);
          setLoading(false);
        })
        .catch((err) => {

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

  function download(url) {

    setLoadingDownload(true);

    axios
      .post(`/api/download`, {prompt: prompt, url: url, type: type, userid: userid })
      .then((res) => {


        ///console.log("res.data.result=", res.data.result);





        
        const link = document.createElement("a");

        link.href = res.data.result;

        link.download = `${prompt}.${type.toLowerCase()}`;

        link.click();

        


        
        // save image to local album in mobile

        // res.data.result is base64 image

        ////console.log("res.data.result=", res.data.result);

        
    


        // get my images from api

        /*
        
        axios
          .get(`/api/getImages?userid=${userid}`)
          .then((res) => {
            setMyImages(res.data);

          })
          .catch((err) => {
            console.log(err);
          }
        );
        
        */
        




        if (userid != null && userid != 'null' && userid != "" ) {


          window.open("https://olgagpt.com/sub/deposit_request_krw.asp", "_self");

        }

        setLoadingDownload(false);
        

      })
      .catch((err) => {
        console.log(err);
        setLoadingDownload(false);
      });



      

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
        
        //.get(`/api/getImages?userid=${userid}`)

        .get(`/api/getNFTs?userid=${userid}`)
        .then((res) => {
          
          setMyImages(res.data);

        })
        .catch((err) => {
          console.log(err);
        }
      );
      setLoadingMyImages(false);
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

        setLoadingMintNFTs( false );

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

          const data = await response.json();

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

          setLoadingDeleteMyImage( false );

        }

      }

  }


  const [loginSession, setLoginSession] = useState("");

  // POWER balance
  const [powerBalance, setPowerBalance] = useState(0);
  // 
  // https://www.olgagpt.com/sub/pointBalance.asp?balance=POWER&token=06eb43de00654b4fb9e2af4ba70e217f1bDbJsIsIxNIjPARc4
  // {"rescode":"Success","balance":"POWER","token":"06eb43de00654b4fb9e2af4ba70e217f1bDbJsIsIxNIjPARc4","amount":"1096"}

  useEffect(() => {
    if (userid != null && userid != 'null' && userid != "" ) {
      axios
        .post(`/api/pointBalance`, {balance: "POWER", token: userid})
        .then((res) => {

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
  } } , [ userid ]);
          



  return (


    <div className="container mx-auto">

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
        flex flex-col items-center justify-start gap-2 mb-32 p-4 min-h-screen
        bg-gradient-to-r from-green-400 to-blue-500
      ">

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
                width={400}
                height={200}
              />
              
          ) : (

            <>

                {results.map((result) => {
                  return (
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
                  );
                })}

            </>

          )}

        </div>

   


          {/* download button */}
          {/* download image and anchor goto https://www.olgagpt.com/sub/deposit_request_krw.asp new window */}
          {/* margin top 20px */}
          {!loading && results.length > 0 && userid != null && userid != 'null' && userid != ""  && (
            <button
              disabled={loadingDownload}
              style = {{marginTop: "10px"}}
              onClick={() => {

                download(results[0].url);




                //window.open("https://www.olgagpt.com/sub/deposit_request_krw.asp", "_blank");




                } }
            >
              {
              loadingDownload ?
                <span>下载中...</span>
                :
                <span>将图片铸造成NFT</span>

              }
            </button>
          )}

      


          {/* erc721ContractAddress */}
          {loginSession != ""
          && walletAddress && walletAddress != "" && (
            <>

              {erc721ContractAddress != "" && erc721ContractAddress != null && erc721ContractAddress != undefined ? (
                <div className="mt-0 flex flex-col items-center justify-center gap-2">
                  {/* button for new window goto opensea */}
                  <button
                    onClick={() => {
                      window.open(`https://opensea.io/assets/matic/${erc721ContractAddress}`, "_self");


                      // router to /opensea?userid=${userid}&token=${token}&erc721ContractAddress=${erc721ContractAddress}

                      /*
                      router.push(
                        {
                          pathname: "/opensea",
                          search: `?userid=${username}&token=${userid}&erc721ContractAddress=${erc721ContractAddress}`,
                        }
                      );
                      */



                    }}
                  >
                    <Image
                      src="/icon-opensea.png"
                      alt="Logo"
                      width={50}
                      height={50}
                    />
                  </button>
                  <span className="text-center text-sm text-yellow-400 font-bold">
                    {
                      erc721ContractAddress.substring(0, 5) + "..." + erc721ContractAddress.substring(erc721ContractAddress.length - 5)
                    }
                  </span>
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
                      } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
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

        {/* Total: {totalSupply} */}
        {loginSession != "" && (
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
        )}

        {/* if userid is 'songpa', show my images */}
        {loginSession != ""
        && userid != null && userid != 'null' && userid != "" && (

          <div className="
          xl:w-1/2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          

            {myImages.map((item, index) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-xl overflow-hidden flex flex-col items-center justify-center"
                >
                  <Image
                    onClick={() => {
                      window.open(item.image, "_blank");
                    } }
                    src={item.image}
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


                  <div className="w-full flex flex-col items-start justify-start gap-2 p-4
                  bg-white
                  ">
                    


                    <div className="w-full flex flex-row items-between justify-start gap-2">

                      <div className="w-full flex flex-col items-start justify-between gap-2
                        text-xs xl:text-xs
                        text-black
                      ">
                        <div className="flex flex-row items-center gap-2">
                          <Image
                            src="/olga/images/timeline.svg"
                            alt="date"
                            width={20}
                            height={20}
                          />
                          {
                            (new Date(item?.updatedAt)).toLocaleString()
                          }
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <Image
                            src="/olga/images/avatar.svg"
                            alt="user"
                            width={20}
                            height={20}
                          />
                          <span className="text-xs xl:text-sm font-bold">
                          {
                          item?.username && item?.username.length > 5 ? item?.username.substring(0, 5) + "..."
                          : item.userid && item.userid.length > 5 ? item.userid.substring(0, 5) + "..."
                          : item.userid
                          }
                          </span>
                        </div>
                      </div>



                      <div className="flex flex-row items-center justify-center gap-2">
                                
                        {
                          //item?.userid === userid ? (
                          false ? (

                          <motion.img
                            className="relative w-10 h-10 overflow-hidden shrink-0"
                            alt=""
                            src="/olga/images/heart3line.svg"
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.8 }}
                          />
                        ) : (


                          <button
                            type="button"
                          >
                            {item?.likes > 0 ? (
                              <motion.img
                                className="relative w-10 h-10 overflow-hidden shrink-0"
                                alt=""
                                src="/olga/images/heart3fill.svg"
                                whileHover={{ scale: 1.3 }}
                                whileTap={{ scale: 0.8 }}
                              />
                            ) : (
                              <motion.img
                                className="relative w-10 h-10 overflow-hidden shrink-0"
                                alt=""
                                src="/olga/images/heart3line.svg"
                                whileHover={{ scale: 1.3 }}
                                whileTap={{ scale: 0.8 }}
                              />
                            ) }
                        

                          </button>

                        )}

                        <div className="relative">
                          {item?.likes > 0 ? (
                            <span className="text-lg">
                              {item?.likes}
                            </span>
                          ) : (
                            <span className="text-sm">
                              0
                            </span>
                          )}
                        </div>

                      </div>




                    </div>
                    
                    <div className="w-full flex flex-row items-center justify-between gap-2
                    ">
                      {
                        item.prompt?.length > 100 ?
                        item.prompt?.substring(0, 100) + "..."
                        : item.prompt
                      }
                    </div>

                  </div>




                </div>

            ))}

          </div>

        )}



        {/* https://olgagpt.com/sub/point_bonus_w.asp */}
        {/* iframe */}
        {/*
        <iframe
          src="https://olgagpt.com/sub/point_bonus_w.asp"
          className="xl:w-1/2 h-96"

          //style = {{position: "fixed", bottom: "0", left: "0", right: "0", zIndex: "-1"}}
        >
        </iframe>
        */}

     




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
              h-24 flex flex-col items-center justify-start
              p-2
              hover:bg-gray-200 hover:text-black
            "

            
             
            
            onClick={() => {
              // '/?userid=${userid}&token=${token}'
              
              router.push(
                {
                  pathname: "/",
                  search: `?userid=${username}&token=${userid}`,
                }
              );
              

            }}
            
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
            text-white
            p-2
            bg-blue-500 hover:bg-blue-700
            "
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
