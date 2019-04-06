const { Schema } = require('./config');
const ObjectId = Schema.Types.ObjectId;

const ArticleSchema = new Schema({
    title : String,
    content : String,
    author : {      //关联users 表的对象
        type : ObjectId,
        ref : "users"
    },
    tips: String,
    commentNum : Number
},{
    versionKey:false,
    timestamps :{
        createdAt : "created"
    }
});

module.exports = ArticleSchema;

