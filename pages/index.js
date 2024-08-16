import Head from "next/head";
import { useEffect, useState } from "react";

import styles from "../styles/Home.module.css";

import axios from "axios";

import Image from "next/image";

import { useSearchParams } from 'next/navigation'
 

/////import { Configuration, OpenAIApi } from "openai";



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





  function getImages() {


    //console.log("prompt=", prompt);

    //if (token != "" && prompt != "") {

    if (prompt != "") {



      setError(false);
      setLoading(true);
      axios
        
        ////.post(`/api/images?t=${token}&p=${prompt}&n=${number}`)

        .post(`/api/images?p=${prompt}&n=${number}&userid=${userid}`)


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

  function download(url) {

    axios
      .post(`/api/download`, { url: url, type: type })
      .then((res) => {

        
        const link = document.createElement("a");

        link.href = res.data.result;

        link.download = `${prompt}.${type.toLowerCase()}`;

        link.click();
        
        // save image to local album in mobile

        // res.data.result is base64 image

        ////console.log("res.data.result=", res.data.result);

        
        




        //window.open("https://www.olgagpt.com/sub/deposit_request_krw.asp", "_blank");


      })
      .catch((err) => {
        console.log(err);
      });

  }


    // get openapi key from api
    /*
    useEffect(() => {
      axios
        .get("/api/openapikey")
        .then((res) => {
          setToken(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    , []);
    */





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
        <meta property="og:image" content="https://dall-e.unove.space/logo-chatgpt.png"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:image" content="https://dall-e.unove.space/logo-chatgpt.png"></meta>


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

        {/* margin top 20px */}
        {/* 镜像制作费用 50 POWER */}
        <div
          style = {{marginTop: "20px"}}
        >
          <h3>* 镜像制作费用 50 POWER</h3>
        </div>
     
        <div
          //className={styles.description}
          style = {{width: "340px", marginTop: "10px"}}

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
              style = {{width: "80%"}}
              id="prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              //placeholder="Prompt"
              placeholder="您想要制作的图像消息 ChatGPT 4o"
            />
          )}
        </div>

        
        <div>
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




          {/*}
          <button onClick={getImages}>Get {number} Images</button>
          */}
          {loading ? (
            <button hidden>创建镜像</button>
          ) : (
            <button onClick={getImages}>创建镜像</button>
          )}
        </div>

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

        {loading && (
          <>
          
            {/* loading image */}
            <Image
              src="/chatbot-loading.gif"
              alt="Logo"
              width={400}
              height={200}
            />
           

          
          </>

        ) }


        {loading ? (
            <></>
            
        ) : (

          <div className={styles.grid}>

              {results.map((result) => {
                return (
                  <div
                    
                  key={result.url}

                    className={styles.card}
                  >
                    <img
                      className={styles.imgPreview}
                      src={result.url}
                      //onClick={() => download(result.url)}
                    />
                  </div>
                );
              })}

          </div>

        )}


        {/* download button */}
        {/* download image and anchor goto https://www.olgagpt.com/sub/deposit_request_krw.asp new window */}
        {/* margin top 20px */}
        {!loading && results.length > 0 && (
          <button
            style = {{marginTop: "20px"}}
            onClick={() => {

              download(results[0].url);

              //window.open("https://www.olgagpt.com/sub/deposit_request_krw.asp", "_blank");
              } }
          >
            下载并退出
          </button>
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
