const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "hotel-3d761.appspot.com"
  });
  const bucket = admin.storage().bucket();
  const firebaseUpload = (req,res,next)=>{
    try {
console.log(req.file);
        if (req.file) {
          console.log('I`m in .............')
            const image = new Date().valueOf() + req.file.originalname;
        const blob = bucket.file(image);
        const blobWriter = blob.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });
        blobWriter.on('error', (err) => next(err));
        blobWriter.on('finish', () => {
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`;
          req.imageURL = publicUrl;
          console.log(req.imageURL)
          next();
        });
        blobWriter.end(req.file.buffer);
       
        }else{
          next();
        }
        
 
      } catch (error) {
        res.status(400).send(`Error, could not upload file: ${error}`);
        return;
      }
  }

  module.exports={
    firebaseUpload,
  }