import ImageBucket from '../../models/enum/imageBucket.enum';
import {v2 as cloudinary} from 'cloudinary';
import {v4 as uuidv4} from 'uuid';

// config cloudinary
cloudinary.config({
  cloud_name: 'ddwjnjssj',
  api_key: '928543254767848',
  api_secret: 'w8JEy_kZ8uyV99aHKnUZPI7NSiQ',
});

// upload single file to Cloudinary
const uploadFile = async (files, bucket, postsId, name, type) => {
  try {
    if (!(files instanceof Array)) {
      files = [files];
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(file.buffer);

      // Generate public_id
      const public_id = name
        ? name
        : `${bucket}${postsId ? `/${postsId}` : ''}/${Date.now()}-${uuidv4()}`;

      // Return a Promise for each upload
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: public_id,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        // Pipe the buffer into the upload stream
        uploadStream.end(type === 1 ? buffer : file);
      });
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    // Extract the public_id from each result
    const data = results.map((result) => {
      const dataSplit = result.public_id.split('/');
      return dataSplit[dataSplit.length - 1];
    });

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

// upload multiple files to Cloudinary
const uploadImagesCloud = async (
  files,
  bucket = ImageBucket.DEFAULT,
  postsId = null,
  name = null,
) => {
  try {
    // Ensure 'files' is an array
    return await uploadFile(files, bucket, postsId, name, 1);
  } catch (error) {
    return await uploadFile(files, bucket, postsId, name, 2);
  }
};

export default uploadImagesCloud;
