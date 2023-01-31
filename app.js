const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const router = require("./router_react");
// const router = require("./router");

const app = express();

app.use("/public/", express.static(path.join(__dirname, "./public/")));

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", ["mytoken", "Content-Type"]);
  next();
});

// 配置解析表单 POST 请求体插件（注意：一定要在 app.use(router) 之前 ）
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//配置路由
app.use(router);

app.listen(5000, function () {
  console.log("express running");
});
