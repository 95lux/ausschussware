import React, { Component } from 'react'
import axios from 'axios'
import extend from 'extend'

import Track from './Track.js'

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

    selectTrack() {

        clearTimeout(this.delayer)

        this.play(this.state.currentShownPos)

    }

    play(currentTrackPos = 0) {

        let lastTrackPos = this.state.currentTrackPos

        if (!!lastTrackPos) {
            this.state.tracks[lastTrackPos].stop()
        } else {
            lastTrackPos = this.state.currentShownPos
        }

        let listeningHistory = this.state.listeningHistory

        if (listeningHistory.length > 34) {
            listeningHistory.shift()
        }

        listeningHistory.push(currentTrackPos)

        this.state.tracks[currentTrackPos].play(this.state.volume)

        this.setState({ lastTrackPos, currentTrackPos, listeningHistory })
    }

    onScroll(e) {
        e.preventDefault()
        e.stopPropagation()

        let changeCount = Math.sign(e.deltaY) / 10

        console.log(changeCount)
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
                <li key={key} onClick={this.play.bind(this, trackPos)}>
                    <img src={track.artwork} alt="" />
                </li>
            )
        })

        return (
            <ul class="history">
                {list}
            </ul>
        )
    }

    playCurrentShown() {
        this.play(this.state.currentShownPos)
    }

    getImage() {

        if (!this.state.currentShownPos) {
            return null
        }

        let track = this.state.loadedTracks[this.state.currentShownPos]
        return <img src={track.artwork} style={imageStyle} alt="" />
    }

    render () {

        return (
            <div id="area" style={bgStyle}
                onClick={this.playCurrentShown.bind(this)}
                onWheel={this.onScroll.bind(this)}
                onMouseMove={this.changeTrack.bind(this)}
                onTouchStart={this.changeTrack.bind(this)}
                onTouchMove={this.changeTrack.bind(this)}
            >
                {this.getHistory()}
                {this.getImage()}
            </div>
        )
    }
}
