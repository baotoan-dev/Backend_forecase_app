import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
export const bucketParams = { Bucket: "BUCKET_NAME", Key: "KEY" };

const deleteImages = async (urls: string[]) => {
  try {
    const client = new S3Client({ region: process.env.AWS_REGION });
        const params = urls.map((url) => ({
            Bucket: process.env.AWS_BUCKET_NAME , // Bucket name
            Key: url
        }));
        
        await Promise.all(
            params.map((param) => client.send(new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: param.Key
            })))
        );

        return params.map(
            (param) =>
                // `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/
                `${param.Key.split('/').pop()}`
        );
  } catch (err) {
    console.log("Error", err);
  }
};

export default deleteImages;