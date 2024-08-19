import axios from "axios";
import sharp from "sharp";

////import { PutBlobResult } from '@vercel/blob'

import { put } from '@vercel/blob';


import { customAlphabet } from 'nanoid';

import {
	insertOne as insertOneImage,
} from '../../lib/api/image';



///export const runtime = 'edge'


const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string


export default async function handler(req, res) {

  const userid = req.body?.userid;

  const url = req.body.url;

  const prompt = req.body.prompt;

  const type = req.body.type;

  if (!url) {
    return res.status(400).json({ error: "Please provide a url" });
  }



  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const base64 = Buffer.from(response.data, "binary").toString("base64");



  const contentType = type || 'image/png';
  
  //const filename = `${nanoid()}.${contentType.split('/')[1]}`

  const filename = `${nanoid()}.${type}`;


  const blob = await put(

    filename,
    
    Buffer.from(base64, "base64"),

    {
      contentType: "image/png",


      access: 'public',
    }
  )

  console.log('blob?.url', blob?.url);





  const image = blob.url;
  const erc721ContractAddress = '';
  const tokenid = 0;


  const result = await insertOneImage({
    prompt: prompt,
    url: url,
    image: image,
    erc721ContractAddress: erc721ContractAddress,
    tokenid: tokenid,
  });

  console.log("result", result);



  

  if (userid != null && userid != 'null' && userid != "" && blob.url != null && blob.url != 'null' && blob.url != "" && userid != "songpa") {
    const pointRrl = "https://www.olgagpt.com/sub/createNFT.asp?userid=" + userid + "&image=" + encodeURIComponent(blob.url);
    ///console.log(pointRrl);
    const callback = await fetch(pointRrl);

    const data = await callback.json();

    ///console.log(data);

  }
  



  console.log("download url", url);
  console.log("download type", type);



  /*
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const base64 = Buffer.from(response.data, "binary").toString("base64");
  */



  if (type == 'png') {

    const png = await sharp(Buffer.from(base64, "base64"))
      .png()
      .toBuffer();
    const pngBase64 = Buffer.from(png, "binary").toString("base64");

    ///console.log("pngBase64", pngBase64);


    /*
    const resultUpload = await fetch("/api/upload", {
      method: "POST",

      ////headers: { 'content-type': type || 'application/octet-stream' },

      headers: { 'content-type': 'application/octet-stream' },

      body: pngBase64,
    });
  
    const json = await resultUpload.json();

    console.log("json", json);
    */

  



    res.status(200).json({ result: `data:image/png;base64,${pngBase64}` });


  } else if (type == 'jpg') {
    const jpg = await sharp(Buffer.from(base64, "base64"))
      .jpeg()
      .toBuffer();
    const jpgBase64 = Buffer.from(jpg, "binary").toString("base64");


    res.status(200).json({ result: `data:image/jpeg;base64,${jpgBase64}` });

  } else if (type == 'gif') {
    const gif = await sharp(Buffer.from(base64, "base64"))
      .gif()
      .toBuffer();
    const gifBase64 = Buffer.from(gif, "binary").toString("base64");


    res.status(200).json({ result: `data:image/gif;base64,${gifBase64}` });

  } else if (type == 'avif') {
    const avif = await sharp(Buffer.from(base64, "base64"))
      .avif()
      .toBuffer();
    const avifBase64 = Buffer.from(avif, "binary").toString("base64");


    res.status(200).json({ result: `data:image/avif;base64,${avifBase64}` });

  } else {


    res.status(200).json({ result: `data:image/webp;base64,${base64}` });
  }



  

}
