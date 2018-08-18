import "../../normalize";
import Cookies from 'js-cookie';
import {GET} from '../fetch';

//获取url参数
let locationSearch = (name) => {
  return querySearch(name, window.location.search)
}

let querySearch = (name, search) => {
  console.log('-----querySearch------'+search)
  if (!search||search.length < 1) return null;
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
    if (utils.isWeixin5()) {
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx60a9fa60ce58ce4c&redirect_uri=https%3a%2f%2fwww.hayun100.com%2fwechat%2findex.html&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
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
              jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone','hideAllNonBaseMenuItem','showAllNonBaseMenuItem']
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

let handleFrom = (key,value,ev) => {
  let storage = window.localStorage;
    if(value){
      ev.setState({from:value});
      storage.setItem(key,value);
    }else{
      let old = storage.getItem(key);
      old && ev.setState({from:old});
    }
}
let loadJs = (srcs, func) => {
  if (!$.isArray(srcs)) {
    srcs = [srcs];
  }
  var length = srcs.length;
  var oHead = document.getElementsByTagName('HEAD').item(0);
  for (var i = 0; i < length; i++) {
    var oScript = document.createElement("script");
    oScript.type = "text/javascript";
    var item = srcs[i];
    oScript.src = item.src ? item.src : item;
    if (item.func) {
      oScript.onload = function() {
        item.func();
      }
    }
    oHead.appendChild(oScript);
  }
}
let isWeixin5 = () => {
  let sUserAgent = window.navigator.userAgent.toLowerCase();
  if (sUserAgent.indexOf("micromessenger") >= 0) {
    return true;
  }
  return false;
}
let isMobile = () => {
  let sUserAgent = window.navigator.userAgent;
  if (sUserAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|MicroMessenger)/i)){
    return true;
  }
  return false;
}
export default {
  search: locationSearch,
  queryStr: querySearch,
  login: login,
  weConfig:weConfig,
  share:share,
  handleFrom:handleFrom,
  loadJs:loadJs,
  isWeixin5:isWeixin5,
  isMobile:isMobile
}