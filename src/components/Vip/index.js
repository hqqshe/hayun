import React, { Component } from 'react';
import Footer from '../Footer/Footer';
import MenuSwitch from '../Menu/MenuSwitch';
import {GET,POST} from '../fetch';
import utils from '../utils';
import { observer, inject } from 'mobx-react';

@inject('Store')
@observer
class Vip extends Component {
    constructor(props){
        super(props)
        this.state={
            videos:[],
            from:null,
            player:null
        }
    }
    //获取视频数据
    getVidoes = () => {
        POST('/video/freeVideo',{
        }).then(res => {
            if(res.code == '000000'){
                this.setState({
                    videos:this.state.videos.concat(res.data.data)

                });   
                 //初始当前用户分享
                let url = window.location.origin+window.location.pathname+window.location.hash+'&from='+this.props.Store.userInfo.id;
                utils.isWeixin5() && utils.share(res.data.goods.name,url,res.data.goods.photo,res.data.goods.name);
            }
        });
    }
    //获取播放数据
    getPlaySts = (goodsId) => {
        if(this.state.player){
            //
            document.getElementById('J_prismPlayer').innerHTML='';
            this.setState({player:null})
            this.state.player.dispose(); //销毁
		}
        POST('/player/sts',{'goodsId':goodsId}
        ).then(res => {
            if(res.code == '000000'){
                let data = res.data;
				this.initPlayer(data.vid,data.accessKeyId,data.securityToken,data.accessKeySecret);
            }
        });
    }
    //初始化播放器
    initPlayer = (vid,accessKeyId,securityToken,accessKeySecret) => {
        let that=this;
        new Aliplayer(
            {
              id: 'J_prismPlayer',
              width: '100%',
              autoplay: true,
              vid : vid,
              accessKeyId: accessKeyId,
              securityToken: securityToken,
              accessKeySecret: accessKeySecret,
              useH5Prism:true,
              controlBarVisibility: "hover"
             },
             function(p){
                that.setState({
                    player:p
                 })
            }
         );
    }
    //支付
    handleBuy = key => {
        //todo 检查登录
        if(this.props.Store.userInfo.sessionId == ''){
            utils.login(this.props);
        }else if(this.state.buyQcode){
            this.setState({showQcode:true});
        }else{
            var evetype=1;
            if (utils.isMobile()) {
                evetype=2;
                if (utils.isWeixin5()) {
                    evetype=3;  
                }
            }
            let goods=[];
            goods.push(key);
            GET('/wechat/pay',{
                goodIds:JSON.stringify(goods),
                type:evetype,
                goodtype:1,
                from:this.state.from
            }).then(res => {
                if(res.code == '000000'){
                    if(res.data.isSuccess){ //余额支付成功
                        let data = Object.assign({}, this.state.videoPkg, { boughted: true });
                        this.setState({videoPkg:data});
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
    //加载钩子
    componentDidMount = () => {
        let from = utils.queryStr('from',this.state.search);
        let goodId = utils.queryStr('goodsId',this.state.search)
        this.getVidoes()
        utils.loadJs([{
            src: 'https://g.alicdn.com/de/prismplayer/2.7.2/aliplayer-min.js',
            func:() => {
                
            }
        }]);
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

    //播放某个视频
    handlePlay = (id,videoId)=> { 
        let redirect='//www.hayun100.com/player/play/'+id;
        //let redirect = window.location.origin + '/player/play/'+id
        if(videoId) redirect=redirect+'?videoId='+videoId;
        window.open(redirect);  
    }
    
    render() {
        return (
            <div className='Layouts_wrap clear clearFix'>
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
                                        <div className="info" onClick={this.getPlaySts.bind(this,k.goosId)}>
                                            <p className="title">{k.title}</p>
                                            <span className="sign">{k.category}</span>
                                            {k.amountLong==0
                                                ?<span className="sign free">免费</span>:''
                                            }
                                            
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                </div>
                <div class="prism-player" id="J_prismPlayer"></div>
                <Footer />
                <MenuSwitch />
            </div>
        )
    }
}

export default Vip