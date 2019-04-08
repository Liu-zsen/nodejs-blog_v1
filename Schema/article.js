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

//设置 Article 的remove钩子
ArticleSchema.post('remove', document =>{
    const Comment = require('../Moudels/comment');
    const User = require('../Moudels/user');

    const { _id : artId , author : authorId} = document;

    //只需要用户的ArticleNum -1
    User.findByIdAndUpdate(authorId , {$inc : {articleNum: -1}}).exec();

    //把当前需要删除文章的所关联的所有评论 调用评论remove
    Comment.find({article : artId})
        .then(data => {
            data.forEach(v => v.remove())
        })
})

module.exports = ArticleSchema;

