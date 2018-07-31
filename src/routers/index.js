import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import store from './store';
import Home from '../components/Home';
import Login from '../components/Login';
import Lecturer from '../components/Lecturer';
import Lesson from '../components/Lesson';
import Category from '../components/Category';
import ShareCard from '../components/ShareCard';
import User from '../components/User';
import UserInfo from '../components/UserInfo';
import BindPhone from '../components/BindPhone';
import Video from '../components/Video';
import {POST} from '../components/fetch/myfetch';
import Cookies from 'js-cookie';

@withRouter
class Routers extends Component {
    constructor(props){
        super(props)
        this.pathname = this.props.location.pathname;
    }
    
    //获取url参数
    GetQueryString = (name)=> {
        let search=window.location.search;
        if(search.length<1) return null;
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"); 
        let r = search.substr(1).match(reg); 
        if (r!=null) return (r[2]); return null; 
    }
    componentDidMount = () => {
        //设置全局微信环境
        if (navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1 || typeof navigator.wxuserAgent !== 'undefined') {
            store.updateInwx(true)
        }
    }
    loginWx = key => {
        console.log("wxLogin------"+key)
        POST('/wechat/oauth2user',{
            code:key
        }).then(res => {
            if(res.code=='000000'){
                res.data.account.vip=res.data.vip
                store.updateName(res.data.account)
                this.props.history.push('/')
                // Cookies.set(res.session.name, res.session.value, { expires: 1, path: '/' });
            }else{
                this.props.history.push('/bind')
            }
        });
    }
    loginSession = key => {
        POST('/wechat/loginSession',{
            loginSession:key
        }).then(res => {
            if(res.code=='000000'){
                res.data.account.vip=res.data.vip
                store.updateName(res.data.account);
            }else{
                Cookies.remove('hl_p_c_s_t','');
                if (store.inwx) {
                    let redirect='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx60a9fa60ce58ce4c&redirect_uri=https%3a%2f%2fwww.hayun100.com%2fwechat%2findex.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
                    this.props.router.push(redirect)
                }else{
                    this.props.history.replace('/login')
                }
            }
        });
    }
    componentWillMount(){
        let code=this.GetQueryString('code');
        if(code){
            this.loginWx({code:code});
        }else{
            let session=Cookies.get('hl_p_c_s_t')
            if (session) {
                if(store.userInfo.sessionId==''){
                    this.loginSession(session);
                }
            }else{
                this.props.history.replace('/login')
            }
        }
    }
    //微信jssdk配置
    initWeConfig = key => {
        // wx.ready(function(){
        //     //分享到朋友圈 即将废弃
        //     wx.onMenuShareTimeline({
        //         title: '', // 分享标题
        //         link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //         imgUrl: '', // 分享图标
        //         success: function () {
        //         // 用户点击了分享后执行的回调函数
        //         }
        //     });
        //     //分享给朋友 即将废弃
        //     wx.onMenuShareAppMessage({
        //         title: '', // 分享标题
        //         desc: '', // 分享描述
        //         link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //         imgUrl: '', // 分享图标
        //         type: '', // 分享类型,music、video或link，不填默认为link
        //         dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        //         success: function () {
        //         // 用户点击了分享后执行的回调函数
        //         }
        //     });
        //     //分享到QQ
        //     wx.onMenuShareQQ({
        //         title: '', // 分享标题
        //         desc: '', // 分享描述
        //         link: '', // 分享链接
        //         imgUrl: '', // 分享图标
        //         success: function () {
        //         // 用户确认分享后执行的回调函数
        //         },
        //         cancel: function () {
        //         // 用户取消分享后执行的回调函数
        //         }
        //     });
        //     //分享到腾讯微博
        //     wx.onMenuShareWeibo({
        //         title: '', // 分享标题
        //         desc: '', // 分享描述
        //         link: '', // 分享链接
        //         imgUrl: '', // 分享图标
        //         success: function () {
        //         // 用户确认分享后执行的回调函数
        //         },
        //         cancel: function () {
        //         // 用户取消分享后执行的回调函数
        //         }
        //     });
        //     //分享到QQ空间
        //     wx.onMenuShareQZone({
        //         title: '', // 分享标题
        //         desc: '', // 分享描述
        //         link: '', // 分享链接
        //         imgUrl: '', // 分享图标
        //         success: function () {
        //         // 用户确认分享后执行的回调函数
        //         },
        //         cancel: function () {
        //         // 用户取消分享后执行的回调函数
        //         }
        //     });
        //     //微信支付
        //     wx.chooseWXPay({
        //         timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        //         nonceStr: '', // 支付签名随机串，不长于 32 位
        //         package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        //         signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        //         paySign: '', // 支付签名
        //         success: function (res) {
        //         // 支付成功后的回调函数
        //         }
        //     });
        // });
        // //timestamp
        // var tamp=Math.round(new Date().getTime()/1000);
        // //随机字符串
        // var randomStr = "";
        // var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        // for( var i=0; i < 10; i++ ){
        //     randomStr += possible.charAt(Math.floor(Math.random() * possible.length));
        // }
        // GET('/wechat/getTicket',{
        //     timestamp:tamp,
        //     nonceStr:randomStr
        // }).then(res => {
        //     wx.config({
        //         debug:true,
        //         appId:"wx60a9fa60ce58ce4c",
        //         timestamp:tamp,
        //         nonceStr:randomStr,
        //         signature:res,
        //         jsApiList:["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone","hideMenuItems","showMenuItems","hideAllNonBaseMenuItem","showAllNonBaseMenuItem","translateVoice","startRecord","stopRecord","onVoiceRecordEnd","playVoice","onVoicePlayEnd","pauseVoice","stopVoice","uploadVoice","downloadVoice","chooseImage","previewImage","uploadImage","downloadImage","getNetworkType","openLocation","getLocation","hideOptionMenu","showOptionMenu","closeWindow","scanQRCode","chooseWXPay","openProductSpecificView","addCard","chooseCard","openCard"]
        //     })
        // });
    }
    render(){
        return (
                <Provider Store={store}>
                    <Switch>
                        <Route path="/video" component={Video}/>
                        <Route path="/bind" component={BindPhone}/>
                        <Route path="/info" component={UserInfo}/>
                        <Route path="/user" component={User}/>
                        <Route path="/share" component={ShareCard}/>
                        <Route path="/category" component={Category}/>
                        <Route path='/lesson' component={Lesson}/>
                        <Route path="/login" component={Login}/>
                        <Route path='/lct' component={Lecturer}/>
                        <Route path='/' component={Home}/>
                    </Switch>
                </Provider>
        )
    }
}

export default Routers