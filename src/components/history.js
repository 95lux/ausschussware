import React, { Component } from 'react'
import extend from 'extend'

export default class History extends Component {

    pushToHistory(currentTrackPos) {
        let listeningHistory = this.state.listeningHistory

        // buffer overflow remove oldest from history
        if (listeningHistory.length > 34) {
            listeningHistory.shift()
        }

        listeningHistory.push(currentTrackPos)

        this.setState({ listeningHistory })
    }

    preventAll(e) {
        e.preventDefault()
        e.stopPropagation()
    }

    render () {

        if (this.props.listeningHistory.length === 0) {
            return null
        }

        let history = extend(true, [], this.props.listeningHistory).reverse()

        let list = history.map((trackPos, key) => {

            let track = this.props.loadedTracks[trackPos]

            return (
                <li key={key} onClick={this.props.selectTrack.bind(this, trackPos)}>
                    <img src={track.artwork} alt="" />
                </li>
            )
        })

        return (
            <ul className="history" onMouseMove={this.preventAll.bind(this)}>
                {list}
            </ul>
        )
    }
}
