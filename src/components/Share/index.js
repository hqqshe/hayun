import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ShareBg extends Component{

    render() {
        return (
            <div className='share_btn'>
                <Link to='/share'></Link>
            </div>  
        )
    }
}
export default ShareBg