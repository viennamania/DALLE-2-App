

import {
  findAllByUserid
} from '../../lib/api/image';




export default async function handler(req, res) {

 
  const userid = req.query?.userid;

  if (!userid) {
    return res.status(400).json({
      result: "error",
      message: "userid is required",
    });
  }

  const images = await findAllByUserid(
    {
      userid: userid,
    }
  );

  res.status(200).json(images);


}
