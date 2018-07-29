import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import {GET} from '../fetch/myfetch';
import QRCode from 'qrcode.react';
import { inject, observer } from 'mobx-react';
import '../css/share.less';

@inject('Store')
@observer
export default class ShareCard extends Component {
  constructor(props){
    super(props)
    this.state = {
      search:props.location.search,
      token:'',
      url:'',
      head:'',
      body:'',
      room:{},
      lct:{}
    }
  }
  getRoom = key => {
    GET('/api/getRoom',{
        cid:key            
    }).then(res => {
        if(res.code == '000000'){
            this.setState({room:res.data.room},this.getQcode(key));
        }
    });
  }
  getLct = key => {
    GET('/api/getLct',{
        lctId:key
    }).then(res => {
        if(res.code == '000000'){
          this.setHead(res.data.lct.headUrl);
            this.setState({lct:res.data.lct});
        }
    });
  }
  componentDidMount = () => {
    var parm=this.state.search.split('?')
    var lid=parm[1].split('=')[1];
    var cid=parm[2].split('=')[1];
    //this.getLct(lid)
    this.getRoom(cid)
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

  setHead = (url) => {
    var img = new Image;
    img.src = url+'?'+Math.random();
    img.crossOrigin = "Anonymous";
    img.onload=()=>{
      this.setState({
        head:this.getBase64Image(img)
      })
    }
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
  getQcode = (key) =>{
    GET('/wechat/getQr',{
      scene_id:key
    }).then(res => {
      this.setState({
        // url:'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+JSON.parse(res).ticket
        url:res.data.url
      },this.convertImg);
    });
  }
  
  render() {
    let user =this.props.Store.userInfo
    if(user.headUrl){
      this.setHead(user.headUrl)
      return (
        <div className="Layouts_wrap hide">
          <div id='card' className="share_wrap">
            <img  className="head" src={this.state.head} alt={user.name}/>
            <p className="name">{user.name}</p>
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
    }else{
      return '';
    }
  }
}