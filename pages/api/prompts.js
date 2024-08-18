

import { findAll } from '../../lib/api/prompt';






export default async function handler(req, res) {


  const response = await findAll();


  if (!response) {
    return res.status(400).json({
      result: "error",
      message: "No data",
    });
  }


  res.status(200).json({
    result: "success",
    data: response,
  });
  
}
