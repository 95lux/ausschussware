import React, { Component } from 'react'
import axios from 'axios'
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
    backgroundColor: 'slateblue'
};

export default class Tracks extends Component {

    state = {
        volume: 0.8,
        tracks: [],
        loadedTracks: [],
        currentShownPos: null,
        currentTrackPos: null,
        lastTrackPos: null,
        interacted: false // chrome wants user interaction before playing audio
    }

    delayer = null

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

        if (this.state.interacted) {
            clearTimeout(this.delayer)

            this.delayer = setTimeout(this.selectTrack.bind(this), 300)
        }
    }

    selectTrack() {

        clearTimeout(this.delayer)

        let lastTrackPos = this.state.currentTrackPos
        let currentTrackPos = this.state.currentShownPos

        if (!!lastTrackPos) {
            this.state.tracks[lastTrackPos].stop()
        } else {
            lastTrackPos = this.state.currentShownPos
        }

        this.state.tracks[currentTrackPos].play(this.state.volume)

        this.setState({ lastTrackPos, currentTrackPos })

    }

    onScroll(e) {
        e.preventDefault()
        e.stopPropagation()
        let changeCount = Math.sign(e.deltaY) / 100

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

    interacted() {
        this.setState({
            interacted: true
        })
    }

    getImage() {

        if (!this.state.currentTrackPos) {
            return null
        }

        let track = this.state.loadedTracks[this.state.currentShownPos]
        return <img src={track.artwork} style={imageStyle} alt="" />
    }

    render () {

        return (
            <div id="area" style={bgStyle}
                onClick={this.interacted.bind(this)}
                onWheel={this.onScroll.bind(this)}
                onMouseMove={this.changeTrack.bind(this)}
                onTouchStart={this.changeTrack.bind(this)}
                onTouchMove={this.changeTrack.bind(this)}
            >
                {this.getImage()}
            </div>
        )
    }
}
