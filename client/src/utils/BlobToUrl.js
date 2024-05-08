import {Buffer} from "buffer";

export const BlobToUrl = (blobData) => {
    const base64String = Buffer.from(blobData).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64String}`;

    return (
        <img src={imageUrl} alt="Avatar" />
    )
};