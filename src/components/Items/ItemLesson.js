import React from 'react'
import { Link } from 'react-router-dom';

class ItemLesson extends React.Component{
    handClick = () =>{
        this.props.buy(this.props.item.goodsId);
    }
    render() {
        var time=this.props.item.startTime.substring(0,this.props.item.startTime.length-3)

        let bought=this.props.boughts.filter((k)=>{
            return k==this.props.item.goodsId
        })
        console.log(this.props.item.id+'------'+JSON.stringify(this.props.boughts))
        let buyInfo='';
        if(bought.length>0){
            buyInfo = <div className="buy_info clearfix">
                        <a className="buy_btn play">已报名</a>
                      </div>
        }else if(!this.props.isSeries){
            buyInfo = <div className="buy_info clearfix">
                        <span className="price rmb">{this.props.item.price/100}</span> 
                        <a onClick={this.handClick} className="buy_btn">报名</a>
                      </div>
        }
        return (
            <div className='item_lesson clearfix'>
                <div className="info">
                    <p className="title">{this.props.item.courseName}</p>
                    <span className="livetime">{this.props.item.courseDate} {time} 直播</span>
                    <span className="sign">{this.props.item.signup}人学习</span>
                </div>
                {buyInfo}
            </div>
        )
    }
}
export default ItemLesson