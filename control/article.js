const { db } = require('../Schema/config');

//去用户的Schema 拿到操作user 集合的实例对象
const UserSchema = require('../Schema/user');
const User = db.model('users' ,UserSchema);

// 通过db对象创建操作user数据库的模型对象
const ArticleSchema = require('../Schema/article');
const Article = db.model('articles',ArticleSchema);

// 通过db对象创建操作user数据库的模型对象
const CommentSchema = require('../Schema/comment');
const Comment = db.model('comments',CommentSchema);

//文章发表页
exports.addPage = async ctx =>{
    await ctx.render('add-article',{
        title : '文章发表页',
        session: ctx.session
    })
};

//文章发表 （存数据库）
exports.add = async ctx =>{
    //第一步确认用户的登录状态
    if(ctx.session.isNew){
        //
        return ctx.body = {
            msg: '用户登录',
            status: 0
        }
    }

    //用户登录情况：
    //这是用户在登录情况下 ，post发过来的数据
    const data = ctx.request.body;

    //添加文章作者
    data.author = ctx.session.uid;
    data.commentNum = 0;

    await new Promise((resolve,reject) =>{
        new Article(data).save((err,data)=>{
            if(err) return reject(err);

            //更新用户文章计数
            User.update({ _id : data.author},{$inc:{articleNum : 1}},err =>{
                if(err) return console.log(err)
            });

            resolve(data)
        })
    })
        .then( data => {
            ctx.body = {
                msg : "发表成功",
                status : 1,
            }

        })
        .catch(err => {
            ctx.body = {
                msg : "发表失败",
                status : 0
            }
        })
};


//获取文章列表
exports.getList = async ctx=>{
    // 获取头像  查询每篇文章对应作者头像
    let page = ctx.params.id || 1;
    page--;

    const maxNum = await Article.estimatedDocumentCount((err,data)=>{
        err? console.log(err) : data
    });//拿到库里面最大数量

    const artList = await Article
        .find()
        .sort('-created') // 降序排序
        .skip(3 *page)
        .limit(3)       //拿到5条数据
        .populate({
            path : 'author',
            select : '_id username avatar'
        })   //mongoose 用于连表查询
        .then( data =>  data )
        .catch( err =>{
            console.log(err);
        });

    await ctx.render('index',{
        session : ctx.session,
        title : '博客首页',
        artList,
        maxNum

    })
};


//文章详情
exports.details = async ctx =>{
    //取动态路由里ID
    const _id = ctx.params.id;
    //查询文章数据
    console.log(_id);
    const article = await Article
        .findById(_id)
        .populate('author','username')
        .then( data => data );

    //查找根文章关联的所有评论
    const comment = await Comment

        .find({article : _id})
        .sort('-created')
        .populate('from','username avatar')
        .then( data => data )
        .catch(err=>{ console.log(err) });

    await ctx.render('article',{
        title :  article.title + '文章详情页',
        article,
        comment,
        session : ctx.session,
    })
};

//返回用户所有文章
exports.artlist = async ctx => {
    const uid = ctx.session.uid; //获取用户id

    const data = await Article.find({author : uid });// 找到作者id

    ctx.body = {
        code : 0,
        count : data.length,
        data ,
    }
};

//删除对应ID文章
exports.del = async  ctx => {
    const _id = ctx.params.id;//文章id
    const uid = ctx.session.uid ;//用户id

    //用户 articleNum -= 1
    //文章对应的所有评论
    //被删除评论对应的用户表里面的 commentNum -=1

    let res = {}
    //删除文章本身
    await  Article.deleteOne({_id}).exec((err) => {
        if(err){
            res = {
                state : 1,
                message : '删除失败'
            }
        }else{
            Article.findById(_id,(err,data) => {
                if (err) return console.log(err)
            })
        }
    })

    ctx.body = res
}
