import React, { Component } from 'react';
import Footer from '../Footer/Footer';
import MenuSwitch from '../Menu/MenuSwitch';
import QRCode from 'qrcode.react';
import {GET,POST} from '../fetch';
import utils from '../utils';
import { observer, inject } from 'mobx-react';
import ad from '../assets/ad.png';
import '../css/vip.less';

@inject('Store')
@observer
class Vip extends Component {
    constructor(props){
        super(props)
        this.state={
            videos:[],
            from:null,
            player:null,
            current:29,
            buyQcode:'',
            showQcode:true
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
                 
            }
        });
    }
    //获取播放数据
    getPlaySts = (goodsId) => {
        this.closePlayer()
        POST('/player/sts',{'goodsId':goodsId}
        ).then(res => {
            if(res.code == '000000'){
                let data = res.data;
                this.initPlayer(data.vid,data.accessKeyId,data.securityToken,data.accessKeySecret);
                this.setState({showPlayer:'block'})
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
              height:'500',
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
                amount:this.state.current,
                type:evetype,
                goodtype:2,
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
        //初始当前用户分享
        if(utils.isWeixin5()){
            let url = window.location.origin+window.location.pathname+window.location.hash;
            if(this.props.Store.userInfo) url = window.location.origin+window.location.pathname+window.location.hash+'&from='+this.props.Store.userInfo.id;
            utils.share('哈云会员限时推广',url,'https://www.hayun100.com/wechat/images/d031ec2d9f5a7d758453f500f2ad2a0b.png','教材同步·知识点精讲·基础课·提高课,覆盖小学一年级至高三的全部科目');
        }
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
    covertImg = (url) =>{
        let parms = url.split('dfkt/')
        return (parms.length === 2 ? parms[0] + 'dfkt/' + encodeURI(parms[1]):parms[0]).replace('+','%2B');
    }
    preventBackgroundScroll = (e: React.WheelEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        if (
          (e.deltaY < 0 && target.scrollTop <= 0) ||
          (e.deltaY > 0 && target.scrollHeight - target.clientHeight - target.scrollTop <= 0)
        ) {
          e.stopPropagation()
          e.preventDefault()
        }
    }
    //关闭播放器 非常的蛋疼,dispose会清除容器,让我不得不操作dom 手动把容器添加回去
    closePlayer = () =>{
        if(this.state.player){
            this.state.player.dispose();
            let con = document.getElementById('J_prismPlayer');
            if(!con){
                let div = document.createElement("div");
                div.setAttribute("id", "J_prismPlayer");
                div.setAttribute("class", "prism-player");
                document.getElementById('playerback').appendChild(div); 
            }else{
                con.innerHTML='';
            }
            this.setState({player:null})
		}
        this.setState({showPlayer:'none'})
    }
    chooseItem = (key) => {
        this.setState({current:key})
    }
    getVipExpire = () => {
        if(this.props.Store.userInfo.vip){
            return utils.dateFormat(new Date(this.props.Store.userInfo.vip),"yyyy-MM-dd")
        }
        return '';
    }
    
    render() {
        return (
            <div className='Layouts_wrap contaner'>
                <div className="ad_wrap">
                    <img src={ad} alt=""/>
                </div>
                <div className='item_title'>试看视频</div>
                <div className="video_con">
                    <div className="video_wrap clearfix">
                    {
                        this.state.videos.map((k) => {
                            return (
                                <div class="videoItem" onClick={this.getPlaySts.bind(this,k.goosId)}>
                                    <div class="inner">
                                        <div class="video"> <img src={this.covertImg(k.coverURL)} /></div>
                                        <p class="title">{k.title}</p>
                                        <p class="tip">同步辅导 | {k.grade} | {k.subjectName}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
                <div className='item_title'>会员购买</div>
                <div className="item_con">
                    <div className="specil">
                        <div className="item clearfix">
                            <div className="title">VIP尊享特权</div>
                            <ul className="">
                                <li>独播名师直播课</li>
                                <li>高清1080p播放</li>
                                <li>心理辅导课学习</li>
                            </ul>
                            <ul className="clearfix">
                                <li>各学科学习评测</li>
                                <li>全广告免除特权</li>
                                <li>全程1对1学习咨询</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='item_tip'>个人信息</div>
                <div className="item_con">
                    <div className="specil">
                        <div className="item clearfix">
                            <div className="user">
                                <img src="http://3wedu.oss-cn-shenzhen.aliyuncs.com/uploads/859/sethead/userhead/859_31019_1516279209784.png" alt=""/>
                                <div className="info">
                                    用户名：{this.props.Store.userInfo.name}<br/>
                                    会员有效期至：{this.getVipExpire()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='item_tip'>成为会员</div>
                <div className="item_con">
                    <div className="choseb clearfix">
                        <div className={this.state.current === 156 ? 'item active' : 'item'} onClick={this.chooseItem.bind(this,156)}>
                            <div className="inner">
                                <div className='icon'></div>
                                <p className="old">原价：594/半年</p>
                                <p className="tip">限时包月立减70%</p>
                                <p className="price"><span>¥156</span>/半年</p>
                            </div>
                        </div>
                        <div className={this.state.current === 29 ? 'item active' : 'item'} onClick={this.chooseItem.bind(this,29)}>
                            <div className="inner">
                                <div className='icon'></div>
                                <p className="old">原价：99/月</p>
                                <p className="tip">限时包月立减70%</p>
                                <p className="price"><span>¥29</span>/月</p>
                            </div>
                        </div>
                        <div className={this.state.current === 278 ? 'item active' : 'item'} onClick={this.chooseItem.bind(this,278)}>
                            <div className="inner">
                                <div className='icon'></div>
                                <p className="old">原价：1188/年</p>
                                <p className="tip">限时包月立减70%</p>
                                <p className="price"><span>¥278</span>/年</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="buy_con">
                    <div className="buy" onClick={this.handleBuy}> 立即购买 </div>
                    <p>成都哈云科技有限公司</p>
                </div>
                <div id='playerback' class="playerback" onWheel = {this.preventBackgroundScroll} style={{display:this.state.showPlayer}}>
                    <button class="back" onClick={this.closePlayer}>返回</button>
                    <div class="prism-player" id="J_prismPlayer"></div>
                </div>
                {/* {this.state.buyQcode && this.state.showQcode
                    ?<div className="buy_qcode">
                        <a class="cover" href="javascript:void(0);" onClick={this.hideQcode}></a>
                        <div className="qcode">
                        <p class="qrcode-title">使用微信扫码支付</p>
                            <QRCode renderAs='svg' value={this.state.buyQcode} size='200'/>
                            <p class="qrcode-tip">扫描二维码，识别图中二维码</p>
                        </div>
                    </div>
                    :''
                } */}
                {utils.isWeixin5()
                    ?''
                    :<div className="buy_qcode">
                        <a class="cover" href="javascript:void(0);" onClick={this.hideQcode}></a>
                        <div className="qcode">
                        <p class="qrcode-title">请使用微信扫一扫</p>
                            <QRCode renderAs='canvas' value={window.location.href} size={200} />
                            <p class="qrcode-tip">或者保存二维码,用微信扫一扫打开</p>
                        </div>
                    </div>
                }
                {/* <Footer />
                <MenuSwitch /> */}
            </div>
        )
    }
}

export default Vip