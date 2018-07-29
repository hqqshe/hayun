import React from 'react';
import ItemTitle from '../../Items/ItemTitle';
import ItemLct from '../../Items/ItemLct';
import ItemLive from '../../Items/ItemLive';
import ItemClass from '../../Items/ItemClass'
import ItemVideo from '../../Items/ItemVideo'
import Searchbar from '../../Home/components/Searchbar'
import {GET} from '../../fetch/myfetch';

//强大的分类子页面
class Cate extends React.Component {
  constructor(props){
    super(props)
    this.state={
      skey:props.skey,
      apiUrl:'',
      list:[],
      total:0,
      s:8,
      p:1,
      more:'点击加载更多',
      title:'',
      item:''
    }
  }
 
  /**
   * 获取数据
   */
  getData = () => {
    GET(this.state.apiUrl,{
      s:this.state.s,
      p:this.state.p,
      q:this.state.skey
    }).then(res => {
      if(res.code == '000000'){
        this.setState({
          list:this.state.list.concat(this.props.catagory==='live'?res.data.lives:res.data.data),
          total:res.total
        },()=>{
          //更新 加载更对按钮
          if(this.state.s*this.state.p>=this.state.total){
            this.setState({more:'没有更多了'});
          }else{
            this.setState({more:'点击加载更多'});
          }
        });
        
      }
    });
  }
  //初始化 加载 数据
  componentDidMount = () => {
    var url='',title='';
    switch(this.props.catagory){
      case 'live' :url='/api/lives',title='直播视频'; break;
      case 'serie' :url='/api/rooms',title='系列课程'; break;
      case 'lecturer' :url='/api/lct',title='资深老师'; break;
      case 'video' :url='/api/videoPkg',title='精选视频'; break;
      default :url='/api/lives';
    }
    this.setState({
      apiUrl:url,
      title:title
    }, ()=>{
      this.getData()
    });
  }
  //加载更多
  handleClick = (e) => {
    e.preventDefault();
    //没有数据了
    if(this.state.s*this.state.p<this.state.total){
      this.setState({p:this.state.p+1}, ()=>{
        this.getData()
      });
    }
  }
  //搜索 重置list 子组件来的事件
  handleSearch = (e) => {
    e=e?e:'';
    this.setState({
      skey:e,
      list:[]
    },this.getData());
    
  }
  
  render() {
    var items = [];
    for (var i = 0; i < this.state.list.length; i++) {
      var item='';
      switch(this.props.catagory){
        case 'live' :item=<ItemLive item={this.state.list[i]}/>; break;
        case 'serie' :item=<ItemClass item={this.state.list[i]}/>; break;
        case 'lecturer' :item=<ItemLct item={this.state.list[i]}/>; break;
        case 'video' :item=<ItemVideo item={this.state.list[i]}/>; break;
      }
      items.push(item);
    }
    return (
      <div className='lives'>
       <Searchbar handleSearch={this.handleSearch} />
        <ItemTitle text={this.state.title}/>
        <div className="wrap_padding clearfix">
          {items}
        </div>
        <div className="more" onClick={this.handleClick.bind(this)}>{this.state.more}</div>
      </div>
    );
  }
}
export default Cate