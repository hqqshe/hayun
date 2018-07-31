import React, { Component } from 'react';
import Follow from '../Follow';
import SeriesBuy from './components/SeriesBuy'
import { Link } from 'react-router-dom';
import Tab from './components/Tab';
import ItemLesson from '../Items/ItemLesson';
import Footer from '../Footer/Footer';
import MenuSwitch from '../Menu/MenuSwitch';
import {GET,POST} from '../fetch/myfetch';
import { observer, inject } from 'mobx-react'
import '../css/index.less'

@inject('Store')
@observer
class Lesson extends Component {
    constructor(props){
        super(props)
        this.state={
            search:props.location.search,
            lct:{},
            room:{},
            list:[],
            boughts:[],
            switch:true
        }
    }
   
    getLct = key => {
        GET('/api/getLct',{
            lctId:key
        }).then(res => {
            if(res.code == '000000'){
                this.setState({lct:res.data.lct});
            }
        });
    }

    getRoom = key => {
        GET('/api/getRoom',{
            cid:key            
        }).then(res => {
            if(res.code == '000000'){
                this.setState({room:res.data.room});
            }
        });
    }
    getLesson = key => {
        GET('/api/getLesson',{
            cid:key
        }).then(res => {
            if(res.code == '000000'){
                this.setState({
                    list:res.data.Lesson,
                    boughts:res.data.boughts
                });
            }
        });
    }
    //支付
    buy = key => {
        console.log(key)
        let evetype=1;
        var ua = window.navigator.userAgent; 
        if (ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|MicroMessenger)/i)) {
            evetype=2;
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                evetype=3;  
            }
        }
        let goods=[];
        if(!key){
            for (let i = 0; i < this.state.list.length; i++) {
                let j = 0;
                for (; j < this.state.boughts.length; j++) {
                    if(this.state.list[i].id==this.state.boughts[j]) break;
                }
                if(j==this.state.boughts.length)
                    goods.push(this.state.list[i].goodsId)
            }

        }else{
            goods.push(key);
        }
        GET('/wechat/pay',{
            goodIds:JSON.stringify(goods),
            type:evetype,
            ticket:this.props.Store.ticket
        }).then(res => {
            if(res.code == '000000'){
                if(res.data.isSuccess){
                    this.setState({boughts:this.state.boughts.concat(goods)});//余额支付成功
                }
                if(evetype=1){
                    //显示二维码
                    //不停的回调
                }else  if(evetype=2){
                    //微信外 跳转呼出微信支付
                    window.location.href=encodeURI(res.data.result.mweb_url);
                }else{
                    //微信内
                    this.callPay(res.data)
                }
            }
        });
    }
    //获取url参数
    GetQueryString = (name)=> { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"); 
        var r = this.state.search.substr(1).match(reg); 
        if (r!=null) return (r[2]); return null; 
    }
    componentWillMount = () => {
        var lid = this.GetQueryString('lid');
        var cid = this.GetQueryString('cid');
        var from = this.GetQueryString('ticket');
        from && this.props.Store.updateTicket(from);
        this.getLct(lid);
        this.getRoom(cid);
        this.getLesson(cid);
        wx.config({
            debug:false,
            appId:"wx6b010e5ae2edae95",
            timestamp:1531556586,
            nonceStr:"xjsvmnf2b3f",
            signature:"70302437b658e3a92dd3281c651b6614b6000a47",
            jsApiList:["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone","hideMenuItems","showMenuItems","hideAllNonBaseMenuItem","showAllNonBaseMenuItem","translateVoice","startRecord","stopRecord","onVoiceRecordEnd","playVoice","onVoicePlayEnd","pauseVoice","stopVoice","uploadVoice","downloadVoice","chooseImage","previewImage","uploadImage","downloadImage","getNetworkType","openLocation","getLocation","hideOptionMenu","showOptionMenu","closeWindow","scanQRCode","chooseWXPay","openProductSpecificView","addCard","chooseCard","openCard"]
        }),
        wx.ready(function(){
            wx.hideAllNonBaseMenuItem()
        });
    }

    handFollow =() =>{
        //todo 检查登录
        let session=this.props.Store.userInfo.sessionId;
        if(!session){
            if (this.props.Store.inwx) {
                let redirect='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx60a9fa60ce58ce4c&redirect_uri=https%3a%2f%2fwww.hayun100.com%2fwechat%2findex.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
                this.props.router.push(redirect)
            }else{
                this.props.history.replace('/login')
            }
        }else{
            POST('/customer/follow',{
                target:this.state.lct.id,
                relType:1,          
            }).then(res => {
                if(res == true){
                    let data = Object.assign({}, this.state.lct, { relType: 1 })
                    this.setState.lct({
                        lct:data
                    })
                }
            });
        }
    }

    handClick =(value) =>{
        console.log('----ItemLesson--handClick---')
        this.setState({switch:value})
    }
    //微信内支付 验证环境
    callPay = (code) => {
        if (typeof WeixinJSBridge === "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);
                document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);
            }
        } else {
            this.jsApiCall(code);
        }
    }
    //微信内支付 初始参数
    jsApiCall = (code) => {
        WeixinJSBridge.invoke('getBrandWCPayRequest', code, function (res) {
            if (!common.isNull(res) && !common.isNull(res.err_msg) && res.err_msg.indexOf('ok') > 0) {
                console.log('支付成功')
            } else {
                console.log('支付失败')
            }
        });
    }
    render() {
        const reg = /<[^>]*>|<\/[^>]*>|&nbsp;/gm;
        let des = this.state.room.lctDes?this.state.lct.lctDes.replace(reg,''):'暂无简介';
        console.log('-----this.state.boughts-----'+JSON.stringify(this.state.boughts))
        return (
            <div className='Layouts_wrap clear clearFix'>
                <img style={{width:'100%'}} src={this.state.room.photo} alt={this.state.room.title}/>
                <div className='share_btn'>
                    <Link to={{
                    pathname: '/share',
                    search: '?lid='+this.state.lct.id+'?cid='+this.state.room.id
                    }}></Link>
                </div>
                <Follow lct={this.state.lct} handFollow={this.handFollow}/>
                <SeriesBuy num={this.state.list.length} buy={this.buy} room={this.state.room} />
                <Tab handClick={this.handClick}/>
                <div className="teach_info">
                    <div style={{display:this.state.switch?'block':'none'}}>
                        {this.state.list.length>0
                            ?<div>
                            <p className="type">课程</p>
                            <div className="class clearfix">
                            {
                                this.state.list.map((k) => {
                                    return ( 
                                    <ItemLesson buy={this.buy} isSeries={this.state.room.classType=='系列课'} item={k} boughts={this.state.boughts}/>
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

export default Lesson