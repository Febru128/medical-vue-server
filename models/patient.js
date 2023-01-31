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

var patientSchema = new Schema({
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
  checkOffice:{
    type: String,
  },
  room:{
    type: Number,
  },
  checkDoctor:{
    type: String,
  },
  checkType:{
    type: String,
  },
  orgin:{
    type: String,
  },
  pagenum:{
   type:Number,
   required:false
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
  room:{
    type:Number,
    
  },
  ago:{
  type:String
  },
  PPE:{
    type:Number,
    
  },
  DFA:{
    type:Number,
    
  },
  RPDE:{
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

module.exports = mongoose.model('Patient', patientSchema)