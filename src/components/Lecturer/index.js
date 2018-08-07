import React, { Component } from 'react';
import Carousel from './components/Carousel';
import Follow from '../Follow';
import Tab from './components/Tab';
import ItemClass from '../Items/ItemClass';
import Footer from '../Footer/Footer';
import MenuSwitch from '../Menu/MenuSwitch';
import {GET,POST} from '../fetch';
import utils from '../utils';
import { observer, inject } from 'mobx-react'
import '../css/index.less'

@inject('Store')
@observer
class Lecturer extends Component {
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

    /**
     * 初始化获取数据
     * @param  {string} key 搜索关键字
     */
    getData = key => {
        GET('/api/rooms',{
            s:4,
            p:1,
            lctId:key            
        }).then(res => {
            if(res.code == '000000'){
                this.setState({serielist:res.data.data});
            }
        });
        GET('/api/rooms',{
            s:4,
            p:1,
            lctId:key,
            type:1
        }).then(res => {
            if(res.code == '000000'){
                this.setState({publist:res.data.data});
            }
        });
        GET('/api/getLct',{
            lctId:key
        }).then(res => {
            if(res.code == '000000'){
                this.setState({lct:res.data.lct});
            }
        });
    }

    componentDidMount = () => {
        this.getData(this.state.search);
    }
    componentWillReceiveProps = (nextProps) => {
        if(this.props.skey===nextProps.skey) return;
        this.getData(nextProps.skey)
    }
    handFollow =() =>{
        //todo 检查登录
        if(this.props.Store.userInfo.sessionId == ''){
            utils.login(this.props);
        }else{
            GET('/customer/follow',{
                target:this.state.lct.id,
                relType:1,
            }).then(res => {
                if(res == true){
                    let data = Object.assign({}, this.state.lct, { relType: 1 })
                    this.setState({
                        lct:data
                    })
                }
            });
        }
    }
    handClick =(value) =>{
        this.setState({switch:value})
    }
    render() {
        const reg = /<[^>]*>|<\/[^>]*>|&nbsp;/gm;
        let des = this.state.lct.lctDes?this.state.lct.lctDes.replace(reg,''):'没有简介';
        return (
            <div className='Layouts_wrap clearFix'>
                <Carousel series={this.state.serielist} />
                <Follow lct={this.state.lct} handFollow={this.handFollow}/>
                <Tab handClick={this.handClick}/>
                <div className="teach_info">
                    <div style={{display:this.state.switch?'block':'none'}}>
                    {this.state.serielist.length>0
                        ?<div>
                        <p className="type">系列课</p>
                        <div className="series clearfix">
                        {
                            this.state.serielist.map((k) => {
                                return ( 
                                <ItemClass lct='true' item={k}/>
                                )
                            })
                        }
                        </div></div>
                        :''
                    }
                    {this.state.publist.length>0
                        ?<div><p className="type">公开课</p>
                        <div className="class clearfix">
                        {
                            this.state.publist.map((k) => {
                                return ( 
                                <ItemClass lct='true' pub='true' item={k}/>
                                )
                            })
                        }
                        </div></div>
                        :''
                    }
                    </div>
                    <div style={{display:this.state.switch?'none':'block'}}>
                    <p className="type">简介</p>
                    <div className="des">
                        {des}
                    </div>
                    </div>
                </div>
                <Footer />
                <MenuSwitch />
            </div>
        )
    }
}

export default Lecturer