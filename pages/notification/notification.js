const app = getApp()
// 云数据库实例
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    openID: ''
  },

  toDetail(e){
    // 更新数据库，将评论设为已读
    console.log(e.currentTarget.id)

    const _id = e.currentTarget.id
    db.collection('reply').where({
      _id: _id
    }).get({
      success:res=>{
        console.log(res.data[0].content_id)
        wx.navigateTo({
          url: '/pages/detail/detail?id=' + res.data[0].content_id
        })
      }
    })

    const ins = db.collection('reply').doc(e.currentTarget.id)
    ins.update({
      data: {
        is_read: 1
      }
    })
    ins.get({
      success: res => {
        this.setData({
          info: res.data
        })
        console.log(res)
      }
    })

  },

  getReply(isInt){
    const PAGE = 8
    wx.showLoading({
      title: '加载中',
    })
    db.collection('reply').orderBy('time', 'desc').skip(this.page * PAGE).limit(PAGE).where({
      uid: this.data.openID,
      is_read: 0
    }).get({
      success:res=>{
        console.log('xx', res.data)
        if (isInt) {
          this.setData({
            list: res.data,
          })
        } else {
          // 下拉刷新，不能直接覆盖而是累加
          this.setData({
            list: this.data.list.concat(res.data)
          })
          wx.stopPullDownRefresh()
        }
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.page = 0
    this.getReply(true)
    console.log(wx.getStorageSync('openID'))
    this.setData({
      openID: wx.getStorageSync('openID')
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
    this.onLoad();
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
    this.getReply(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('run')
    this.page += 1
    this.getReply()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})