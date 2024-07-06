import { S3Client, CopyObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import ImageBucket from "../../models/enum/imageBucket.enum";
import logging from "../../utils/logging";
import ProfilesBucket from "../../models/enum/profileBucket.enum";

// This function will be used to copy file from folder to another folder in aws s3
// example: when user apply for a job, we will copy cv from cv folder to application folder
// so that we can keep track of which cv is used for which application


const copyFileService = async (
    copySource: string,
    key: string,
) => {
    try {
        logging.info("Copy files to aws service start ...");
         const client = new S3Client({ region: process.env.AWS_REGION });
        const param = {
            Bucket: process.env.AWS_BUCKET_NAME , // Bucket name
            Key: key,
            CopySource: copySource,
            
        };

        try {
            const data = await client.send(new CopyObjectCommand(param));
            logging.info("Copy file to aws service success");
            return data;
        }
        catch (error) {
            logging.error(`Copy files to aws service error: ${error}`);
            throw error;
        }

        
    } catch (error) {
        logging.error(`Copy files to aws service error: ${error}`);
        throw error;
    }
};

export default copyFileService;