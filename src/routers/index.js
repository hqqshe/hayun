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
import {GET} from '../components/fetch';
import utils from '../components/utils';
import Cookies from 'js-cookie';

@withRouter
class Routers extends Component {
    constructor(props){
        super(props)
    }
    componentWillMount(){
        //设置全局微信环境
        if (navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1 || typeof navigator.wxuserAgent !== 'undefined') {
            store.updateInwx(true);
        }
        //初始openid
        let code=utils.search('code');
        console.log('code--------'+code+'---sessionStorage-----'+window.sessionStorage.openId)
        if(code&&!window.sessionStorage.openId){
            this.loginWx(code);
        }
        //cookie自动登录
        let session = Cookies.get('hl_p_c_s_t');
        console.log("---router---session------"+session)
        if(session){
            this.loginSession(session);
        }
        utils.weConfig(()=>{
            wx.ready(function(){
                wx.hideAllNonBaseMenuItem()
            });
        });
        
    }
    //根据code保存openid 到sessionStorage
    loginWx = key => {
        GET('/wechat/getOpenId',{
            code:key
        }).then(res => {
            if(res.code=='000000'){
                window.sessionStorage.setItem('openId',res.data)
                console.log(key+"---router---getOpenId------"+JSON.stringify(res))
            }
        });
    }
    //cookie自动登录
    loginSession = key => {
        GET('/wechat/loginSession',{
            loginSession:key
        }).then(res => {
            if(res.code=='000000'){
                res.data.account.vip=res.data.vip
                store.updateName(res.data.account);
            }else{
                Cookies.remove('hl_p_c_s_t');
                // if (store.inwx) {
                //     window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx60a9fa60ce58ce4c&redirect_uri=https%3a%2f%2fwww.hayun100.com%2fwechat%2findex.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
                // }else{
                //     this.props.history.replace('/login')
                // }
            }
        });
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