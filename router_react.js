// const { json } = require('body-parser')
var express = require("express");

// 数据库中的集合User导入
var User = require("./models/user.js");

var Patient = require("./models/patient.js");

// 加密模块
var md5 = require("blueimp-md5");
const { off } = require("./models/user.js");

var router = express.Router();

router.post("/login", function (req, res) {
  var body = req.body;
  // console.log(body);

  User.findOne(
    {
      username: body.username,
      password: md5(md5(body.password)),
    },
    function (err, user) {
      if (err) {
        return res.status(500).json({
          code: 200,
          message: err.message,
          data: {},
        });
      }
      // 如果邮箱和密码匹配， 则user 是查询到的用户对象，否则就是null
      if (!user) {
        return res.status(200).json({
          status: 400,
          err_code: 1,
          message: "Email or password is invalid",
        });
      }

      // 用户存在，登陆成功，通过session来保存登录状态
      // req.session.user = user;

      res.status(200).json({
        code: 200,
        message: "ok",
        data: { token: "34234232af332ew23rf333r3rf3rf", roles: ["userManage","activityManage"] },
      });
    }
  );
});
router.post("/register", function (req, res) {
  var body = req.body;
  // console.log(body);

  User.findOne(
    {
      $or: [{ email: body.email }, { username: body.username }],
    },
    function (err, data) {
      if (err) {
        return res.status(200).json({
          message: "Server Error",
        });
      }
      if (data) {
        return res.status(200).json({
          err_code: 1,
          status: 200,
          meta: {
            status: 200,
          },
          message: "Email or nickname is already exists",
        });
      }

      //   创建一个新用户 ,密码加密
      body.password = md5(md5(body.password));
      // console.log(body);

      new User(body).save(function (err, user) {
        if (err) {
          return res.status(500).json({
            err_code: 500,
            status: 500,
            message: "服务器错误",
            err: err,
          });
        }
        //  注册成功后利用session 来记录登陆状态
        // req.session.isLogin = true;
        // req.session.user = user;

        //  返回成功的回调函数
        res.status(200).json({
          err_code: 0,
          status: 200,
          message: "注册成功",
        });
      });

      console.log("ok");
    }
  );
});
//  用户数据获取
router.get("/users", async function (req, res) {
  // console.log(req.query);
  /* 根据页码显示该页的所有用户 */
  var { pagenum, pagesize, query } = req.query;
  // console.log(pagenum);
  // console.log(pagesize);
  var total = 0;

  User.find({}).exec(function (err, data) {
    total = data.length;
  });

  User.find({ pagenum: Number(pagenum) })
    .limit(Number(pagesize))
    .exec(async function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send("Server Error");
      }

      res.status(200).json({
        status: 200,
        users: data,
        total,
      });
    });
});

//搜索框查找用户
router.get("/users/search", function (req, res) {
  var query = req.query;
  // console.log(query.info);
  User.find({ username: query.info }, function (err, data) {
    if (err) {
      //  console.log(err);
      return res.status(500).send("Server Error");
    }
    res.status(200).json({
      status: 200,
      users: data,
    });
  });
});
//  switch 状态保存
router.put("/users/:uId/state/:type", function (req, res) {
  const { uId, type } = req.params;
  // console.log(type);
  // console.log(uId);
  User.findById(uId, function (err, data) {
    // console.log(typeof Boolean(type));
    User.updateOne(
      { _id: uId },
      { mg_state: type.replace(/"/g, "") },
      function (err, data) {
        // console.log(err);
        // console.log(data);
        // console.log();
      }
    );

    res.status(200).json({
      status: 200,
    });
  });
});

router.post("/users", function (req, res) {
  // console.log(req.body);
  const body = req.body;
  body.pagenum = 1;
  // body.mobile = Number(body.mobile)
  console.log(body);
  //   创建一个新用户 ,密码加密
  body.password = md5(md5(body.password));

  new User(body).save(function (err, user) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        status: 500,
        message: "服务器错误",
        err: err,
      });
    }
    console.log(user);

    //  返回成功的回调函数
    res.status(200).json({
      status: 201,
    });
  });
});

router.get("/users/:id", function (req, res) {
  const id = req.params.id;
  User.findById(id, function (err, date) {
    // console.log(date);

    res.status(200).json({
      status: 200,
      data: {
        date,
      },
    });
  });
});

router.post("/users/new", function (req, res) {
  const { _id, email, mobile, gender, age, duty, time, office, watch } =
    req.body.data;
  //  console.log(req.body);
  // console.log(_id);
  // console.log(time);

  User.updateOne(
    { _id: _id },
    {
      email: email,
      mobile: Number(mobile),
      gender: gender,
      age: age,
      duty: duty,
      time: time,
      office: office,
      watch: watch,
    },
    function (err, data) {
      //  console.log(err);
      console.log(data);
    }
  );
  res.status(200).json({
    status: 200,
  });
});

router.delete("/users/:id", function (req, res) {
  const id = req.params.id;
  console.log(id);
  User.findByIdAndRemove(id, function (err) {
    if (err) {
      return res.status(500).send("Server Error ");
    }
    res.status(200).json({
      status: 200,
    });
  });
});

//  患者路由处理
router.get("/patients", async function (req, res) {
  // console.log(req.query);
  /* 根据页码显示该页的所有用户 */
  var { pagenum, pagesize, query } = req.query;
  // console.log(pagenum);
  // console.log(pagesize);
  var total = 0;

  Patient.find({}).exec(function (err, data) {
    total = data.length;
  });

  Patient.find({ pagenum: Number(pagenum) })
    .limit(Number(pagesize))
    .exec(async function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send("Server Error");
      }

      res.status(200).json({
        status: 200,
        users: data,
        total,
      });
    });
});
//  搜索框功能
router.get("/patient/search", function (req, res) {
  var query = req.query;
  // console.log(query.info);
  User.find({ username: query.info }, function (err, data) {
    if (err) {
      //  console.log(err);
      return res.status(500).send("Server Error");
    }
    res.status(200).json({
      status: 200,
      users: data,
    });
  });
});
//  switch 状态保存
router.put("/patients/:uId/state/:type", function (req, res) {
  const { uId, type } = req.params;
  // console.log(type);
  // console.log(uId);
  Patient.findById(uId, function (err, data) {
    // console.log(typeof Boolean(type));
    Patient.updateOne(
      { _id: uId },
      { mg_state: type.replace(/"/g, "") },
      function (err, data) {
        // console.log(err);
        // console.log(data);
        // console.log();
      }
    );

    res.status(200).json({
      status: 200,
    });
  });
});

router.post("/patients", function (req, res) {
  // console.log(req.body);
  const body = req.body;
  body.pagenum = 1;
  // body.mobile = Number(body.mobile)
  // console.log(body);
  //   创建一个新用户 ,密码加密
  body.password = md5(md5(body.password));

  new Patient(body).save(function (err, user) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        status: 500,
        message: "服务器错误",
        err: err,
      });
    }
    // console.log(user);

    //  返回成功的回调函数
    res.status(200).json({
      status: 201,
    });
  });
});

router.get("/patients/:id", function (req, res) {
  const id = req.params.id;
  Patient.findById(id, function (err, date) {
    res.status(200).json({
      status: 200,
      data: {
        date,
      },
    });
  });
});

router.post("/patients/new", function (req, res) {
  const {
    _id,
    email,
    mobile,
    username,
    checkOffice,
    checkDoctor,
    checkType,
    orgin,
    room,
    ago,
    PPE,
    DFA,
    RPDE,
  } = req.body.data;
  console.log(req.body);
  console.log(_id);

  Patient.updateOne(
    { _id: _id },
    {
      email: email,
      mobile: Number(mobile),
      username: username,
      checkOffice,
      checkDoctor,
      checkType,
      orgin,
      room,
      ago,
      PPE,
      DFA,
      RPDE,
    },
    function (err, data) {
      console.log(err);
      console.log(data);
    }
  );
  res.status(200).json({
    status: 200,
  });
});

router.delete("/patients/:id", function (req, res) {
  const id = req.params.id;
  console.log(id);
  Patient.findByIdAndRemove(id, function (err) {
    if (err) {
      return res.status(500).send("Server Error ");
    }
    res.status(200).json({
      status: 200,
    });
  });
});
// 导出路由容器
module.exports = router;
