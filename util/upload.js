const multer = require('koa-multer');
const { join } = require('path');



//配置存储对象
const storage = multer.diskStorage({
    //存储位置
    destination : join(__dirname, '../public/avatar'),

    //文件名
    filename(req,file,cb){
        const filename = file.originalname.split('.')
        cb(null,`${Date.now()}.${filename[filename.length - 1]}`)//时间戳跟文件后缀
    }


});

module.exports = multer({storage});