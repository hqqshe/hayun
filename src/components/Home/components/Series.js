import React from 'react';
import { Link } from 'react-router-dom';
import ItemClass from '../../Items/ItemClass'
import {GET} from '../../fetch';

class Series extends React.Component {
  constructor(props){
    super(props)
    this.state={
      list:[]
    }
  }

  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }
  /**
   * 初始化获取数据
   * @param  {string} key 搜索关键字
   */
  getData = key => {
    GET('/api/rooms',{
      s:4,
      p:1,
      q:key,
    }).then(res => {
      if(res.code == '000000'){
        this.setState({list:res.data.data});
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
      <div className='lives wrap_style' onClick={this.handleClick} selectedKeys={[this.state.current]} >
        <div className='it_wrap wrap_padding'>
          <span>系列课程</span>
          <Link className="link" to={{
              pathname: '/category',
              search: '?type=serie?key='+this.props.skey
            }}><i>more</i>
          </Link>
        </div>
        <div className="wrap_padding">
        {
          this.state.list.map((k) => {
            return ( 
              <ItemClass item={k}/>
            )
          })
        }
        </div>
      </div>
    );
  }
}
export default Series