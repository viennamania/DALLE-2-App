import {
  findAll
} from '../../lib/api/image';

export default async function handler(req, res) {


  //console.log("getAllImages called");


  const images = await findAll();

  res.status(200).json(images);


}
