const router = require('express').Router();
const {upload}=require('../middleware/multer');
const {firebaseUpload}=require('../middleware/upload');
const {  creat,
    find,
    update,
} = require('../models/user');
const auth = require('../middleware/auth');
router.post('/addAdvertising',auth,upload.single('picture'),firebaseUpload,async(req,res)=>{
    try {
        const user_id = req.id;
        const user = await find('users', { id: user_id });
        console.log(user);
        const picture = req.imageURL;
        console.log("success uploaded",picture);
        await creat('advertising',{picture})
        res.status(200).send({ success:"add advertising" });
      } catch (error) {
        res.status(400).send(`Error : ${error}`);
        return;
      }
});
router.get('/Advertising',auth,async(req,res)=>{
    try {
        const advertising = await find('advertising');
        res.status(200).send({ advertising });
      } catch (error) {
        res.status(400).send(`Error : ${error}`);
        return;
      }
});
router.put('/addAdmin',auth,async(req,res)=>{
    try {
      //  console.log(user[0].type,"StudentCouncil","EngineeringClub","IEEE","Admin","Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJpYXQiOjE2MjA0MDg0MDZ9.cwcsLgbzsLqd0LuLjazH70on2Ao4EhsUtvRcYeqjp14");
      const user_id = req.id
      const user = await find('users', { id:user_id});
      if(user[0].type=="Admin"){
        const { id,type} = req.body;
        console.log(id,type)
        await update('users',{id},{type} )
        res.status(200).send({ success:"update" });
      }else{
        res.status(400).send({failed:"Authrization error , you are not admin"});
      }
      } catch (error) {
        res.status(400).send(`Error : ${error}`);
        return;
      }
});
module.exports = router;