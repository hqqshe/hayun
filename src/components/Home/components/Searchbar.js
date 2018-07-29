import React from 'react';
import 'whatwg-fetch';

class Searchbar extends React.Component {
  constructor(props,context){
    super(props,context);
    this.state={
      key:'',
      focus:false
    }
  }
 
  handleKeyUp = (e) => {
    if(e.keyCode != 13) return;
    this.props.handleSearch(e.target.value);
  }
  handleChange = (e) =>{
    this.setState({
      key:e.target.value
    })
  }
  handleClick = () =>{
    if(this.state.key==='') return;
    this.props.handleSearch(this.state.key);
  }
  handleFocus = () =>{
    this.setState({
      focus:true
    })
  }
  handleBlur = () =>{
    this.setState({
      focus:false
    })
  }
  
  render() {
    return (
      <div className='s_wrap'>
        <span className={this.state.focus?'s_icon active':'s_icon'}  onClick={this.handleClick}></span>
        <input className='s_input'  type="text" placeholder='搜索老师/课程/视频'
          value={this.state.key}
          onKeyUp={this.handleKeyUp.bind(this)}
          onChange={this.handleChange.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          onBlur={this.handleBlur.bind(this)}
        />
      </div>
    );
  }
}
export default Searchbar