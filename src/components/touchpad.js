import React, { Component } from 'react'

export default class Touchpad extends Component {

    render () {

        return (
            <div className="touchpad"
                onMouseMove={this.props.changeTrack}
                onTouchStart={this.props.changeTrack}
                onTouchMove={this.props.changeTrack}
                onMouseOut={this.props.setToCurrent}
            >
                {this.props.children}
            </div>
        )
    }
}
