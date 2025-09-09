import AWS from "aws-sdk";
import { AWS_ACCESS_KEY_ID, AWS_S3_REGION_NAME, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME } from "../config/constant";
import { uploadFile } from "./api.services";
import { TOAST_SUCCESS } from "../config/common";

let config = {
  region: AWS_S3_REGION_NAME,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  endpoint: `https://s3.${AWS_S3_REGION_NAME}.amazonaws.com/chatmyastrologer`
};

AWS.config.update(config);

console.log('config', config);

// export const uploadImageOnAWS = async (file, folder) => {
//   const s3 = new AWS.S3();
//   let extension = file.type?.split("/")[1]; // Get the file extension
//   const fileName = `${new Date().getTime()}.${extension}`; // Generate a unique filename with the original file extension
//   const params = {
//     Bucket: AWS_STORAGE_BUCKET_NAME,
//     Key: `${folder}/${fileName}`,
//     Body: file,
//     // ACL: "public-read-write",
//     // ACL: "private",
//   };

//   try {
//     await s3.upload(params).promise();
//     return fileName;
//   } catch (error) {
//     console.log('uploadImageOnAWS', error);

//     throw error;
//   }
// };

export const uploadImageOnAWS = async (file, folder) => {
  // const s3 = new AWS.S3();
  // let extension = file.type?.split("/")[1]; // Get the file extension
  // const fileName = `${new Date().getTime()}.${extension}`; // Generate a unique filename with the original file extension
  // const params = {
  //   Bucket: AWS_STORAGE_BUCKET_NAME,
  //   Key: `${folder}/${fileName}`,
  //   Body: file,
  //   // ACL: "public-read-write",
  //   // ACL: "private",
  // };
  try {

    const formData = new FormData();
    formData.append("file_type", folder); // append file_type (string or value)
    formData.append("files", file);

    const res = await uploadFile(formData);
    console.log('Upload s3 buckets');

    // TOAST_SUCCESS(res.message)
    const uploadedUrl = res?.data[0]?.s3_object_url || "";
    return uploadedUrl;
  } catch (error) {
    console.log('uploadImageOnAWS', error);
    throw error;
  }
};


export const uploadImageOnMultipuleAWS = async (file, folder) => {
  // const s3 = new AWS.S3();
  // let extension = file.type?.split("/")[1]; // Get the file extension
  // const fileName = `${new Date().getTime()}.${extension}`; // Generate a unique filename with the original file extension
  // const params = {
  //   Bucket: AWS_STORAGE_BUCKET_NAME,
  //   Key: `${folder}/${fileName}`,
  //   Body: file,
  //   // ACL: "public-read-write",
  //   // ACL: "private",
  // };
  try {

    const formData = new FormData();
    formData.append("file_type", folder); // append file_type (string or value)
    formData.append("files", file);

    const res = await uploadFile(formData);
    // TOAST_SUCCESS(res.message)
    const uploadedUrl = res?.data || "";
    return uploadedUrl;
  } catch (error) {
    console.log('uploadImageOnAWS', error);
    throw error;
  }
};

