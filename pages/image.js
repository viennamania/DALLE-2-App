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



  // get image list from api
  const [imageList, setImageList] = useState([]);
  useEffect(() => {
      
      
      axios
        .get(`/api/getAllImages`)
        .then((res) => {

          ///console.log("res.data", res.data);

          setImageList(res.data);

        })
        .catch((err) => {
          console.log(err);
        });
     
  
    }, []);




  return (


    <div className={styles.container}>

      <main className={styles.main}>

        
        {/* image list */}
  


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {imageList &&
          imageList.map((item) => (
            <div key={item._id}
              className="p-4 border border-gray-200 rounded-lg shadow-lg flex flex-col items-center"
            >
                
              <p>
                {
                  (new Date(item.createdAt)).toLocaleString()
                }
              </p>
              <p>{item.prompt}</p>
              <p>{item.englishPrompt}</p>


              <div  className="relative
                w-72 h-72 rounded-lg overflow-hidden bg-gray-200 mt-2"
              >

                {item.erc721ContractAddress !== "" && item.erc721ContractAddress !== null && item.erc721ContractAddress !== undefined && (
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
                    window.open(item.image, "_blank");
                  } }
                  
                  src={item.image}
                  alt="Image"
                  width={500}
                  height={500}
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

              <p>{item?.username}</p>

              {/* opensea link */}
              {item.erc721ContractAddress !== "" && item.erc721ContractAddress !== null && item.erc721ContractAddress !== undefined && (
                <a
                  href={`https://opensea.io/assets/matic/${item.erc721ContractAddress}/${item.tokenid}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="flex flex-row items-center gap-2 mt-2">
                    <Image
                      src="/icon-opensea.png"
                      alt="Logo"
                      width={20}
                      height={20}
                    />
                    <p>OpenSea</p>
                  </div>
                </a>
              )}
            </div>
          ))}

        </div>




      </main>


    </div>
  );
}
