import React, { Component } from 'react'
import axios from 'axios'

import AudioWare from '../controller/audio.js'

import History from './History.js'
import Touchpad from './Touchpad.js'
import VolumeDisplay from './VolumeDisplay.js'
import Background from './Background.js'

const userID = '288554452'
const clientID = 'jMtgnPXQjVKtkucQ61iCf5jKyDXGXxbS'

export default class Tracks extends Component {

    state = {
        volume: 0.8,
        loadedTracks: [],
        listeningHistory: [],
        queue: [],
        currentShownPos: null,
        currentTrackPos: null
    }

    constructor(props) {
        super(props)

        this.audio = new AudioWare({}, this.playNext.bind(this))
    }

    componentDidMount() {
        let url = `https://api.soundcloud.com/users/${userID}/tracks?client_id=${clientID}&linked_partitioning=1`

        this.loadFullData(url)
    }

    normalizeAndLoadTrack(track) {

        let artwork = track.artwork_url
            ? track.artwork_url
            : track.user.avatar_url

        artwork = artwork.replace('large', 't500x500')

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

            for (let track of data.collection) {
                this.normalizeAndLoadTrack(track)
            }

            if (data.hasOwnProperty('next_href')) {
                this.loadFullData(data.next_href)
            }

        } catch (error) {
            console.log(error)
        }
    }

    getRandomTrack() {
        let currentShownPos = Math.floor(Math.random() * this.state.loadedTracks.length)

        return currentShownPos
    }

    showRandomTrack() {

        // 2 each seconds, 3 each third, 4 each fourth
        const reactOnZero = +new Date() % 2

        if (reactOnZero !== 0) {
            return null
        }

        let currentShownPos = this.getRandomTrack()

        this.setState({ currentShownPos })
    }

    showCurrentSelectedTrack() {
        let currentShownPos = this.state.currentTrackPos
        this.setState({ currentShownPos })
    }

    play(currentTrackPos = 0) {

        this.audio.play(this.state.loadedTracks[currentTrackPos].id)

        this.setState({ currentTrackPos })
    }

    selectTrack(currentTrackPos = 0, e) {
        e.preventDefault()
        e.stopPropagation()

        if (this.state.currentShownPos === currentTrackPos) {
            return null
        }

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
        let changeCount = -(Math.sign(e.deltaY) / 80)


        let volume = this.state.volume

        volume += changeCount

        if (volume < 0) {
            volume = 0
        }

        if (volume > 1) {
            volume = 1
        }

        this.audio.setVolume(volume)

        this.setState({ volume })
    }

    playNext() {

        let nextTrack = this.getRandomTrack()

        /* play track from queue if not empty */
        if (this.state.queue.length > 0) {

            let queue = this.state.queue
            nextTrack = queue[0]

            queue.shift()

            this.setState({ queue })
        }

        this.play(nextTrack)

        this.pushToHistory(nextTrack)
    }

    playCurrentShown() {

        if (!this.state.currentShownPos) {
            return null
        }

        if (this.state.listeningHistory.length > 0 && this.state.listeningHistory[this.state.listeningHistory.length - 1] === this.state.currentShownPos) {
            return null
        }

        this.play(this.state.currentShownPos)
        this.pushToHistory(this.state.currentShownPos)
    }

    render () {

        return (
            <Background
                setVolume={this.onScroll.bind(this)}
                playCurrentShown={this.playCurrentShown.bind(this)}
                track={this.state.loadedTracks[this.state.currentShownPos]}
            >

                <Touchpad
                    changeTrack={this.showRandomTrack.bind(this)}
                    setToCurrent={this.showCurrentSelectedTrack.bind(this)}
                >
                    <VolumeDisplay volume={this.state.volume} />
                </Touchpad>

                <History
                    selectTrack={this.selectTrack.bind(this)}
                    loadedTracks={this.state.loadedTracks}
                    listeningHistory={this.state.listeningHistory}
                />

            </Background>
        )
    }
}
