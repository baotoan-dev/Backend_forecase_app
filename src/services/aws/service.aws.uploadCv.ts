import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import ImageBucket from "../../models/enum/imageBucket.enum";
import logging from "../../utils/logging";
import ProfilesBucket from "../../models/enum/profileBucket.enum";


const uploadCVToS3Service = async (
    file,
    file_name?: string,
    bucket: ProfilesBucket = ProfilesBucket.CV_BUCKET,
    profileId: string = null,
) => {
    try {
        logging.info("Upload files to aws service start ...");
        const client = new S3Client({ region: process.env.AWS_REGION });
        const param = {
            Bucket: process.env.AWS_BUCKET_NAME , // Bucket name
            Key: `${bucket}${profileId ? "/" + profileId.toString() : ""}/${file_name}`,
            Body: file.buffer,
            
        };


        await client.send(new PutObjectCommand(param));        

        return `${param.Key.split('/').pop()}`
            
                // `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/
        
    } catch (error) {
        logging.error(`Upload files to aws service error: ${error}`);
        throw error;
    }
};

export default uploadCVToS3Service;