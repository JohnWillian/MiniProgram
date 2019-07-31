const cloud = require('wx-server-sdk')
// 初始化
cloud.init()
// 加分
exports.main = (event)=>{
  const wxInfo = cloud.getWXContext()
  return{
    sum:event.a + event.b,
    wxInfo
  }
  
}
