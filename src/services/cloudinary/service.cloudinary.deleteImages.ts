import {v2 as cloudinary} from 'cloudinary';

// config cloudinary
cloudinary.config({
  cloud_name: 'ddwjnjssj',
  api_key: '928543254767848',
  api_secret: 'w8JEy_kZ8uyV99aHKnUZPI7NSiQ',
});

const deleteImagesCloud = async (directoryNames: string[]) => {
  try {
    for (const directoryName of directoryNames) {
      const result = await cloudinary.uploader.destroy(directoryName);
      if (result.result === 'ok') {
        console.log(`Deleted ${directoryName} successfully.`);
      } else {
        console.error(`Failed to delete ${directoryName}.`);
      }
    }
  } catch (error) {
    throw new Error('Error deleting directories from Cloudinary');
  }
};

export default deleteImagesCloud;
