import Head from "next/head";
import { useEffect, useState } from "react";

import styles from "../styles/Home.module.css";

import axios from "axios";

import Image from "next/image";



export default function Home() {


  //const [token, setToken] = useState("");


  const [prompt, setPrompt] = useState("");
  const [number, setNumber] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);





  function getImages() {


    console.log("prompt=", prompt);

    //if (token != "" && prompt != "") {

    if (prompt != "") {



      setError(false);
      setLoading(true);
      axios
        
        ////.post(`/api/images?t=${token}&p=${prompt}&n=${number}`)

        .post(`/api/images?p=${prompt}&n=${number}`)


        .then((res) => {
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

  const [type, setType] = useState("webp");

  function download(url) {
    axios
      .post(`/api/download`, { url: url, type: type })
      .then((res) => {
        const link = document.createElement("a");
        link.href = res.data.result;
        link.download = `${prompt}.${type.toLowerCase()}`;
        link.click();
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




  return (


    <div className={styles.container}>
      <Head>
        <title>Create Images With GPGPU App</title>
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
     
        <div
          //className={styles.description}
          style = {{width: "340px", marginTop: "20px"}}

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
          <Image
            style = {{verticalAlign: "middle", border: "1px solid #ddd", borderRadius: "50%", padding: "4px"}}
            src="/logo-chatgpt.png"
            alt="Logo"
            width={28}
            height={28}
          />

          {/* width 100% */}
          <input
            style = {{width: "80%"}}
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            //placeholder="Prompt"
            placeholder="您想要制作的图像消息 ChatGPT 4o"
          />
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
          <button onClick={getImages}>创建镜像</button>
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

        {loading && <p>Loading...</p>}


        <div className={styles.grid}>
          {results.map((result) => {
            return (
              <div className={styles.card}>
                <img
                  className={styles.imgPreview}
                  src={result.url}
                  onClick={() => download(result.url)}
                />
              </div>
            );
          })}
        </div>

        {/* allga.jpg margin top */}
        <Image
          style={ {marginTop: "100px"} }
          src="/allga.jpg"
          alt="Logo"
          width={400}
          height={200}
        />

      </main>
    </div>
  );
}
