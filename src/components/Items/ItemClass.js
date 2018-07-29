import React from 'react'
import { Link } from 'react-router-dom';

class ItemClass extends React.Component{
    
    static defaultProps = {lct:false,pub:false};

    render() {
        return (
            <div className='item_live clearfix'>
                <Link className="link" to={{
                    pathname: '/lesson',
                    search: '?lid='+this.props.item.lid+'&cid='+this.props.item.id
                    }} >
                <div className="imgcon">
                    <img src={this.props.item.photo} alt={this.props.item.title}/>
                    {this.props.lct != 'true'
                        ?<div className="info">
                            <img src={this.props.item.headUrl} alt={this.props.item.userName}/>
                            <span>{this.props.item.userName}</span>
                        </div>
                        :''
                    }
                </div>
                <div className="detail">
                    <p className="title">{this.props.item.title}</p>
                    <p className="livetime">共{this.props.item.sign}课</p> 
                    <p className="sign">{this.props.item.sign}人已报 | {this.props.item.grade} | {this.props.item.subject}</p>
                    {this.props.pub != 'true'
                        ?<div className="buy">
                            {/* <span className="old rmb">123</span> */}
                            <span className="rmb">{this.props.item.price/100}</span>
                        </div>
                        :''
                    }
                </div>
                </Link>
            </div>
        )
    }
}
export default ItemClass