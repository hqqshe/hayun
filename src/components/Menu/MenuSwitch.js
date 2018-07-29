import React from 'react';
import FlyMenu from './FlyMenu'

class MenuSwitch extends React.Component {
  constructor() {
    super();
    this.state = {showMenu: false};
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = (e) => {
    this.setState({
      showMenu: !this.state.showMenu
    });
  }
  
  render() {
    
    if(this.state.showMenu){
      return (
        <div  className='menu_switch show_menu' onClick={this.handleClick}>
          <div className='fix_menu'>
            <FlyMenu />
          </div>
          <a className="cover" href="javascript:void(0);" ></a>
        </div>
      );
    }else{
      return (
        <div className='menu_switch'>
          <a className='switch'  onClick={this.handleClick}></a>
        </div>
      );
    }
  }
}
export default MenuSwitch