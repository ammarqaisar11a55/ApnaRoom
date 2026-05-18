const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

const storage = multer.memoryStorage();
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (_req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadImageBuffer = async (file, folder = 'apnaroom') => {
  if (!file) return null;

  if (!hasCloudinaryConfig) {
    return {
      url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      publicId: '',
      alt: file.originalname,
    };
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
    transformation: [{ width: 1600, crop: 'limit' }, { quality: 'auto', fetch_format: 'auto' }],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    alt: file.originalname,
  };
};

const mapUploadedImages = async (files = {}, folder = 'apnaroom') => {
  const thumbnailFile = files.thumbnail?.[0];
  const imageFiles = files.images || files.roomImages || [];
  const [thumbnail, images] = await Promise.all([
    uploadImageBuffer(thumbnailFile, folder),
    Promise.all(imageFiles.map((file) => uploadImageBuffer(file, folder))),
  ]);

  return {
    thumbnail,
    images: images.filter(Boolean),
  };
};

module.exports = { upload, mapUploadedImages };
