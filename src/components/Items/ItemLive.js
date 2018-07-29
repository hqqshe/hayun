import React from 'react'
import { Link } from 'react-router-dom';

class Itemitem extends React.Component{
    constructor(props){
        super(props)
      }
    // //静态属性，给属性赋默认值
    // static defaultProps = {
    //     isSeries:false,
        
    // };
    render() {
        var time=this.props.item.startTime.substring(0,this.props.item.startTime.length-3)
        return (
            <div className='item_live clearfix'>
                <Link className="link" to={{
                    pathname: '/lesson',
                    search: '?lid='+this.props.item.lid+'&cid='+this.props.item.classId
                }}>
                <div className="imgcon">
                <img src={this.props.item.photo} alt={this.props.item.title}/>
                    <div className="info">
                        <img src={this.props.item.headUrl} alt={this.props.item.userName}/>
                        <span>{this.props.item.userName}</span>
                    </div>
                </div>
                <div className="detail">
                    <p className="title">{this.props.item.title}</p>
                        <p className="livetime">{this.props.item.date} {time} 直播</p>
                    <p className="sign">{this.props.item.sign}人已报 | {this.props.item.grade} | {this.props.item.subject}</p>
                    <div className="buy">
                        {/* <span className="old rmb">123</span> */}
                        {/*
                            this.props.item.classType=='系列课'
                            ?<span>系列课</span>
                            :<span className="rmb">{this.props.item.price/100}</span>
                        */}
                        
                        
                    </div>
                </div>
                </Link>
            </div>
        )
    }
}
export default Itemitem