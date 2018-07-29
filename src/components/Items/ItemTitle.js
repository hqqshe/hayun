import React from 'react'

class ItemTitle extends React.Component{
    render() {
        return (
            <div className='it_wrap wrap_padding'>
                <span>{this.props.text}</span>
                
            </div>
        )
    }
}
export default ItemTitle