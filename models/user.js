var mongoose = require('mongoose')

// 连接数据库
// mongoose.Promise = global.Promise;
mongoose.Promise = require('bluebird');

try{
  mongoose.connect('mongodb://localhost/make',{ useMongoClient: true })
}catch(err){
  console.log('error');
  

}

var Schema = mongoose.Schema

var userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  pagenum:{
   type:Number,
   required:false
  },
  watch:{
    type: String,
  },
  duty:{
    type: String,
  },
 gender:{
    type: String,
  },
  age:{
    type:Number
  },
 office:{
    type: String,
  },
  time:{
    type: String,
  },
  pagesize:{
    type:Number,
    required:false
   },
  mg_state: {
    type: Boolean,
   
  },
  mobile:{
    type:Number,
    
  },
  
  status: {
    type: Number,
    // 0 没有权限限制
    // 1 不可以评论
    // 2 不可以登录
    enum: [0, 1, 2],
    default: 0
  }
})

module.exports = mongoose.model('User', userSchema)