import React from 'react';
import { Link } from 'react-router-dom';
import BackTop from './BackTop';

class FlyMenu extends React.Component {
  
  render() {
    return (
      <div className='m_wrap' onClick={this.handleClick}>
        <Link to={{
              pathname: '/'
            }}>
          <span className='home'></span>
          <p>首页</p>
        </Link>
        <BackTop/>
       
        <Link to={{
              pathname: '/user'
            }}>
          <span className='my'></span>
          <p>个人中心</p>
        </Link>
      </div>
    );
  }
}
export default FlyMenu