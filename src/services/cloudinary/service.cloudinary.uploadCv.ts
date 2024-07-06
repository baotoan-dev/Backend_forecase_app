import cloudinaryV2 from 'cloudinary';
import {v2 as cloudinary} from 'cloudinary';
import ProfilesBucket from '../../models/enum/profileBucket.enum';
import logging from '../../utils/logging';

// config cloudinary
cloudinary.config({
  cloud_name: 'ddwjnjssj',
  api_key: '928543254767848',
  api_secret: 'w8JEy_kZ8uyV99aHKnUZPI7NSiQ',
});

const uploadCVToCloudinaryService = async (
  file,
  file_name = '',
  bucket = ProfilesBucket.CV_BUCKET,
  applicationId = null,
  type = false,
) => {
  try {
    // update file pdf to cloudinary
    const buffer = !type ? Buffer.from(file.buffer) : file;

    // Generate public_id

    const public_id = `${bucket}${applicationId ? ("/" + applicationId) : ""}/${file_name}`

    // Return a Promise for each upload

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: public_id,
            resource_type: 'image',
            overwrite: true,
            use_filename: true,
            filename_override: file_name,
            discard_original_filename: true,
            // allow delivery
            allowed_formats: ['pdf'],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        )
        .end(buffer);
    });
  } catch (error) {
    logging.error(`Upload files to cloudinary error: ${error}`);
  }
};

export default uploadCVToCloudinaryService;
