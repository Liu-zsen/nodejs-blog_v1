const { Schema } = require('./config');

const UserSchema = new Schema({
    username:String,
    password:String,
    role : {        //权限
        type : String,
        default : 1
    },
    articleNum : Number,    //文章
    commentNum : Number,    //评论
    avatar : {
        type : String,
        default : '/avatar/default.jpg'
    }
});

module.exports = UserSchema;