import React, { Component } from 'react';
import { Form, Input, Button, Icon } from 'antd';
import { Provider, inject, observer } from 'mobx-react'
const FormItem = Form.Item;

@inject('store')
@observer
class FromBox extends Component {
    constructor(){
        super();
        this.state={
            loading:false
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        let { form } = this.props
        this.props.submit(form, this.state.loading)
    }
    render(){
        const { getFieldDecorator } = this.props.form
        const { loading } = this.state.loading
        return (
            <Provider store={this.store}>
            <Form onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '输入账号' }],
                    })(
                        <Input prefix={<span className='font icon-user' style={{ color: 'rgba(0,0,0,.25)' }}></span>} placeholder="输入账号" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '输入密码' }],
                    })(
                        <Input prefix={<span className='font icon-mima' style={{ color: 'rgba(0,0,0,.25)' }}></span>} type="password" placeholder="输入密码" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="l_button" loading={loading}>
                        登录
                    </Button>
                </FormItem>
                <FormItem >
                    <Icon type="wechat" className='wechat' alt='微信登录' onClick={this.props.handleShowWechat}/> 微信登录
                </FormItem>
            </Form>
            </Provider>
        )
    }
}

export default Form.create()(FromBox);