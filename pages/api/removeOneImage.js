

import {
  deleteOneByImage,
} from '../../lib/api/image';




export default async function handler(req, res) {

 
  const image = req.query?.image;

  if (!image) {
    return res.status(400).json({
      result: "error",
      message: "image is required",
    });
  }

  const result = await deleteOneByImage(
    {
      image: image,
    }
  );

  res.status(200).json(result);
  
}
