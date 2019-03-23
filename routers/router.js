const Router = require('koa-router');
//拿到user表的控制层
const user = require('../control/user');
const article = require('../control/article');

const router = new Router;

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

module.exports = router;