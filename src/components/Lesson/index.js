import React, { Component } from 'react';
import Follow from '../Follow';
import SeriesBuy from './components/SeriesBuy'
import { Link } from 'react-router-dom';
import Tab from './components/Tab';
import ItemLesson from '../Items/ItemLesson';
import Footer from '../Footer/Footer';
import MenuSwitch from '../Menu/MenuSwitch';
import {GET,POST} from '../fetch';
import { observer, inject } from 'mobx-react'
import QRCode from 'qrcode.react';
import utils from '../utils';
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
            list:[],//课程数组
            boughts:[],//已购买课程
            switch:true,
            buyQcode:'',
            showQcode:true,
            from:null,
            bought:false    //是否已经购买
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
                let url = window.location.origin+window.location.pathname+window.location.hash+'&from='+this.props.Store.userInfo.id;
                utils.isWeixin5() && utils.share(res.data.room.title,url,res.data.room.photo,res.data.room.title);
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
                    boughts:res.data.boughts,
                    bought:res.data.boughts?this.isBought(res.data.Lesson,res.data.boughts).length == 0:false
                });
            }
        });
    }
    //支付
    isBought = (list,boughts) => {
        let goods=[];
        for (let i = 0; i < list.length; i++) {
            let j = 0;
            for (; j < boughts.length; j++) {
                if(list[i].goodsId==boughts[j]) break;
            }
            if(j==boughts.length)
                goods.push(list[i].goodsId)
        }
        return goods
    }
    //支付
    handleBuy = key => {
        console.log('-----handleBuy-------'+this.state.from)
        //todo 检查登录
        if(this.props.Store.userInfo.sessionId == ''){
            utils.login(this.props);
        }else if(this.state.buyQcode){
            this.setState({showQcode:true});
        }else{
            var evetype=1;
            if (utils.isMobile()) {
                evetype=2;
                if (ua.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
                    evetype=3;  
                }
            }
            let goods=[];
            if(!key){
                goods = this.isBought(this.state.list,this.state.boughts)
            }else{
                goods.push(key); 
            }
            if(goods.length == 0){
                this.setState({bought:true});
            }else{
                GET('/wechat/pay',{
                    goodIds:JSON.stringify(goods),
                    type:evetype,
                    from:this.state.from
                }).then(res => {
                    if(res.code == '000000'){
                        if(res.data.isSuccess){
                            this.setState({
                                boughts:this.state.boughts.concat(goods),
                                bought:true
                            });//余额支付成功
                        }else{
                            if(evetype == 1){            //扫码
                                this.setState({
                                    buyQcode:res.data.payUrl,
                                    showQcode:true
                                });
                                this.payst(res.data.orderId,goods)
                            }else  if(evetype == 2){    //微信外 跳转呼出微信支付
                                window.location.href=encodeURI(res.data.result.mweb_url);
                            }else{                      //微信内
                                this.callPay(res.data.result,goods)
                            }
                        }
                    }
                });
            }
        }
    }
    //回调成功
    payst = (orderId,goods) => {
        let $timer = window.setInterval(()=>{
            GET('/wechat/payst',{
                orderId:orderId,
            }).then(res => {
                if (res=='true'){
                    this.setState({
                        boughts:this.state.boughts.concat(goods),
                        buyQcode:''
                    });
                    window.clearInterval($timer)
                }
            })
        },5000); 
    }
    componentWillMount = () => {
        let lid = utils.queryStr('lid',this.state.search);
        let cid = utils.queryStr('cid',this.state.search);
        let from = utils.queryStr('from',this.state.search)
        this.getLct(lid);
        this.getRoom(cid);
        this.getLesson(cid);
        //保存到localstore 或者 拿出对应cid的from
        utils.handleFrom(cid,from,this);
    }

    handFollow =() =>{
        //todo 检查登录
        console.log(this.props.Store.userInfo.sessionId+'----------'+JSON.stringify(this.props.Store))
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
        console.log('----ItemLesson--handClick---')
        this.setState({switch:value})
    }
    //微信内支付 验证环境
    callPay = (code,goods) => {
        if (typeof WeixinJSBridge === "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);
                document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);
            }
        } else {
            this.jsApiCall(code,goods);
        }
    }
    //微信内支付 初始参数
    jsApiCall = (code,goods) => {
        WeixinJSBridge.invoke('getBrandWCPayRequest', code, function (res) {
            if (res && res.err_msg && res.err_msg.indexOf('ok') > 0) {
                console.log('支付成功')
                this.setState({boughts:this.state.boughts.concat(goods)});
            } else {
                console.log('支付失败')
            }
        });
    }
    hideQcode= () =>{
        this.setState({showQcode:false});
    }
    render() {
        const reg = /<[^>]*>|<\/[^>]*>|&nbsp;/gm;
        let des = this.state.room.lctDes?this.state.lct.lctDes.replace(reg,''):'暂无简介';
        return (
            <div className='Layouts_wrap clear clearFix'>
                <img style={{width:'100%'}} src={this.state.room.photo} alt={this.state.room.title}/>
                <div className='share_btn'>
                    <Link to={{
                    pathname: '/share',
                    search: '?cid='+this.state.room.id
                    }}></Link>
                </div>
                <Follow lct={this.state.lct} handFollow={this.handFollow}/>
                <SeriesBuy bought={this.state.bought} num={this.state.list.length} buy={this.handleBuy} room={this.state.room} />
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
                                    <ItemLesson buy={this.handleBuy} isSeries={this.state.room.classType=='系列课'} item={k} boughts={this.state.boughts}/>
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
                {this.state.buyQcode && this.state.showQcode
                    ?<div className="buy_qcode">
                        <a class="cover" href="javascript:void(0);" onClick={this.hideQcode}></a>
                        <div className="qcode">
                        <p class="qrcode-title">使用微信扫码支付</p>
                            <QRCode renderAs='svg' value={this.state.buyQcode} size='200'/>
                            <p class="qrcode-tip">扫描二维码，识别图中二维码</p>
                        </div>
                    </div>
                    :''
                }
            </div>
        )
    }
}

export default Lesson