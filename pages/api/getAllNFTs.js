

import {
  findAllNFTs
} from '../../lib/api/image';




export default async function handler(req, res) {


  const images = await findAllNFTs(
    {
    }
  );

  //console.log('images', images);


  res.status(200).json(images);


}
