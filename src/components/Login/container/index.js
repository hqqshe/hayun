import React, { Component } from 'react';
import { Provider, inject, observer } from 'mobx-react';
import store from '../store';
import { Form } from 'antd';
import FormBox from '../components/FormBox';
import Wxlogin from '../components/Wxlogin';
import logo from '../../assets/logo.png';
import {GET,POST} from '../../fetch';
import './index.less';

const FormItem = Form.Item;

@inject('Store')
@observer
class Login extends Component {
    constructor(props){
        super(props)
        this.store = new store() // 在这里实例化，保证每次加载组件数据的初始化。
        this.state = {
            showWechat:false,
        }
    }
    updateLoading = (boolean) => {
        this.props.loading = boolean
    }
    
    /**
     * 手动登录
     */
    inputLogin = (key,form) => {
        GET('/wechat/login',key).then(res => {
            if(res.code=='000000'){
                res.data.account.vip=res.data.vip
                this.props.Store.updateName(res.data.account)
                console.log('history----'+this.props.history)
                this.props.history.goBack();
                //this.props.history.push('/')
                // Cookies.set(res.session.name, res.session.value, { expires: 1, path: '/' });
            }else{
                form.setFields({
                    password: {
                      value: '',
                      errors: [new Error('账号或密码错误')],
                    },
                });
            }
            this.updateLoading(false);
        });
    }
    submit = (form, updateLoading) => {
        form.validateFields((err, values) => {
            if (!err) {
                this.updateLoading(true)
                this.inputLogin(values,form)
            }
        });
    }
 
    handleShowWechat(){
        if (this.props.Store.inwx) {
            window.location.href =encodeURI('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx60a9fa60ce58ce4c&redirect_uri=https%3a%2f%2fwww.hayun100.com%2fwechat%2findex.html&response_type=code&scope=snsapi_base&state=1#wechat_redirect');
        }else{
            this.setState({showWechat:!this.state.showWechat});
        }
    }
    
    render() {
        return (
            <Provider store={this.store}>
            <div className='Login_wrap P_auto'>
                <div className='logo_wrap '>
                    <div className="info clearfix">
                        <img src={logo} alt='哈云课堂'/>
                        <p className="name">哈云课堂</p>
                        <p className="url">www.hayun100.com</p>
                        <p className="des">哈云成就更好的你</p>
                    </div>
                </div>
                <div className='form ' style={{display:this.state.showWechat?"none":"block"}}>
                    <FormBox submit={this.submit} handleShowWechat={this.handleShowWechat.bind(this)}/>
                </div>
                <div id='wx_wrap' className='wx_wrap' style={{display:this.state.showWechat?"block":"none"}}>
                    <div className="cover"></div>
                    <div className='frame'>
                    {!this.props.Store.inwx?<Wxlogin/>:''}
                    </div>
                </div>
            </div>
            </Provider>
        )
    }
}

export default Login