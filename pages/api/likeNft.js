import {
  likeOneByImage,
} from '../../lib/api/image';

import {
  findOneByUserid,
} from '../../lib/api/wallet';







export default async function handler(req, res) {




  // post parameters from the request

  //const userid = req.query.userid;

  // post parameters from the request

  const { userid, imageid } = req.body;



  console.log("userid: ", userid);

  if (!userid) {
    return res.status(400).json({
      result: "error",
      message: "userid is required",
    });
  }



  console.log("imageid: ", imageid);

  if (!imageid) {
    return res.status(400).json({
      result: "error",
      message: "image is required",
    });
  }

  const prompt = req.query.prompt;



  ///console.log("image: ", image);


  const existingWalletData = await findOneByUserid( { userid: userid } );

  
  ///console.log("existingWalletData: ", existingWalletData);



  if (!existingWalletData) {
    return res.status(400).json({
      result: "error",
      message: "Wallet data not found",
    });
  }



  const likeImageData = await likeOneByImage(
    {
      imageid: imageid,
      userid: userid,
    }
  );
    
  if (likeImageData) {
    return res.status(200).json({
      result: "success",
      message: "Liked",
    });
  }

  return res.status(400).json({
    result: "error",
    message: "Like failed",
  });


}
