import Head from "next/head";
import { use, useEffect, useState } from "react";

import styles from "../styles/Home.module.css";

import axios from "axios";

import Image from "next/image";

import { useSearchParams } from 'next/navigation'
 

/////import { Configuration, OpenAIApi } from "openai";


import { PutBlobResult } from '@vercel/blob';


import { usePathname, useRouter } from 'next/navigation'

import Script from 'next/script'


export default function Home() {

  // get parameter from url

  const searchParams = useSearchParams()
 

  const username = searchParams.get('userid')

  const userid = searchParams.get('token');

  const erc721ContractAddress = searchParams.get('erc721ContractAddress');

  console.log("userid=", userid);

  const router = useRouter();





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
        <meta property="og:image" content="https://image.olgaai.io/logo-chatgpt.png"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:image" content="https://image.olgaai.io/logo-chatgpt.png"></meta>


      </Head>

      {/* <script src="https://unpkg.com/embeddable-nfts/dist/nft-card.min.js"></script> */}
      
 

      <main className="flex flex-col items-center justify-center gap-2">

        {/* iframe https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/109640} */}
        {/* Refused to display 'https://opensea.io/' in a frame because it set 'X-Frame-Options' to 'deny'. */}

        {/*
        <iframe
          src={`https://opensea.io/assets/${erc721ContractAddress}?embed=true`}
          width="100%"
          height="500"
          frameborder="0"
          allowFullScreen
        ></iframe>
        */}


      

          {/*}
      <nft-card contractAddress={erc721ContractAddress}
       tokenId="1"></nft-card>
      */}
      {/*
      <iframe src="https://opensea.io/assets/boredapeyachtclub?embed=true"
        width="100%"
        height="500"
        frameborder="0"
        allowfullscreen 
        />
      */}
        


      </main>

      {/* footer */}
      {/* fixed bottom */}
      {/* menu01.png => Coming Soon */}
      {/* menu02.png => current page */}
      {/* menu03.png => 'https://olgaai.io/' */}
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
              window.open("https://olgaai.io/?userid=" + username + "&token=" + userid, "_self");
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
