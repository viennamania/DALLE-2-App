

import {
	findOne,
} from '../../../lib/api/image';



// [tokenid].js

export default async function handler(req, res) {

    const {
        query: { tokenid },
    } = req // tokenid is the dynamic route parameter

    console.log(tokenid)


    let image = null;

    // get the nft from the database

    const imageData = await findOne(
      {
        tokenid: tokenid,
      }
    );

    //console.log(imageData);


    if (imageData) {
        image = imageData.image;
    } else {
        image = "https://vzrcy5vcsuuocnf3.public.blob.vercel-storage.com/IQS6RgA-hGAebGLABjxbpjfbaI6LG7RUkP7u56.png";
    }


    /*
    {
        "id": "0",
        "name": "Starburst Speed",
        "description": "Granderby NFT Horses",
        "image": "https://dshujxhbbpmz18304035.gcdn.ntruss.com/nft/HV/hrs/Hrs_00000000.png",
        "attributes": [
          {
            "trait_type": "Speed",
            "value": 11
          },

        ],
        "animation_url": "",
        "external_url": "https://granderby.io/horse-details/0"
      }
    */

    // response json


    const nft = {
        "id": tokenid,
        "name": "Olga NFT",
        "description": "Olga NFT",
        "image": image,
        "attributes": [
            {
                "trait_type": "prompt",
                "value": "Olga NFT"
            },

        ],
        "animation_url": "",
        "external_url": "https://image.olgaai.io"
    }

    res.status(200).json(nft)

}