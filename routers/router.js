const Router = require('koa-router');
//拿到user表的控制层
const user = require('../control/user');

const router = new Router;

//设计主页 /
router.get('/', async (ctx)=>{
  await  ctx.render("index",{title : 'node案例'});
});

//处理用户登录注册
router.get(/^\/user\/(?=reg|login)/,async (ctx)=>{
  const show = /reg$/.test(ctx.path);
  await ctx.render('register',{show}) //
});

//处理用户登录post
router.post('/user/login',user.login);

    //注册用户路由
router.post('/user/reg',user.reg);


module.exports = router;