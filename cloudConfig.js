const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({ //configure atle koi vastu ne jod vi -> ahi backend ne cloudinary na account sathe connect(jod) kariye chhiye
    //ahi process.env na variables ne koi pan name api sakay chhe pan configure ni andar details send karvi hoy to default aj name apva pade chhe
  cloud_name:process.env.NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET,
});


  
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowerdFormats: ['png','jpg','jpeg'], 
  },
});

module.exports = {
    cloudinary,
    storage,
};
 