import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import ProfilesBucket from "../../models/enum/profileBucket.enum";
export const bucketParams = { Bucket: "BUCKET_NAME", Key: "KEY" };

const deleteCv = async (uid: string, url: string) => {
  try {
    const client = new S3Client({ region: process.env.AWS_REGION });
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME , // Bucket name
            Key: `${ProfilesBucket.CV_BUCKET}/${uid}/${url}`
        }
        
        await client.send(new DeleteObjectCommand(params));

        return params.Key.split('/').pop();
  } catch (err) {
    console.log("Error", err);
  }
};

export default deleteCv;