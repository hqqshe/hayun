import React from 'react';
import { Link } from 'react-router-dom';
import ItemLive from '../../Items/ItemLive';
import {GET} from '../../fetch';

class Lives extends React.Component {
  constructor(props){
    super(props)
    this.state={
      list:[]
    }
  }

  handleClick = (e) => {
    
  }
  /**
   * 初始化获取数据
   * @param  {string} key 搜索关键字
   */
  getData = key => {
    GET('/api/lives',{
      s:4,
      p:1,
      q:key
    }).then(res => {
      if(res.code == '000000'){
        this.setState({list:res.data.lives});
      }
    });
  }

  componentDidMount = () => {
    this.getData(this.props.skey)
  }
  componentWillReceiveProps = (nextProps) => {
    if(this.props.skey===nextProps.skey) return;
    this.getData(nextProps.skey)
  }

  render() {
    return (
      <div className='lives wrap_style' onClick={this.handleClick.bind(this)} selectedKeys={[this.state.current]} >
        <div className='it_wrap wrap_padding'>
          <span>直播视频</span>
          <Link className="link" to={{
              pathname: '/category',
              search: '?type=live?key='+this.props.skey
            }}><i>more</i>
          </Link>
        </div>
        <div className="wrap_padding">
        {
          this.state.list.map((k,v) => {
            return ( 
              <ItemLive item={k}/>
            )
          })
        }
        </div>
      </div>
    );
  }
}
export default Lives