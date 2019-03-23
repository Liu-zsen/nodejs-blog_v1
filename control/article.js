const { db } = require('../Schema/config');
const ArticleSchema = require('../Schema/article');

//去用户的Schema 拿到操作user 集合的实例对象
const UserSchema = require('../Schema/user');
const User = db.model('users' ,UserSchema);

// 通过db对象创建操作user数据库的模型对象
const Article = db.model('articles',ArticleSchema);

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

    await new Promise((resolve,reject) =>{
        new Article(data).save((err,data)=>{
            if(err) return reject(err)
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