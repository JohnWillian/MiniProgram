const db = wx.cloud.database()
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cameraImg:'cloud://takeout-8c2254.7461-takeout-8c2254/camera_icon.png',
    cameraVideo:'',
    userImg:'',
    _content:'',
    _tags:'',

    tag1: '表白' , 
    tag2: '寻人' , 
    tag3: '寻物' ,

    tag_style1: 'tag',
    tag_style2: 'tag',
    tag_style3: 'tag',

    userInfo:'',
    upload_bind:'publishInfo_noimg',

    anonymous:''
  },

  switchChange: function (e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      anonymous: e.detail.value
    })
  },

  getContent(e){
    console.log(e.detail.value)
    this.setData({
      _content: e.detail.value
    })
    
  },

  // 获得tag标签
  getTags1(){
    this.setData({
      _tags: this.data.tag1,
      tag_style1: 'tag_active',
      tag_style2: 'tag',
      tag_style3: 'tag'
    })
    success:res=>{
      console.log(res)
    }
  },
  getTags2() {
    this.setData({
      _tags: this.data.tag2,
      tag_style1: 'tag',
      tag_style2: 'tag_active',
      tag_style3: 'tag'
    })
    success: res => {
      console.log(res)
    }
  },
  getTags3() {
    this.setData({
      _tags: this.data.tag3,
      tag_style1: 'tag',
      tag_style2: 'tag',
      tag_style3: 'tag_active'
    })
    success: res => {
      console.log(res)
    }
  },


  // 上传视频图片
  uploadFile(){
    wx.showModal({
      title: '提示',
      content: '上传视频还是图片',
      cancelText:'视频',
      cancelColor: '#000000',
      confirmText: '图片',
      confirmColor: '#000000',
      success: res=> {
        if (res.confirm) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
              const tempFilePaths = res.tempFilePaths[0]
              console.log(res.tempFilePaths)
              this.setData({
                cameraImg: res.tempFilePaths,
                upload_bind: 'publishInfo'
              })
            }
          })
        } else if (res.cancel) {
          wx.chooseVideo({
            count: 1,
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: res => {
              const tempFilePaths = res.tempFilePaths
              console.log(res.tempFilePaths)
              this.setData({
                cameraVideo: res.tempFilePaths,
                upload_bind: 'publishInfo'
              })
            }
          })
        }
      }
    })

  },
  // 上传图片
  uploadImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res=>{
        const tempFilePaths = res.tempFilePaths[0]
        console.log(res.tempFilePaths)
        this.setData({
          cameraImg: res.tempFilePaths,
          upload_bind: 'publishInfo'
        })
      }
      // success: function (res) {
      //   const filePath = res.tempFilePaths[0]
      //   const tempFile = filePath.split('.')
      //   const cloudPath = 'my-img-' + tempFile[tempFile.length - 2]
      //   wx.cloud.uploadFile({
      //     filePath,
      //     cloudPath,
      //     success: res => {
      //       that.setData({
      //         userImg: res.fileID
      //       })
      //       console.log(res.fileID)
      //       wx.showToast({
      //         title: '上传成功'
      //       })
      //     }
      //   })
      // }
    })
  },

  // 上传视频
  uploadVideo(){
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: res => {
        const tempFilePaths = res.tempFilePaths[0]
        console.log(res.tempFilePaths)
        this.setData({
          cameraImg: res.tempFilePaths,
          upload_bind: 'publishInfo'
        })
      }
    })
  },
  publishInfo_noimg(){
    var time = util.formatTime(new Date());
    if (this.data._content == ''){
      wx.showToast({
        title: '内容不能为空',
      })
    }else if (!this.data.anonymous){
      // 如果不为匿名
      db.collection('blackboard').add({
        data: {
          content: this.data._content,
          tag: this.data._tags,
          // image: this.data.userImg,
          time: time,
          view: 0,
          like: 0,
          userName: this.data.userInfo.nickName,
          imageHead: this.data.userInfo.avatarUrl,
          gender: this.data.userInfo.gender,
          like_bar_style: 'likeBar'
        },
        success: res => {
          console.log(res)
          wx.showToast({
            title: '发布成功',
          })
          wx.hideLoading()
          wx.navigateBack({
            delta: 1
          })
        },
        fail: res => {
          console.log(res)
        }
      })
    } else if (this.data.userInfo.gender == 1){
      // 匿名且性别为男
      db.collection('blackboard').add({
        data: {
          content: this.data._content,
          tag: this.data._tags,
          // image: this.data.userImg,
          time: time,
          view: 0,
          like: 0,
          userName: '匿名',
          imageHead: 'cloud://takeout-8c2254.7461-takeout-8c2254/anonymous/boy.png',
          gender: this.data.userInfo.gender,
          like_bar_style: 'likeBar'
        },
        success: res => {
          console.log(res)
          wx.showToast({
            title: '发布成功',
          })
          wx.hideLoading()
          wx.navigateBack({
            delta: 1
          })
        },
        fail: res => {
          console.log(res)
        }
      })
    }else{
      // 匿名且性别为女
      db.collection('blackboard').add({
        data: {
          content: this.data._content,
          tag: this.data._tags,
          // image: this.data.userImg,
          time: time,
          view: 0,
          like: 0,
          userName: '匿名',
          imageHead: 'cloud://takeout-8c2254.7461-takeout-8c2254/anonymous/girl.png',
          gender: this.data.userInfo.gender,
          like_bar_style: 'likeBar'
        },
        success: res => {
          console.log(res)
          wx.showToast({
            title: '发布成功',
          })
          wx.hideLoading()
          wx.navigateBack({
            delta: 1
          })
        },
        fail: res => {
          console.log(res)
        }
      })
    }
  },
  publishInfo(){
    wx.showLoading({
      title: '上传中',
    })
    let that = this
    var time = util.formatTime(new Date());
    let filePath = this.data.cameraImg[0]
    let suffix = /\.[^\.]+$/.exec(filePath);
    wx.cloud.uploadFile({
      cloudPath: new Date().getTime() + suffix,
      filePath: filePath, // 文件路径
      success: res => {
            this.setData({
              userImg: res.fileID
            })
            console.log(res.fileID)
            wx.showToast({
              title: '上传成功'
            })
        if (this.data._content == '') {
          wx.showToast({
            title: '内容不能为空',
          })
        } else if(!this.data.anonymous){
        db.collection('blackboard').add({
          data: {
            content: this.data._content,
            tag: this.data._tags,
            image: this.data.userImg,
            time: time,
            view: 0,
            like: 0,
            userName: this.data.userInfo.nickName,
            imageHead: this.data.userInfo.avatarUrl,
            gender: this.data.userInfo.gender,
            like_bar_style: 'likeBar'
          },
          success: res => {
            console.log(res)
            wx.showToast({
              title: '发布成功',
            })
            wx.hideLoading()
            wx.navigateBack({
              delta: 1
            })
          },
          fail: res => {
            console.log(res)
          }
        })
      } else if (this.data.userInfo.gender == 1){
        // 匿名且性别为男
        db.collection('blackboard').add({
          data: {
            content: this.data._content,
            tag: this.data._tags,
            image: this.data.userImg,
            time: time,
            view: 0,
            like: 0,
            userName: '匿名',
            imageHead: 'cloud://takeout-8c2254.7461-takeout-8c2254/anonymous/boy.png',
            gender: this.data.userInfo.gender,
            like_bar_style: 'likeBar'
          },
          success: res => {
            console.log(res)
            wx.showToast({
              title: '发布成功',
            })
            wx.hideLoading()
            wx.navigateBack({
              delta: 1
            })
          },
          fail: res => {
            console.log(res)
          }
        })
      }else{
        // 匿名且性别为女
        db.collection('blackboard').add({
          data: {
            content: this.data._content,
            tag: this.data._tags,
            image: this.data.userImg,
            time: time,
            view: 0,
            like: 0,
            userName: '匿名',
            imageHead: 'cloud://takeout-8c2254.7461-takeout-8c2254/anonymous/girl.png',
            gender: this.data.userInfo.gender,
            like_bar_style: 'likeBar'
          },
          success: res => {
            console.log(res)
            wx.showToast({
              title: '发布成功',
            })
            wx.hideLoading()
            wx.navigateBack({
              delta: 1
            })
          },
          fail: res => {
            console.log(res)
          }
        })
      }
          },
      fail: res => {
        // handle error
        console.log(res)
      }
    })

  
        
  },
  
    
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getUserInfo({
      success: res => {
        console.log(res)
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
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