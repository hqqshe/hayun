import "../../normalize";
import Cookies from 'js-cookie';
import {GET} from '../fetch';

//获取url参数
let locationSearch = (name) => {
  return querySearch(name, window.location.search)
}

let querySearch = (name, search) => {
  console.log('-----querySearch------'+search)
  if (search.length < 1) return null;
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = search.substr(1).match(reg);
  if (r != null) return (r[2]);
  return null;
}
let login = (props) => {
  if(Cookies.get('hl_p_c_s_t')){
    return;
  }
  let openId = window.sessionStorage.openId;
  console.log('----openId-----'+openId+"--cookies--"+Cookies.get('hl_p_c_s_t')+"--inwx--"+props.Store.inwx)
  if (openId) {
    GET('/wechat/loginOpenId', {
      'openId': openId
    }).then(res => {
      if (res.code == '000000') {
        res.data.account.vip = res.data.vip
        props.Store.updateName(res.data.account);
      } else if (res.code == '010002') {
        props.history.replace('/bind')
      } else {
        props.history.replace('/login')
      }
    });
  } else {
    if (props.Store.inwx) {
      window.location.href = encodeURI('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx60a9fa60ce58ce4c&redirect_uri=https%3a%2f%2fwww.hayun100.com%2fwechat%2findex.html&response_type=code&scope=snsapi_base&state=1#wechat_redirect');
    } else {
      props.history.replace('/login')
    }
  }
}
//微信jssdk配置
let weConfig = (callback) => {
  GET('/wechat/getSign',{
      url:window.location.href
  }).then(res => {
      if (res.code == '000000') {
          wx.config({
              debug:false,
              appId:res.data.appid,
              timestamp:res.data.timestamp,
              nonceStr:res.data.nonceStr,
              signature:res.data.signature,
              jsApiList:["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone","hideMenuItems","showMenuItems","hideAllNonBaseMenuItem","showAllNonBaseMenuItem","translateVoice","startRecord","stopRecord","onVoiceRecordEnd","playVoice","onVoicePlayEnd","pauseVoice","stopVoice","uploadVoice","downloadVoice","chooseImage","previewImage","uploadImage","downloadImage","getNetworkType","openLocation","getLocation","hideOptionMenu","showOptionMenu","closeWindow","scanQRCode","chooseWXPay","openProductSpecificView","addCard","chooseCard","openCard"]
          })
          console.log('---callback---'+callback)
          callback();
      }
  });
}
let share = (title,link,imgUrl,desc,sucess) => {
  console.log('--wx.ready--share--title-'+title+'--link=='+link+'--imgUrl=='+imgUrl+'--desc=='+desc)
  wx.ready(function(){
    wx.showAllNonBaseMenuItem()
    //分享到朋友圈 即将废弃
    wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: function () {
          sucess// 用户点击了分享后执行的回调函数
        }
    });
    //分享给朋友 即将废弃
    wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          sucess// 用户点击了分享后执行的回调函数
        }
    });
    //分享到QQ
    wx.onMenuShareQQ({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
          sucess// 用户确认分享后执行的回调函数
        },
        cancel: function () {
        // 用户取消分享后执行的回调函数
        }
    });
    //分享到腾讯微博
    wx.onMenuShareWeibo({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
          sucess// 用户确认分享后执行的回调函数
        },
        cancel: function () {
        // 用户取消分享后执行的回调函数
        }
    });
    //分享到QQ空间
    wx.onMenuShareQZone({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
          sucess// 用户确认分享后执行的回调函数
        },
        cancel: function () {
        // 用户取消分享后执行的回调函数
        }
    });
});
}
export default {
  search: locationSearch,
  queryStr: querySearch,
  login: login,
  weConfig:weConfig,
  share:share
}