import Head from "next/head";
import { use, useEffect, useState } from "react";

import styles from "../styles/Home.module.css";

import axios from "axios";

import Image from "next/image";

import { useSearchParams } from 'next/navigation'
 

/////import { Configuration, OpenAIApi } from "openai";


import { PutBlobResult } from '@vercel/blob';

import { usePathname, useRouter } from 'next/navigation'

import { useAnimation, motion } from "framer-motion";
import { set } from "react-hook-form";

// toasts
import { toast } from 'react-toastify';



export default function Home() {

  // get parameter from url

  const searchParams = useSearchParams()
 

  const username = searchParams.get('userid')

  const userid = searchParams.get('token');



  const router = useRouter();




  //const [token, setToken] = useState("");


  const [prompt, setPrompt] = useState("");
  const [number, setNumber] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  ///const [likes , setLikes] = useState([]);


  // get image list from api
  const [imageList, setImageList] = useState([]);


  useEffect(() => {
          
    axios
      .get(`/api/getAllNFTs`)
      .then((res) => {

        ///console.log("res.data", res.data);

        setImageList(res.data);



      })
      .catch((err) => {
        console.log(err);
      });
    

  }, []);




  const likeNft = (imageid) => {

    console.log("likeNft imageid=", imageid);
    console.log("likeNft userid=", userid);

    axios
      .post(`/api/likeNft`, {
        imageid: imageid,
        userid: userid,
      })
      .then((res) => {

        //toast.success('Liked!'); // chinese language

        // chinese language
        toast.success('喜欢！');





        console.log(res);
        if (res.data.result === "success") {
          setImageList(
            imageList.map((item) =>
              item._id === imageid
                ? { ...item, likes: item.likes + 1 }
                : item
            )
          );
        }

      })
      .catch((err) => {
        console.log(err);
      });
  }

  const unlikeNft = (imageid) => {
    axios
      .post(`/api/unlikeNft`, {
        imageid: imageid,
        userid: userid,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }




  return (


    <div className="container
    w-full h-full items-center justify-center bg-gray-100">



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
        className="flex flex-col items-center justify-center w-full px-20 text-center
          mb-32
          bg-gray-100
        "
      >

        

        <div className="w-full flex flex-col items-center justify-center gap-4 mt-4">
          <Image
            src="/logo-chatgpt.png"
            alt="Logo"
            width={50}
            height={50}
          />
          

          <h1 className={styles.title}>
            Create images with <span className={styles.titleColor}>ChatGPT 4o</span>
          </h1>
        </div>


        {/* image list */}


        <div className="
          xl:w-1/2 grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4 p-4
          w-full
        ">
        
          

  

        {/*
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          gap-4 xl:gap-2 p-4
          w-full
        ">
        */}
          {imageList &&
          imageList.map((item) => (
            <div key={item._id}
              className="
                w-full border border-gray-200 rounded-xl shadow-xl flex flex-col items-center justify-start gap-4
                "
            >

              <div
                className="relative
                  w-72 h-72 rounded-xl overflow-hidden
                "
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




              <div className="w-full flex flex-col items-start justify-start gap-2 p-4">
              


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
    
                        onClick={ () => {
                          
                          /*
                          if (item?.likeYn) {
                            
                            unlikeNft(item._id)


                          } else {
                            
                            likeNft(item._id)

                          }
                          */
                         likeNft(item._id)
                        
                        } }
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




                {/*
                <p>
                  {
                    item?.username ? item?.username
                    : item.userid && item.userid.length > 10 ? item.userid.substring(0, 10) + "..."
                    : item.userid
                  }
                </p>
                */}

                {/* prompt */}
                {/*}
                <p>{item.prompt}</p>
                <p>{item.englishPrompt}</p>
                */}




                
                <div className="w-full flex flex-row items-center justify-between gap-2
                ">
                  {
                    item.prompt?.length > 100 ?
                    item.prompt?.substring(0, 100) + "..."
                    : item.prompt
                  }
                </div>

                {/*}
                <p>{item?.username}</p>
                */}

                {/* opensea link */}
                {/*
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
                */}

              </div>

            </div>
          ))}

        </div>






      </main>




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
            //selected
            className=" h-24 flex flex-col items-center justify-start text-white
              p-2
            "
            style = {{backgroundColor: "cadetblue"}}
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
            className="
              h-24 flex flex-col items-center justify-start hover:bg-gray-200 hover:text-black   
              p-2
            "

            onClick={() => {
              router.push(
                `/?userid=${username}&token=${userid}`
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
            p-2
          "
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




    </div>
  );
}
