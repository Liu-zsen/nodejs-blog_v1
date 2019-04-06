const Router = require('koa-router');
//拿到user表的控制层
const user = require('../control/user');
const article = require('../control/article');
const comment = require('../control/comment');
const admin = require('../control/admin');
const router = new Router;

const upload = require('../util/upload');

//设计主页 /
router.get('/', user.keepLog , article.getList);

//处理用户登录注册
router.get(/^\/user\/(?=reg|login)/,async (ctx)=>{
  const show = /reg$/.test(ctx.path);
  await ctx.render('register',{show}) //
});

//处理用户登录post
router.post('/user/login',user.login);

    //注册用户路由
router.post('/user/reg',user.reg);

//用户退出
router.get('/user/logout',user.logout);

//用户发表页面
router.get('/article' ,user.keepLog , article.addPage);

//文章添加
router.post('/article',user.keepLog, article.add);

//分页设置
router.get('/page/:id',article.getList);

//文章详情页  路由
router.get('/article/:id',user.keepLog,article.details);

//发表评论
router.post('/comment' , user.keepLog , comment.save);

// 后台管理页面： 文章 评论  头像上传
router.get('/admin/:id' , user.keepLog , admin.index);

// 头像上传
router.post('/upload', user.keepLog , upload.single('file') ,user.upload);

//获取用户所有评论
router.get('/user/comments', user.keepLog , comment.comlist);

//后台：删除用户-评论
router.del('/comment/:id', user.keepLog , comment.del);

//获取用户的所有文章
router.get('/user/articles', user.keepLog, article.artlist);

//后台：删除用户-文章
router.del('/article/:id', user.keepLog , article.del);

//404
router.get('*',async ctx=>{
  await ctx.render('404',{
    title : '404'
  })
})

module.exports = router;