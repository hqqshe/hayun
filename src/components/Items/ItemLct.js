import React from 'react';
import { Link } from 'react-router-dom';

class ItemLct extends React.Component{

    render() {
        const reg = /<[^>]*>|<\/[^>]*>|&nbsp;/gm;
        let des = this.props.item.lctDes?this.props.item.lctDes.replace(reg,''):'没有简介';
        return (
            <div className='item_live clearfix'>
                <Link className="link" to={{
                    pathname: '/lct',
                    search: '?id='+this.props.item.id
                    }}>
                    <div className="imgcon">
                        <img className='circle' src={this.props.item.headUrl} alt={this.props.item.lctName}/>
                    </div>
                    <div className="detail">
                        <p className="title">{this.props.item.lctName}</p>
                        <p className="livetime">课程:{this.props.item.summary.lctCourseNum}课</p>
                        <p className="sign">报名人次:{this.props.item.summary.lctStdNum}</p>
                        <p className="des">{des}</p>
                    </div>
                    </Link>
            </div>
        )
    }
}
export default ItemLct