import React, { Component } from 'react'
import axios from 'axios'
import extend from 'extend'

import Track from './Track.js'
import History from './history.js'
import Touchpad from './touchpad.js'

const userID = '288554452'
const clientID = 'jMtgnPXQjVKtkucQ61iCf5jKyDXGXxbS'

var bgStyle = {
    width: "100vw",
    height: "100vh",
    backgroundColor: 'black'
}

var imageStyle = {
    width: "100vw",
    height: "100vh",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    position: 'center',
    pointerEvents: 'none',
    userSelect: 'none',
    backgroundColor: 'slateblue'
};

export default class Tracks extends Component {

    state = {
        volume: 0.8,
        tracks: [],
        loadedTracks: [],
        listeningHistory: [],
        currentShownPos: null,
        currentTrackPos: null,
        lastTrackPos: null
    }

    componentDidMount() {
        let url = `https://api.soundcloud.com/users/${userID}/tracks?client_id=${clientID}&linked_partitioning=1`

        this.loadFullData(url)
    }

    normalizeAndLoadTrack(track) {

        let artwork = track.artwork_url
            ? track.artwork_url
            : track.user.avatar_url

        artwork = artwork.replace("large", "t500x500")

        let data = {
            artwork,
            id: track.id
        }

        let img = new Image()
        img.src = data.artwork

        // add image to array if data preloaded
        img.onload = () => {
            let loadedTracks = this.state.loadedTracks

            loadedTracks.push(data)

            this.setState({ loadedTracks })
        }

        return data
    }

    async loadFullData(url) {
        try {
            let { data } = await axios.get(url)

            let tracks = this.state.tracks

            for (let track of data.collection) {

                let data = this.normalizeAndLoadTrack(track)
                tracks.push(new Track(data))
            }

            this.setState({ tracks })

            if (data.hasOwnProperty('next_href')) {
                this.loadFullData(data.next_href)
            }

        } catch (error) {
            console.log(error)
        }
    }

    changeTrack() {

        // 2 each seconds, 3 each third, 4 each fourth
        const reactOnZero = +new Date() % 2

        if (reactOnZero !== 0) {
            return null
        }

        let currentShownPos = Math.floor(Math.random() * this.state.loadedTracks.length)

        this.setState({ currentShownPos })
    }

    play(currentTrackPos = 0) {

        let lastTrackPos = null

        // stop last track
        if (this.state.lastTrackPos !== null) {
            this.state.tracks[this.state.lastTrackPos].stop()
        }

        this.state.tracks[currentTrackPos].play(this.state.volume)
        lastTrackPos = currentTrackPos

        this.setState({ lastTrackPos, currentTrackPos })
    }

    selectTrack(currentTrackPos = 0, e) {
        e.preventDefault()
        e.stopPropagation()
        this.play(currentTrackPos)

        this.setState({
            currentShownPos: currentTrackPos
        })
    }

    pushToHistory(currentTrackPos) {
        let listeningHistory = this.state.listeningHistory

        // buffer overflow remove oldest from history
        if (listeningHistory.length > 34) {
            listeningHistory.shift()
        }

        listeningHistory.push(currentTrackPos)

        this.setState({ listeningHistory })
    }

    onScroll(e) {
        e.preventDefault()
        e.stopPropagation()

        let changeCount = -(Math.sign(e.deltaY) / 80)


        let volume = this.state.volume

        volume += changeCount

        if (volume < 0) {
            volume = 0
        }

        if (volume > 1) {
            volume = 1
        }

        try {
            this.state.tracks[this.state.currentTrackPos].setVolume(volume)
        } catch(e) {

        }

        this.setState({ volume })
    }

    getHistory() {

        if (this.state.listeningHistory.length === 0) {
            return null
        }

        let history = extend(true, [], this.state.listeningHistory).reverse()

        let list = history.map((trackPos, key) => {

            let track = this.state.loadedTracks[trackPos]

            return (
                <li key={key} onClick={this.selectTrack.bind(this, trackPos)}>
                    <img src={track.artwork} alt="" />
                </li>
            )
        })

        return (
            <ul class="history" onMouseMove={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}>
                {list}
            </ul>
        )
    }

    playCurrentShown() {
        this.play(this.state.currentShownPos)
        this.pushToHistory(this.state.currentShownPos)
    }

    getImage() {

        if (!this.state.currentShownPos) {
            return null
        }

        let track = this.state.loadedTracks[this.state.currentShownPos]
        return <img src={track.artwork} style={imageStyle} alt="" />
    }

    render () {

        let style = {
            height: this.state.volume * 100 + '%'
        }

        return (
            <div id="area" style={bgStyle}
                onClick={this.playCurrentShown.bind(this)}
                onWheel={this.onScroll.bind(this)}
            >
                <Touchpad changeTrack={this.changeTrack.bind(this)}>
                    <div className="volume">
                        <i style={style} />
                    </div>
                </Touchpad>

                <History
                    selectTrack={this.selectTrack.bind(this)}
                    loadedTracks={this.state.loadedTracks}
                    listeningHistory={this.state.listeningHistory}
                />

                {this.getImage()}
            </div>
        )
    }
}
