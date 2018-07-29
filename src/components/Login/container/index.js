import React, { Component } from 'react'
import { Provider, inject, observer } from 'mobx-react'
import store from '../store'
import { message,Form,Icon } from 'antd'
import CryptoJS from 'crypto-js'
import FormBox from '../components/FormBox'
import Cookies from 'js-cookie'
import Wxlogin from '../components/Wxlogin'
import logo from '../../assets/logo.png'
import {GET} from '../../fetch/myfetch';
const FormItem = Form.Item;
import './index.less'

@inject('Store')
@observer
class Login extends Component {
    constructor(props){
        super(props)
        this.store = new store() // 在这里实例化，保证每次加载组件数据的初始化。
        this.state = {
            showWechat:false,
            code:'',
            search:props.location.search,
        }
    }
    updateLoading = (boolean) => {
        this.props.loading = boolean
    }
    updateName = (user) => {
        this.props.user = user
    }
    /**
   * 初始化获取数据
   * @param  {string} key 搜索关键字
   */
    inputLogin = key => {
        GET('/wechat/login',key).then(res => {
            console.log(res.data.vip.expireDate)
            if(res.code=='000000'){
                res.data.account.vip=res.data.vip
                this.updateName(res.data.account)
                this.props.history.push('/')
                // Cookies.set(res.session.name, res.session.value, { expires: 1, path: '/' });
            }
        });
    }
    submit = (form, updateLoading) => {
        form.validateFields((err, values) => {
            if (!err) {
                this.updateLoading(true)
                this.timer = setTimeout(() => {
                    this.updateLoading(false)
                    let { userName, password } = values
                    this.inputLogin({userName,password})

                    // if (userName == 'admin' && password == '123456') {
                    //     let message = `M&${userName}&${password}`
                    //     let key = 'react_starter'
                    //     let session = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(message, key))
                    //     Cookies.set('JSESSIONID', session, { expires: 1, path: '/' });
                    //     Cookies.set('userName', userName, { expires: 1, path: '/' });
                    //     this.updateName(userName)
                    //     this.props.history.push('/home')
                    // } else {
                    //     message.error('账号：admin ； 密码：123456')
                    // }
                }, 100)
            }
        });
    }
    componentDidMount = () => {
        if(this.state.search!=null&&this.state.search!=''){
            var parm=this.state.search.split('?')[1].split('=')[1];
            this.setState({
                code:parm
            },()=>{
                console.log(parm)
                this.loginWx(parm);
            })
        }
    }
    componentWillUnmount() {
        clearTimeout(this.timer);
    }
    handleShowWechat(){
        if (navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1 || typeof navigator.wxuserAgent !== 'undefined') {
            var wxUrl='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7e40bbc315ec325d&redirect_uri=https://www.hayun100.com/wechat/index.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
            this.props.router.push(wxUrl)
        }
        this.setState({showWechat:!this.state.showWechat});
    }
    loginWx = key => {
        console.log("wxLogin------"+key)
        GET('/wechat/oauth2user',{
            code:key
        }).then(res => {
            console.log(res)
            // this.updateName(userName)
            // this.props.history.push('/home')
        });
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
                            <Wxlogin/>
                        </div>
                    </div>
                </div>
                </Provider>
        )
    }
}

export default Login