const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


const dotenv = require('dotenv')
dotenv.config()

const bucketName =  process.env.BUCKET_NAME
const bucketRegion =  process.env.BUCKET_REGION
const accessKey =  process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client ({ 
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  },
  region: bucketRegion
});


//
const uploadFile = async(fileBuffer, fileName, mimetype) => {
    const uploadParams = {
      Bucket: bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: mimetype
    }
    
    const command = new PutObjectCommand(uploadParams);
    // await s3.send(command);
    // await s3.send(new PutObjectCommand(uploadParams));
    return await s3.send(command);
}


//
const getFileUrl = async(fileTitle) => {
    const params = {
      Bucket: bucketName,
      Key: `eshop_images/${fileTitle}`
    }
  
    const command = new GetObjectCommand(params);
    const seconds = 180
    const url = await getSignedUrl(s3, command, { expiresIn: seconds });
  
    return url
}

// Delete a file from S3
const deleteFile = async (fileTitle) => {
  const params = {
    Bucket: bucketName,
    Key: `eshop_images/${fileTitle}`
  };

  const command = new DeleteObjectCommand(params);        console.log("Now deleteing from s3 this image: ", fileTitle)
  await s3.send(command);
};



module.exports = {
  uploadFile,
  getFileUrl,
  deleteFile
};
