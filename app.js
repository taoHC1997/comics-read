"use strict";

// config setting
const path = process.cwd();
const port = 3000;

const Koa = require("koa");
const Router = require("@koa/router");
const serve = require("koa-static");
const mount = require("koa-mount");
const ComicFileData = require("./src/utils/comicFileData");
const exec = require("child_process").exec;
const ejs = require("ejs");

const myComicFileData = new ComicFileData(path);

const app = new Koa();
const router = new Router({
  prefix: "/read",
});

app.use(mount("/" + myComicFileData.md5, serve(path)));

router.all("/", async (ctx) => {
  ctx.body = await ejs.renderFile("./src/views/index.ejs", myComicFileData);
});

app.use(router.routes());

app.listen(port, () => {
  const url = `http://localhost:${port}/read`;
  // 这里仅针对 win 平台
  exec("start " + url);
});

// console.log(myComicFileData);
