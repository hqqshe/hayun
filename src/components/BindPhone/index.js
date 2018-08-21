import React, { Component } from 'react';
import MenuSwitch from '../Menu/MenuSwitch'
import { Form, Input, Button } from 'antd';
import {GET,POST} from '../fetch';
import { inject, observer } from 'mobx-react';

const FormItem = Form.Item;
const Search = Input.Search;

@inject('Store')
@observer
class BindPhone extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            loading:false,
            timer:60,
            discodeBtn: false,
            phone:'',
            search:props.location.search?props.location.search.split('=')[1]:null,
        }
    }
    /**
     * 发短信
     */
    sendMsg = () => {
        if(this.state.discodeBtn) return;
        this.props.form.validateFields(['phone'],(err, values) => {
          if (!err) {
            GET('/sms/bind/'+values.phone,{
            }).then(res => {
                this.count();
            });
          }
        });
    }
    //倒计时
    count = () => {
        let siv = setInterval(() => {
            this.setState({ 
                timer: --this.state.timer,
                discodeBtn: true
            },() => {
                if (this.state.timer === 0) {
                    clearInterval(siv);
                    this.setState({
                        timer:60,
                        discodeBtn: false
                    })
                }
            });
        }, 1000);
        }
    /**
     * 绑定
     */
    bingPhone = (p,c) => {
        GET('/wechat/bindPhone/',{
            phone:p,
            code:c,
            openid:this.state.search
        }).then(res => {
            console.log(res)
            res.data.account.vip=res.data.vip
            this.props.Store.updateName(res.data.account)
            this.props.history.push('/')
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var that=this;
        this.props.form.validateFields((err, values) => {
          if (!err) {
            that.bingPhone(values.phone,values.code)
          }
        });
      }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className='Layouts_wrap '>
                <div className="bind-form">
                    <p className="title">绑定手机号码</p>
                    <Form  onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem>
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, message: '输入手机号码' },{ pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '手机号码不对' }],
                            })(
                                <Input placeholder="输入手机号码" value={this.state.phone}/>
                            )}
                        </FormItem>
                        <FormItem> 
                            {getFieldDecorator('code', {
                                rules: [{ required: true, message: '输入验证码' },{ len: 6, message: '验证码不对' }],
                            })(
                                <Search
                                    placeholder="输入验证码"
                                    onSearch={this.sendMsg.bind(this)}
                                    enterButton={this.state.timer==60?'获取验证码':this.state.timer+'s'}
                                    autocomplete="off"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="bind_btn" >
                                立即绑定
                            </Button>
                        </FormItem>
                    </Form>
                    <p className="des">
                        绑定手机号码之后，可以购买课程，试听视频，接收到开课短信通知。如果已有哈云账号，请输入原来的手机号码！
                    </p>
                </div>
                <MenuSwitch />
            </div>  
        )
    }
}
export default Form.create()(BindPhone);