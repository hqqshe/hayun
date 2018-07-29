import React, { Component } from 'react';
import MenuSwitch from '../Menu/MenuSwitch';
import {GET,POST} from '../fetch/myfetch'
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import '../css/index.less'

@inject('Store')
@observer
class User extends Component {
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


    componentDidMount = () => {
    }
    componentWillReceiveProps = (nextProps) => {
    }
    handFollow =() =>{
        //todo 检查登录
        POST('/customer/follow',{
            target:this.state.lct.id,
            relType:1,          
        }).then(res => {
            if(res == true){
                let data = Object.assign({}, this.state.lct, { relType: 1 })
                this.setState.lct({
                    lct:data
                })
                // GET('/api/getLct',{
                //     lctId:key
                // }).then(res => {
                //     if(res.code == '000000'){
                //         this.setState({lct:res.data.lct});
                //     }
                // });
            }
        });
    }
    handClick =(value) =>{
        this.setState({switch:value})
    }
    render() {
        const user=this.props.Store.userInfo;
        const reg = /<[^>]*>|<\/[^>]*>|&nbsp;/gm;
        let des = this.state.lct.lctDes?this.state.lct.lctDes.replace(reg,''):'没有简介';
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