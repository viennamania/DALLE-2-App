

import {
  findAllNFTs
} from '../../lib/api/image';




export default async function handler(req, res) {

  // sort parameter
  const sort = req.query.sort;

  const images = await findAllNFTs(
    {
      sort: sort
    }
  );

  //console.log('images', images);


  res.status(200).json(images);


}
