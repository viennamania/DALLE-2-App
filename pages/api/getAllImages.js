import {
  findAll
} from '../../lib/api/image';


export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function handler(req, res) {


  //console.log("getAllImages called");


  const images = await findAll();

  console.log("images", images);

  

  res.status(200).json(images);


}
