import axios from "axios";
import sharp from "sharp";


export default async function handler(req, res) {

  const userid = req.body?.userid;




  const url = req.body.url;
  const type = req.body.type;

  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const base64 = Buffer.from(response.data, "binary").toString("base64");

  if (type == 'png') {
    const png = await sharp(Buffer.from(base64, "base64"))
      .png()
      .toBuffer();
    const pngBase64 = Buffer.from(png, "binary").toString("base64");
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


  if (userid != null && userid != 'null' && userid != "" && url != null && url != 'null' && url != "") {
    const pointRrl = "https://www.olgagpt.com/sub/createNFT.asp?userid=" + userid + "&image=" + encodeURIComponent(url);
    ///console.log(pointRrl);
    const callback = await fetch(pointRrl);

    const data = await callback.json();

    ///console.log(data);

  }
  

}
