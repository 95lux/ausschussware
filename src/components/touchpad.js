import React, { Component } from 'react'

export default class Touchpad extends Component {

    render () {

        return (
            <div className="touchpad"
                onMouseMove={this.props.changeTrack}
                onTouchStart={this.props.changeTrack}
                onTouchMove={this.props.changeTrack}
            >
                {this.props.children}
            </div>
        )
    }
}
