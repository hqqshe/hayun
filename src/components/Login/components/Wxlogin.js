import React from 'react';
import ReactDOM from 'react-dom';

export default class Wxlogin extends React.Component {
  constructor() {
    super();
    this.state = {
        width:"300px",
        height:"400px",
        src:encodeURI("https://open.weixin.qq.com/connect/qrconnect?appid=wx60a9fa60ce58ce4c&scope=snsapi_login&redirect_uri=https://www.hayun100.com/wechat/index.html&state=1&login_type=jssdk&self_redirect=default&style=black")
    }
}
  render() {
    return (
      <iframe 
        style={{width:'300px', height:'400px'}}
        onLoad={() => {
            const obj = ReactDOM.findDOMNode(this);
        }} 
        ref="iframe" 
        src={this.state.src} 
        width={this.state.width} 
        height={this.state.height} 
        scrolling="no" 
        frameBorder="0"
    />
    );
  }
}