import Head from "next/head";
import { use, useEffect, useState } from "react";

import styles from "../styles/Home.module.css";

import axios from "axios";

import Image from "next/image";

import { useSearchParams } from 'next/navigation'
 

/////import { Configuration, OpenAIApi } from "openai";


import { PutBlobResult } from '@vercel/blob';



export default function Home() {

  // get parameter from url

  const searchParams = useSearchParams()
 

  const userid = searchParams.get('userid')

  console.log("userid=", userid);




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


          window.open("https://www.olgagpt.com/sub/deposit_request_krw.asp", "_blank");

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


  console.log("erc721ContractAddress=", erc721ContractAddress);
  console.log("totalSupply=", totalSupply);



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


  console.log("myImages=", myImages);




  return (


    <div className={styles.container}>
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

      <main className={styles.main}>

        
        <Image
          src="/logo-chatgpt.png"
          alt="Logo"
          width={100}
          height={100}
        />
        



        <h1 className={styles.title}>
          Create images with <span className={styles.titleColor}>ChatGPT 4o</span>
        </h1>

        {/* if userid is not null, show userid */}
        
        {userid != null && userid != 'null' && userid != "" ? (

          <div className="mt-2 flex flex-col items-center justify-center gap-2">

            <h3>您的用户ID: {userid}</h3>
          

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
          className="mt-2"
        >
          <h3>* 镜像制作费用 50 POWER</h3>
        </div>



     
        <div
          className="mt-4 w-full lg:w-1/2 xl:w-1/3 flex flex-col xl:flex-row items-center justify-center gap-2 border border-gray-200 rounded-lg p-2"
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


          <div className=" xl:w-40 flex flex-row xl:flex-col items-center justify-center gap-2">

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
              <button onClick={getImages}>创建镜像</button>
            )}

          </div>



        </div>
        
        <div>




        </div>

        <div className="xl:w-1/2 flex flex-col items-center justify-center gap-2 ">
          <small
            style = {{display: "none"}}
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
            style = {{marginTop: "20px"}}
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

      
        {/* if userid is 'songpa', show my images */}
        {userid != null && userid != 'null' && userid != "" && (

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          

            {myImages.map((myImage) => {
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
                  <div className="text-center text-xs text-gray-500 p-2"> 
                    {new Date(myImage.createdAt).toLocaleString()}
                  </div>
                </div>
              );
            })}

          </div>

        )}



      </main>

      <footer className={styles.footer}>

        <a
          href="https://www.olgagpt.com/"
          target="_blank"
          rel="noopener noreferrer"
        >

        {/* alga.jpg margin top */}
        {/* rouded border */}
        <Image
          style={ {marginTop: "100px", border: "1px solid #ddd", borderRadius: "4px"} }
          src="/alga.jpg"
          priority = {true}
          alt="Logo"
          width={400}
          height={200}
        />

        </a>

      </footer>

    </div>
  );
}
