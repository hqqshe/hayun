import React from 'react'

class ItemLesson extends React.Component{
    handClick = () =>{
        this.props.buy(this.props.item.goodsId);
    }
    render() {
        let time=this.props.item.startTime.substring(0,this.props.item.startTime.length-3)
        let buyInfo='';
        if(!this.props.isSeries){
            buyInfo = <div className="buy_info clearfix">
                        <span className="price rmb">{this.props.item.price/100}</span> 
                        <span onClick={this.handClick} className="buy_btn">报名</span>
                      </div>
        }
        if(this.props.boughts){
            let i = 0;
            for (; i < this.props.boughts.length; i++) {
                if(this.props.item.goodsId == this.props.boughts[i]){
                    break;
                }
            }
            if(this.props.boughts.length != i){
                buyInfo = <div className="buy_info clearfix">
                            <a className="buy_btn play">已报名</a>
                         </div>
            }
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