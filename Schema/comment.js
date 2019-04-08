const { Schema } = require('./config');
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({
    // 头像   用户名
    // 文章
    // 内容
    content: String,
    // 关联用户表
    from: {
        type: ObjectId,
        ref: "users"
    },
    // 关联到 article 表 --》 集合
    article: {
        type: ObjectId,
        ref: "articles"
    }
}, {versionKey: false, timestamps: {
        createdAt: "created"
    }})


//设置 comment的remove钩子
// CommentSchema.pre('remove',(next)=>{});//通过pre前置钩子 监听删除行为
CommentSchema.post('remove',(document) => {
    //当前回调函数 一定会在save 事件执行前触发

    const Article =require('../Moudels/article');
    const User =require('../Moudels/user');

    const { from ,article} = document;

    //对应文章的评论数 -1
    Article.updateOne({_id : article}, {$inc : {commentNum : -1}}).exec();

    //当前被删除评论的作者的commentNum -1
    User.updateOne({ _id: from},{$inc : {commentNum: -1}}).exec()

});

module.exports = CommentSchema;