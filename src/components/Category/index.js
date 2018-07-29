import React, { Component } from 'react'
import Cate from './components/Cate'
import Footer from '../Footer/Footer'
import MenuSwitch from '../Menu/MenuSwitch'

import '../css/index.less'
import Cookies from 'js-cookie'

class Category extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            category:props.location.search.split('?')[1].split('=')[1],
            skey:props.location.search.split('?')[2]?props.location.search.split('?')[2].split('=')[1]:''
        }
      }
    logout = () =>{
        Cookies.remove('JSESSIONID', { path: '/' })
        Cookies.remove('userName', { path: '/' })
        this.props.history.replace('/login')
    }
    handleSearch = (e) => {
        this.setState({skey:e});
        
    }
    componentWillReceiveProps = (nextProps) => {
        console.log(nextProps.category+'index componentWillReceiveProps'+this.state.category)
        if(this.state.category===nextProps.category) return;
        this.setState({
            category:props.location.search.split('?')[1].split('=')[1],
            skey:props.location.search.split('?')[2]?props.location.search.split('?')[2].split('=')[1]:''
        })
      }
    render() {
        return (
            <div className='Layouts_wrap clear clearFix'>
               <Cate catagory={this.state.category} skey={this.state.skey}/>
                {/* {(()=>{
                    switch (this.state.category) {
                        case 'live' :
                            return <Lives skey={this.state.skey}/> ; break;
                        case 'serie' :
                            return <Series skey={this.state.skey}/> ;break;
                        case 'lecturer' :
                            return <Lecturer skey={this.state.skey}/> ;break;
                        case 'video' :
                            return <Video skey={this.state.skey}/> ;break;
                        default:
                            return <Lives skey={this.state.skey}/> ;break;
                            break;
                    }  
                })()
                } */}
                <Footer />
                <MenuSwitch />
            </div>
        )
    }
}

export default Category