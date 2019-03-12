const Router = require('koa-router');
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

module.exports = router;