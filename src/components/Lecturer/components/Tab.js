import React from 'react';

class Tab extends React.Component {
  state = {
    active: true,
  }

  handleClick = (value) => {
   this.props.handClick(value);
   this.setState({active: value,})
  }

  render() {
    return (
      <div className='tab_wrap' >
        <div className={this.state.active?'item active':'item'} onClick={this.handleClick.bind(this,true)}>班级目录</div>
        <div className={this.state.active?'item':'item active'} onClick={this.handleClick.bind(this,false)}>老师简介</div>
      </div>
    );
  }
}
export default Tab