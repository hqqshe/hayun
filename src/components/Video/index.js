import React, { Component } from 'react';
import Footer from '../Footer/Footer';
import MenuSwitch from '../Menu/MenuSwitch';
import {GET} from '../fetch/myfetch';
import { observer, inject } from 'mobx-react'
import '../css/index.less'

@inject('Store')
@observer
class Video extends Component {
    constructor(props){
        super(props)
        this.state={
            search:props.location.search,
            videoPkg:{},
            videos:[],
            s:8,
            p:1,
            more:'点击加载更多',
            goodsId:''
        }
    }
    getVidoes = key => {
        GET('/api/vidoes',{
            s:this.state.s,
            p:this.state.p,
            goodsId:this.state.goodsId
        }).then(res => {
            if(res.code == '000000'){
                this.setState({
                    videoPkg:res.data.goods,
                    videos:this.state.videos.concat(res.data.videos)

                },()=>{
                //更新 加载更对按钮
                if(this.state.s*this.state.p>=this.state.videoPkg.count){
                    this.setState({more:'没有更多了'});
                }else{
                    this.setState({more:'点击加载更多'});
                }
                });   
            }
        });
    }
    //支付
    handleBuy = key => {
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
            ticket:this.props.Store.ticket,
            goodtype:1
        }).then(res => {
            if(res.code == '000000'){
                if(res.data.isSuccess){
                    //余额支付成功
                }
                if(evetype=1){
                    console.log(res)
                    if(res.data.paywayId == 1){// 微信支付二维码
                        $(".pay-content-list").fadeIn().find(".qrcode").empty().qrcode({text:res.data.payUrl,render:"image",ecLevel:"M"});
                        //pay_btn.off('click');
                        $timer = window.setInterval(reqpay,5000); 
                        function reqpay(){
                            $.ajax({
                                url: ctx+'/payst',
                                method: 'POST',
                                data: {'orderId': orderId},
                                success:function(res) {			
                                    if (res=='true'){
                                        window.clearInterval($timer)
                                        payResult.slideDown().siblings().hide();
                                        edition?payResult.find('.sucess').fadeIn().find('.myCourse').attr('href',jumpUrl).prev().show()
                                               :payResult.find('.sucess').fadeIn().find('.myCourse').attr('href',jumpUrl);
                                        $timer = window.setInterval(function(){
                                            window.location = jumpUrl;
                                        },8000); 
                                    }else{
                                        console.log(res);
                                    }
                                }
                            });
                        }
                     }
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
    //加载钩子
    componentDidMount = () => {
        this.setState({
            goodsId:this.GetQueryString('goodsId')
        },this.getVidoes)
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

    //播放某个视频
    handlePlay = (id,videoId)=> { 
        let redirect='//www.hayun100.com/player/play/'+id;
        //let redirect = window.location.origin + '/player/play/'+id
        if(videoId) redirect=redirect+'?videoId='+videoId;
        window.open(redirect);  
    }
    //加载更多
    handleMore = (e) => {
        e.preventDefault();
        //没有数据了
        if(this.state.s*this.state.p<this.state.videoPkg.count){
        this.setState({p:this.state.p+1},this.getVidoes);
        }
    }
    render() {
        const pkg=this.state.videoPkg;
        //console.log(this.props.location)
        return (
            <div className='Layouts_wrap clear clearFix'>
                <img style={{width:'100%'}} src={pkg.photo} alt={pkg.name}/>
                {/* <div className='share_btn'>
                    <Link to={{
                    pathname: '/share',
                    search: '?lid='+this.state.lct.id+'?cid='+this.state.room.id
                    }}></Link>
                 </div> */}
                <div className='buy_wrap wrap_padding video'>
                <div className="info ">
                   <p className="title">{pkg.name}</p>
                   <p className="des">类型:{pkg.category} | 共:{pkg.count}个视频 | 年级:{pkg.grade} | 科目:{pkg.subName}</p>
                   <p className="des"></p>
                   <div className="price_info">
                       <span className="old rmb">{pkg.oldPrice/100}</span>
                       <span className="rmb">{pkg.newPrice/100}</span>
                    </div>
                </div>
                <div className='buy'>
                {this.props.Store.userInfo.vip>new Date().getTime()||pkg.boughted
                    ?<a href="javascript:void(0);" className="buy_btn play" onClick={this.handlePlay.bind(this,pkg.id)}>立即学习</a>
                    :<a href="javascript:void(0);" className="buy_btn" onClick={this.handleBuy.bind(this,pkg.id)}>立即购买</a>
                }
                </div>
            </div>
                <div className='tab_wrap' >
                    <div className='item active'>视频列表</div>
                </div>
                <div className="wrap_padding">
                    <div>
                        <div className="class clearfix">
                        {
                            this.state.videos.map((k) => {
                                return (
                                    <div className='item_lesson clearfix'>
                                        <div className="info">
                                            <p className="title">{k.title}</p>
                                            <span className="sign">{k.category}</span>
                                            {k.amountLong==0
                                                ?<span className="sign free">免费</span>:''
                                            }
                                            
                                        </div>
                                        {this.props.Store.userInfo.vip>new Date().getTime()||pkg.boughted||k.amountLong==0||k.boughted
                                            ?<div className="buy_info clearfix">
                                                <a href="javascript:void(0);" className="buy_btn play" onClick={this.handlePlay.bind(this,pkg.id,k.goosId)}>播放</a>
                                            </div>
                                            :''
                                        }
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                </div>
                <div className="more" onClick={this.handleMore.bind(this)}>{this.state.more}</div>
                <Footer />
                <MenuSwitch />
            </div>
        )
    }
}

export default Video