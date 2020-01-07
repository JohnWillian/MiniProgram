
const db = wx.cloud.database()
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
   id:'',
   info:{},
   _comment:'',
   commentArr:[],
   color: 'color: #FFB90F',
   userInfo: '',
   pictures:'',
   inputValue: null,
   _options:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  previewImage(){
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [this.data.info.image] // 需要预览的图片http链接列表
    })
  },
  getComment(e){
    console.log(e.detail.value)
    this.setData({
      _comment: e.detail.value
    })
    
  },
  reply(e){
    if (!this.data._comment) {
      wx.showToast({
        title: '评论内容不能为空！',
      })
    } else {
      var comment_transfer = this.data._comment.toString(); //int转string
      console.log(e);
      var id = this.data.id;
      var time = util.formatTime(new Date());
      if (this.data.userInfo.nickName == 'NASA'){
      db.collection('reply').add({
        data:{
          comment: comment_transfer,
          content_id: id,
          userName: this.data.userInfo.nickName,
          image: this.data.userInfo.avatarUrl,
          color: 'color: #FFB90F',
          time: time,
          content_image: this.data.info.image,
          uid: this.data.info._openid,
          is_read: 0
        },
        success:res=>{
          console.log(res)
          this.setData({
            
          })
          wx.showToast({
            title: '评论成功'
          })
          // 清空input
          this.setData({
            inputValue: ''
          })
           
        }
      })
        var that = this
        that.onLoad(that.data._options)
      }else{
        db.collection('reply').add({
          data: {
            comment: comment_transfer,
            content_id: id,
            userName: this.data.userInfo.nickName,
            image: this.data.userInfo.avatarUrl,
            color: '',
            time: time,
            content_image: this.data.info.image,
            uid: this.data.info._openid,
            is_read: 0
          },
          success: res => {
            console.log(res)
            this.setData({

            })
            wx.showToast({
              title: '评论成功'
            })
            // 清空input
            this.setData({
              inputValue: ''
            })

          }
        })
        var that = this
        that.onLoad(that.data._options)
      }
    
    }
  },
  //微信支付
  // order(){
  //   wx.cloud.callFunction({
  //     name:'emall-pay',
  //     data:{
  //       type: 'unifiedorder',
  //       data:{
  //         goodId: this.data.id
  //       }
  //     },
  //     success:res=>{
  //       const data = result.data

  //       // 再次签名
  //       wx.cloud.callFunction({
  //         name: 'emall-pay',
  //         data: {
  //           type: 'orderquery',
  //           data: {
  //             out_trade_no: result.result.data.out_trade_no
  //           }
  //         },
  //         success:queryRet=>{
  //           const{
  //             time_stamp,
  //             nonce_str,
  //             sign,
  //             prepay_id,
  //             body,
  //             total_fee
  //           }=queryRet.result.data

  //           // 拉起微信支付
  //           wx.requestPayment({
  //             timeStamp: 'time_stamp',
  //             nonceStr: 'nonce_str',
  //             package: 'prepay_id=${prepay_id}',
  //             signType: 'MD5',
  //             paySign: 'sign',
  //             success(){
  //               wx.hideLoading()
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  // },

  onLoad: function (options) {
    
   this.setData({
     _options: options,
     id: options.id,
     userInfo: wx.getStorageSync('userInfo')
   })

    //浏览次数累加
    const ins = db.collection('blackboard').doc(options.id)
    ins.update({
      data:{
        view: db.command.inc(1)
      }
    })
    ins.get({
      success:res=>{
       this.setData({
         info:res.data
        })
        console.log(res)
      }
    })

    this.page = 0
    const PAGE = 8
    db.collection('reply').orderBy('time', 'desc').where({
      content_id: this.data.id
    }).get({
      success:res=>{
        console.log(res.data)
        this.setData({
          commentArr: res.data
        })
      }
    })

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})