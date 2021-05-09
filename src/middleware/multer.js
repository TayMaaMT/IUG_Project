const multer = require('multer');
 upload = multer({
    dest: 'images',
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 1000000
    },
    fileFilter(req, file, cb) {
        console.log("fuck you")
        console.log(file)
        if(file.originalname){
            if (!file.originalname.match(/\.(jpg|png|jpeg|webp)$/)) {
                return cb(new Error('please upload a imge file'))
            }
        }

        cb(undefined, true)
    }
})

module.exports={
    upload
}
