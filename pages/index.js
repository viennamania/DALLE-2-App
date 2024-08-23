import Head from "next/head";
import { use, useEffect, useState } from "react";

import styles from "../styles/Home.module.css";

import axios from "axios";

import Image from "next/image";

import { useSearchParams } from 'next/navigation'
 

/////import { Configuration, OpenAIApi } from "openai";


import { PutBlobResult } from '@vercel/blob';


import { usePathname, useRouter } from 'next/navigation'


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







  return (


    <div className="container mx-auto p-4">

      <Head>
        <title>Create Images With GhatGPT 4o</title>

        <meta property="og:type" content="website"></meta>
        <meta property="og:site_name" content="Olga"></meta>
        <meta property="og:image:width" content="1400"></meta>
        <meta property="og:image:height" content="1400"></meta>
        <meta property="og:title" content="Create images with ChatGPT 4o"></meta>
        <meta property="og:description" content="Create images with ChatGPT 4o"></meta>
        <meta property="og:image" content="https://image.unove.space/logo-chatgpt.png"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:image" content="https://image.unove.space/logo-chatgpt.png"></meta>


      </Head>


      <main className="flex flex-col items-center justify-center gap-2">

        
        <Image
          src="/logo-chatgpt.png"
          alt="Logo"
          width={50}
          height={50}
        />
        

        <h1 className={styles.title}>
          Create images with <span className={styles.titleColor}>ChatGPT 4o</span>
        </h1>

        {/* if userid is not null, show userid */}
        
        {userid != null && userid != 'null' && userid != "" ? (

          <div className="mt-0 flex flex-col items-center justify-center gap-2">

            <h3>您的用户ID: {username}</h3>
          

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
          <div
            className="mt-0"
          >
            <h3>* 镜像制作费用 50 POWER</h3>
          </div>



     
          <div
            className="mt-4 w-full lg:w-1/2 xl:w-1/2 flex flex-col xl:flex-row items-center justify-center gap-2 border border-gray-200 rounded-lg p-2"
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
                
                
                <input
                  disabled
                  style = {{width: "80%"}}
                  id="prompt"
                  type="text"
                  value={prompt}
                  //placeholder="Prompt"
                  placeholder="Loading..."
                />



              ) : (
                <input
                  className=" w-full"
                  id="prompt"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  //placeholder="Prompt"
                  placeholder="您想要制作的图像消息 ChatGPT 4o"
                />
              )}

            </div>


            <div className=" xl:w-52 flex flex-row xl:flex-col items-center justify-center gap-2">

              {/* hidden */}
              <input
                style = {{display: "none"}}
                id="number"
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Number of images"
                max="10"
              />

              {/* check box for real picture */}

              <div className=" text-sm flex flex-row items-center justify-center gap-2">
                <input
                  type="checkbox"
                  id="checkIsRealPicture"
                  value={checkIsRealPicture}
                  onChange={(e) => setCheckIsRealPicture(e.target.checked)}
                />
                真实图片
              </div>


              {/*}
              <button onClick={getImages}>Get {number} Images</button>
              */}
              {loading ? (
                <button hidden>创建镜像</button>
              ) : (
                <div className="flex flex-row items-center justify-center gap-2">
                  <button
                    disabled={loading || prompt === ""}
                    onClick={getImages}>创建镜像
                  </button>
                  {/* reset button */}
                  <button
                    onClick={() => {
                      setResults([]);
                      setPrompt("");
                      setNumber(1);
                      setCheckIsRealPicture(false);
                    }}
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
                width={400}
                height={200}
              />
              
          ) : (

            <>

                {results.map((result) => {
                  return (
                    <div
                      
                    key={result.url}

                      className="w-full border border-gray-200 rounded-lg overflow-hidden"
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
                <span>下载并退出</span>

              }
            </button>
          )}

      


          {/* erc721ContractAddress */}
          {walletAddress && walletAddress != "" && (
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
                  <span className="text-center text-sm text-gray-500">
                    {erc721ContractAddress}
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


        {/* if userid is 'songpa', show my images */}
        {userid != null && userid != 'null' && userid != "" && (

          <div className="
          xl:w-1/2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-4">
          

            {myImages.map((myImage, index) => {
              return (
                <div
                  key={myImage._id}
                  className="border border-gray-200 rounded-lg overflow-hidden flex flex-col items-center justify-center gap-2"
                >
                  <Image
                    
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
                          <button
                            disabled={loadingMintNFTs[index]}
                            onClick={() => mintNFT(myImage.image, myImage.prompt, index)}
                            className={`
                              ${loadingMintNFTs[index] ? "bg-gray-200" : "bg-blue-500"
                              } text-white text-sm py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                          >
                            {loadingMintNFTs[myImages.indexOf(myImage)] ? "Minting..." : "Mint"}
                          </button>

                          {/* delete button */}
                          <button
                            disabled={loadingDeleteMyImage[index]}
                            onClick={() => deleteMyImage(myImage.image, index)}
                            className={`
                              ${loadingDeleteMyImage[index] ? "bg-gray-200" : "bg-red-500"
                              } text-white text-sm py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                          >
                            {loadingDeleteMyImage[myImages.indexOf(myImage)] ? "Deleting..." : "Delete"}
                          </button>


                        </div>
                      


                      ) : (
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
                      )}

                    </>


                  )}

                </div>
              );
            })}

          </div>

        )}



      </main>

      {/* footer */}
      {/* fixed bottom */}
      {/* menu01.png => Coming Soon */}
      {/* menu02.png => current page */}
      {/* menu03.png => 'https://olgagpt.unove.space/' */}
      {/* menu04.png => 'https://olgagpt.com/sub/order_list.asp' */}
      {/* menu05.png => 'https://olgagpt.com/main.asp' */}
 

      <div className=" fixed bg-white z-50 text-black
        left-0
        bottom-0 w-full border-t border-gray-200 grid grid-cols-5 gap-0
      ">
          <button
            onClick={() => {
              // Coming soon

              alert("Coming soon");
            }}
          >
            <div className="h-20 flex flex-col items-center justify-start ">
              <Image
                src="/menu01.png"
                alt="Logo"
                width={40}
                height={40}
              />
              <span className="text-xs xl:text-sm font-bold">
                SNS
              </span>
            </div>
          </button>
          <button
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
            <div className=" h-20 flex flex-col items-center justify-start">
              <Image
                src="/menu02.png"
                alt="Logo"
                width={40}
                height={40}
              />
              <span className="text-xs xl:text-sm font-bold">
                Image<br/>Generator
              </span>
            </div>
          </button>
          <button
            onClick={() => {
              // Coming soon
              window.open("https://olgagpt.unove.space/" + userid + "/" + username, "_self");
            }}
          >
            <div className="h-20 flex flex-col items-center justify-start">
              <Image
                src="/menu03.png"
                alt="Logo"
                width={40}
                height={40}
              />
              <span className="text-xs xl:text-sm font-bold">
                Chat GPT
              </span>
            </div>
          </button>
          <button
            onClick={() => {
              window.open("https://olgagpt.com/sub/order_list.asp", "_self");
            }}
          >
            <div className="h-20 flex flex-col items-center justify-start">
              <Image
                src="/menu04.png"
                alt="Logo"
                width={40}
                height={40}
              />
              <span className="text-xs xl:text-sm font-bold">
                My NFT
              </span>
            </div>
          </button>
          <button
            onClick={() => {
              window.open("https://olgagpt.com/main.asp", "_self");
            }}
          >
            <div className="h-20 flex flex-col items-center justify-start">
              <Image
                src="/menu05.png"
                alt="Logo"
                width={40}
                height={40}
              />
              <span className="text-xs xl:text-sm font-bold">
                OLGA
              </span>
            </div>
          </button>

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
