import React, { Component } from 'react';
import MenuSwitch from '../Menu/MenuSwitch';
import {GET,POST} from '../fetch';
import utils from '../utils';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import '../css/index.less'

@inject('Store')
@observer
class User extends Component {
    constructor(props){
        super(props)
        this.state={
        }
    }
    componentWillMount = () => {
        //todo 检查登录
        if(this.props.Store.userInfo.sessionId == ''){
            utils.login(this.props);
        }
    }
    handClick =(value) =>{
        this.setState({switch:value})
    }
    render() {
        console.log('this.props.Store.userInfo.sessionId-------'+this.props.Store.userInfo.sessionId)
        const user=this.props.Store.userInfo;
        return (
            <div className='Layouts_wrap'>
                <div className="user">
                    <Link className="top link clearFix" to={{pathname: '/info'}}>
                        <img src={user.headUrl} alt=""/>
                        <span className="name">{user.name}</span>
                        <i className="more_icon"></i>
                    </Link>
                    <div className="middle wrap_padding ">
                        <div className="item wrap_pa clearFix">
                            <span className="icon"></span>
                            <span className="name">我关注的</span>
                            <i className="more_icon"></i>
                        </div>
                        <div className="item wrap_pa clearFix">
                            <span className="icon live"></span>
                            <span className="name">我的直播</span>
                            <i className="more_icon"></i>
                        </div>
                        <div className="item wrap_pa clearFix">
                            <span className="icon video"></span>
                            <span className="name">我的视频</span>
                            <i className="more_icon"></i>
                        </div>
                        <div className="item wrap_pa clearFix">
                            <span className="icon class"></span>
                            <span className="name">我的班级</span>
                            <i className="more_icon"></i>
                        </div>
                    </div>
                    <div className="middle wrap_padding ">
                        <div className="item wrap_pa clearFix">
                            <span className="icon wallet"></span>
                            <span className="name">我的钱包</span>
                            <i className="more_icon"></i>
                        </div>
                        <div className="item wrap_pa clearFix">
                            <span className="icon revenue"></span>
                            <span className="name">收入明细</span>
                            <i className="more_icon"></i>
                        </div>
                    </div>
                </div>
                <MenuSwitch />
            </div>
        )
    }
}

export default User