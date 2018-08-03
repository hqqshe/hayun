import React, { Component } from 'react'
import Searchbar from './components/Searchbar'
import Lives from './components/Lives'
import Series from './components/Series'
import Lecturer from './components/Lecturer'
import Video from './components/Video'
import Footer from '../Footer/Footer'
import Mainmenu from '../Menu/MainMenu'
import MenuSwitch from '../Menu/MenuSwitch'
import { Provider, inject, observer } from 'mobx-react'

import '../css/index.less'
import Cookies from 'js-cookie'

@inject('Store')
@observer
class Home extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            skey:''
        }
    }
    componentWillMount = () => {
        
    }
    componentWillReceiveProps = (nextProps) => {
        if(this.state.skey===nextProps.skey) return;
    }
    handleSearch = (e) => {
        this.setState({skey:e});
    }

    render() {
        return (
            <div className='Layouts_wrap clearFix'>
                <Searchbar handleSearch={this.handleSearch} />
                <Mainmenu />
                <Lives skey={this.state.skey}/>
                <Series skey={this.state.skey}/>
                <Lecturer skey={this.state.skey}/>
                <Video skey={this.state.skey}/>
                <Footer />
                <MenuSwitch />
            </div>
        )
    }
}

export default Home