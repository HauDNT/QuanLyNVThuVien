import React from "react";
import { Buffer } from "buffer";

function BlobToUrl ({blobData}) {
  // const base64String = Buffer.from(blobData).toString("base64");
  // const imageUrl = `data:image/jpeg;base64,${base64String}`;
  
  // const imageUrl = window.URL.createObjectURL(blobData);

  const blob = new Blob([Uint8Array.from(blobData)], {type: "image/jpeg/png/jpg"});
  const imageUrl = URL.createObjectURL(blob);

  return <img src={imageUrl} alt="Avatar" />;
};

export default BlobToUrl;