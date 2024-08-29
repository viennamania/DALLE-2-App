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



  // get prompt list from api
  const [promptList, setPromptList] = useState([]);
  useEffect(() => {
      
      axios
        .get(`/api/prompts`)
        .then((res) => {

          //console.log("res.data.data=", res.data?.data);

          setPromptList(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
  
    }, []);




  return (


    <div className={styles.container}>

      <main className={styles.main}>

        
        {/* prompt list */}
        {/*
        
createdAt
: 
"2024-08-18T08:20:44.319Z"
englishPrompt
: 
"People betting at the online horse racing track"
prompt
: 
"온라인경마장에서 베팅하는 사람들"
*/}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {promptList.map((item) => (
            <div key={item._id}
              className="p-4 border border-gray-200 rounded-lg shadow-lg" >
                
              <p>

                {
                  (new Date(item.createdAt)).toLocaleString()
                }

              </p>
              <p>{item.prompt}</p>
              <p>{item.englishPrompt}</p>
              <p>{item?.username}</p>
            </div>
          ))}

        </div>




      </main>


    </div>
  );
}
