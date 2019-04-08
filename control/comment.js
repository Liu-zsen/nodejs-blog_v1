const User = require('../Moudels/user');
const Article = require('../Moudels/article');
const Comment = require('../Moudels/comment');

//保存评论
exports.save = async ctx => {
    let message = {
        status:0,
        msg :'登录才能发表'
    };
    //验证用户是否登录
    if(ctx.session.isNew) return ctx.body = message;

    //登录了
    const data = ctx.request.body;
    data.from = ctx.session.uid;

    const _comment = new Comment(data);

    await _comment
        .save()
        .then(data => {
            message = {
                status:1,
                msg : "发布成功!"
            }

            //更新当前文章的评论的计数
            Article  //找到文章ID
                .update({_id:data.article},{$inc:{
                    commentNum : 1
                    }},err=>{
                    if(err) return console.log(err);
                    console.log('评论计数成功');
                })

            //更新用户评论计数
            User.update({_id : data.from},{$inc : {commentNum: 1}} , err =>{
                if(err) return console.log(err)
            })

        })
        .catch( err => {
            message = {
                status:0,
                msg : err
            }
        });
    ctx.body = message
};

//后台功能 ：查询用户所有评论
exports.comlist = async  ctx => {
    const uid = ctx.session.uid;

    const data = await Comment.find({ from: uid }).populate('article','title')

    ctx.body = {
        code : 0,
        count : data.length,
        data
    }

};

//删除对应Id 的评论
exports.del = async ctx => {
    //获取评论ID
    const commentId = ctx.params.id;

    //拿到评论Id 删除comment

    let res = {
        state : 1,
        message : '成功'
    }

    await Comment.findById(commentId)
        .then(data => data.remove())
        .catch(err => res = {
            state : 0,
            message : err
        });

    ctx.body = res
      
};
