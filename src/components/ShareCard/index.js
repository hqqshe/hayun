import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import {GET} from '../fetch/myfetch';
import QRCode from 'qrcode.react';
import { inject, observer } from 'mobx-react';
import Cookies from 'js-cookie';
import '../css/share.less';

@inject('Store')
@observer
export default class ShareCard extends Component {
  constructor(props){
    super(props)
    this.user = this.props.Store.userInfo;
    this.state = {
      search:props.location.search,
      url:'',
      head:'',
      body:'',
      room:{},
    }
  }
  componentDidMount = () => {
    
    let session=Cookies.get('hl_p_c_s_t')
    if (!session) {
      if (this.props.Store.inwx) {
        window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx60a9fa60ce58ce4c&redirect_uri=https%3a%2f%2fwww.hayun100.com%2fwechat%2findex.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
      }else{
        this.props.history.replace('/login')
      }
    }
    var parm=this.state.search.split('?')
    var cid=parm[2].split('=')[1];
    this.getRoom(cid);
    this.getQcode(cid)
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
  getQcode = (key) =>{
    // this.setState({
    //   url:'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='
    // });
    GET('/wechat/getQr',{
      scene_id:key
    }).then(res => {
      this.setState({
        url:res.data.url
      });
    });
  }
  setHead = (url) => {
    var img = new Image;
    img.src = url+'?'+Math.random();
    img.crossOrigin = "Anonymous";
    img.onload=()=>{
      this.setState({
        head:this.getBase64Image(img)
      },this.convertImg)
    }
  }
  getBase64Image = (img) => {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
    var dataURL = canvas.toDataURL("image/octet-stream");
    return dataURL;
  }
  convertImg  = () =>{
    var opts =  {
      allowTaint: true, //允许污染
      taintTest: true, //在渲染前测试图片(没整明白有啥用)
      useCORS: true, //使用跨域(当allowTaint为true时这段代码没什么用,下面解释)
      logging: false
    };
    var width = 640; //获取dom 宽度
    var height = 1136; //获取dom 高度
    var canvas = document.createElement("canvas"); //创建一个canvas节点
    var scale = 2; //定义任意放大倍数 支持小数
    canvas.width = width * scale; //定义canvas 宽度 * 缩放
    canvas.height = height * scale; //定义canvas高度 *缩放
    canvas.getContext("2d").scale(scale, scale); //获取context,设置scale 
    canvas.mozImageSmoothingEnabled = false;
    canvas.webkitImageSmoothingEnabled = false;
    canvas.msImageSmoothingEnabled = false;
    canvas.imageSmoothingEnabled = false;
    html2canvas(document.querySelector("#card"),opts).then(canvas => {
      this.setState({
        body: canvas.toDataURL('image/octet-stream')
      });
    }); 
  }

  //这里的逻辑太麻烦了 
  // 1 初始sesion登录 异步登录信息 
  // 2 本组件要异步获取url 
  // 3 登录信息获取触发setHead()(setHead()要用到url) 
  // 4 setHead()异步设置head 
  // 5 回调设置body 
  // 每一步都会触发render 这里做限制,登录信息为空不更新,head 和body 都不为空不更新
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.Store.userInfo.headUrl==''||(this.props.Store.userInfo.headUrl!=''&&this.state.body!='')){
      console.log('不更新')
      return false;
    }
    if(this.state.head==''){
      this.setHead(this.user.headUrl)
    }
    console.log('更新')
    return true;
}
  
  render() {
    console.log('----ShareCard---headUrl--------'+this.props.Store.userInfo.headUrl)
    if(this.props.Store.userInfo.headUrl){
      return (
        <div className="Layouts_wrap hide">
          <div id='card' className="share_wrap">
            <img  className="head" src={this.state.head} alt={this.user.name}/>
            <p className="name">{this.user.name}</p>
            <p className="des">为你分享一门好课</p>
            <p className="title">{this.state.room.title}</p>
            <p className="date">开课时间</p>
            <p className="time">2018年07月02日 12:12</p>
            <div className="qcode">
              <QRCode value={this.state.url} style=""/>
            </div>
            <p className="tip">长按识别二维码,参与课程</p>
          </div>
          <div className="photo">
            <img src={this.state.body} alt=""/>
          </div>
        </div>
      );
  }else{return ''}
  }
}