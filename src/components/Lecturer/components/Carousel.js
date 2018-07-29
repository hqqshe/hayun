import React, { Component } from 'react';
import ReactSwipe from 'react-swipe';
import "../../css/Carousel.less";

class Carousel extends React.Component {
    render() {
        return (
            <ReactSwipe
                key={this.props.series.length}
                swipeOptions={{
                    startSlide: 0,
                    speed: 1000,
                    auto: 3000,
                    continuous: true,
                    disableScroll: false,
                    stopPropagation: false,
                    callback: function (index, elem) {
                    },
                    transitionEnd: function (index, elem) {
                    }
                }}>
                {
                    this.props.series.map((k) => {
                        return (
                            <div className="swipe" >
                                <img src={k.photo} />
                            </div>
                        )
                    })
                }
            </ReactSwipe>
        );
    }
}
export default Carousel;