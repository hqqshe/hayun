import React from 'react';
import { Link } from 'react-router-dom';

class MainMenu extends React.Component {
  
  render() {
    return (
      <div className='m_wrap'>
        <Link to={{
              pathname: '/category',
              search: '?type=live'
            }}>
          <span className='live'></span>
          <p>直播课程</p>
        </Link>
        <Link to={{
              pathname: '/category',
              search: '?type=lecturer'
            }}>
          <span className='teach'></span>
          <p>资深老师</p>
        </Link>
        <Link to={{
              pathname: '/category',
              search: '?type=video'
            }}>
          <span className='video'></span>
          <p>精选视频</p>
        </Link>
        <Link to={{
              pathname: '/category',
              search: '?type=video'
            }}>
          <span className='my'></span>
          <p>个人中心</p>
        </Link>
      </div>
    );
  }
}
export default MainMenu