import React from 'react'

class Follow extends React.Component{
    
    handClick = () =>{
        this.props.handFollow;
    }
    render() {
        return (
            <div className='f_wrap clearfix'>
                <span className="avatar">
                    <img src={this.props.lct.headUrl} alt={this.props.lct.lctName}/>
                </span>
                <span className="name">{this.props.lct.lctName}</span>
                {(()=>{
                    switch(this.props.lct.relType){
                        case 1:
                        console.log(this.props.lct.relType+"-----1-");
                        return <div className='follow ed'>
                                    <span className="icon"></span>
                                    <span className="txt">已关注</span>
                                </div>; break;
                        case 2:return ; break;
                        default:
                        return <div className='follow' onClick={this.handClick}>
                                    <span className="icon">+</span>
                                    <span className="txt">关注</span>
                                </div>;
                        }
                    }
                )()}
            </div>
        )
    }
}
export default Follow