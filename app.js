const Koa = require('koa');
const static = require('koa-static');
const views = require('koa-views');
const logger = require('koa-logger');
const { join } = require('path');
const router = require('./routers/router');

//生成koa实例
const app = new Koa();

//用logger模块监听 请求的信息  ，所以是第一个注册的中间件
app.use(logger());

//将静态文件目录设置为：项目根目录+/public
app.use(static(join(__dirname, "public")));

// 配置视图模板
app.use(views(join(__dirname, "views"), {
    extension: "pug"
}));


//注册路由信息
app.use(router.routes()).use(router.allowedMethods())

app.listen(3001, () => {
    console.log("项目启动成功，监听在3001端口")
})
