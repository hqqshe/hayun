import React from 'react'
import { Link } from 'react-router-dom';

class ItemVideo extends React.Component{
   
    render() {
        // const reg = /<[^>]*>|<\/[^>]*>|&nbsp;/gm;
        // var des = this.props.item.description.replace(reg,'');
        return (
            <div className='item_live clearfix'>
                <Link className="link" to={{
                    pathname: '/video',
                    search: '?goodsId='+this.props.item.id
                }}>
                <div className="imgcon">
                    <img src={this.props.item.photo} alt={this.props.item.name}/>
                </div>
                <div className="detail">
                    <p className="title">{this.props.item.name}</p>
                    <p className="livetime">
                    {this.props.item.category} | {this.props.item.grade} · {this.props.item.subName}</p>
                    <p className="des line_one">共{this.props.item.count}个视频</p>
                    <div className="buy video">
                        <span className="rmb old">{this.props.item.oldPrice/100}</span>
                        <span className="rmb">{this.props.item.newPrice/100}</span>
                    </div>
                </div>
                </Link>
            </div>
        )
    }
}
export default ItemVideo