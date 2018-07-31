import React, { Component } from 'react';
import MenuSwitch from '../Menu/MenuSwitch';
import {GET,POST} from '../fetch/myfetch'
import Cookies from 'js-cookie';
import { inject, observer } from 'mobx-react';
import '../css/index.less'

@inject('Store')
@observer
class UserInfo extends Component {
    constructor(props){
        super(props)
        this.state={
            search:props.location.search?props.location.search.split('=')[1]:null,
            serielist:[],
            publist:[],
            lct:{},
            switch:true
        }
    }

    handleClick = () => {
        POST('/wechat/loginOut',{
            accountName:this.props.Store.userInfo.accountName
        }).then(res => {
            if(res.code=='000000'){
                this.props.Store.updateName(
                    {
                        name : '',
                        accountName : '',
                        headUrl : '',
                        id : '',
                        role : '',
                        sessionId : '',
                        vip:''
                    }
                );
                Cookies.remove('hl_p_c_s_t');
                this.props.history.replace('/')
            }else{
                console.log('退出失败')
            }
        });
    }

    render() {
        const user=this.props.Store.userInfo;
        return (
            <div className='Layouts_wrap'>
                <div className="info ">
                    <div className="item wrap_pa clearFix">
                        <span className="name">头像</span>
                        <img src={user.headUrl} alt=""/>
                    </div>
                    <div className="item wrap_pa clearFix">
                        <span className="name">昵称</span>
                        <p>{user.name}</p>
                    </div>
                    <div className="item wrap_pa clearFix">
                        <span className="name">简介</span>
                        <p>{user.description}</p>
                    </div>
                    <div className="item wrap_pa clearFix">
                        <span className="name">手机</span>
                        <p>{user.accountName}</p>
                    </div>
                    <div className="loginout" onClick={this.handleClick}>退出登录</div>
                </div>
                <MenuSwitch />
            </div>
        )
    }
}

export default UserInfo