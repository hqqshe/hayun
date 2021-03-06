import React from 'react'

class SeriesBuy extends React.Component{
    
    handClick = () =>{
        this.props.buy();
    }
    render() {
        let serie=this.props.room.classType=='系列课';
        let buy = null;
        if(serie){
            buy=<a href="javascript:void(0);" className="buy_btn" onClick={this.handClick}>立即报名</a>
            if(this.props.num>0){
                if(this.props.bought)
                buy = <a href="javascript:void(0);" className="buy_btn play">已报名</a>
            }else{
                buy = <a href="javascript:void(0);" className="buy_btn play">暂无课程</a>
            }
            
        }
        return (
            <div className='buy_wrap wrap_padding'>
                 <div className="info">
                    <p className="title">{this.props.room.title}</p>
                    <p className="des">限制:{this.props.room.limitNum}人 | 课程:{this.props.num}节 | 年级:{this.props.room.subject} | 科目:{this.props.room.grade}</p>
                    <p className="des"></p>
                    {serie
                    ?<div className="price_info">
                        {/* <span className="old rmb">123</span> */}
                        <span className="rmb">{this.props.room.price/100}</span>
                    </div>
                    :null
                    }
                </div>
                <div className='buy'>
                    {buy}
                </div>
            </div>
        )
    }
}
export default SeriesBuy