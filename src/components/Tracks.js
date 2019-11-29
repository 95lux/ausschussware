import React from 'react'
import Audioplayer from './Audioplayer'

const userId = 288554452; // user_id of Ausschu$$war€
// const clientId = 'LPqZxMy7VDZTQ0w9g4fuCdMNflDZEdIs' // client_id of Ausschu$$war€
const clientId='jMtgnPXQjVKtkucQ61iCf5jKyDXGXxbS'
var tracks = [];
var images = [];
var precached = [{
    id: 335383636,
    stream: 'https://api.soundcloud.com/tracks/335383636/stream?'+clientId,
    artwork: 'https://i1.sndcdn.com/avatars-000684564896-2q8pvk-t500x500.jpg',
    title: 'wasgeht'
}];
var net = true;
var tracksLength = null;




class Tracks extends React.Component {

    state = {
        currentTrack: {
            id: null,
            stream: '',
            artwork: '',
            title: ''
        }
    }

    async loadFullData(url) {
        let responses = await fetch(url)
        let data = await responses.json()
        let tracksFetched = data.collection.map(function(track) {
            let artworkSmall = track.artwork_url
            let streamUrl = track.stream_url + '?' + clientId
            if (artworkSmall == null) {
                artworkSmall = track.user.avatar_url
            }
            let artworkBig = artworkSmall.replace("large", "t500x500");
            return {
                id: track.id,
                stream: streamUrl,
                artwork: artworkBig,
                title: track.title
            }
        })

        tracks = tracks.concat(tracksFetched);

        let nextUrl = data.next_href;
        console.log(nextUrl);
        if (nextUrl === undefined) {
            tracks = Array.from(new Set(tracks.map(track => track.id)))
                .map(id => {
                    return tracks.find(a => a.id === id)
                })
            this.shuffleArray(tracks)

            tracksLength = tracks.length
            this.initialPreload();
            // console.log(tracksLength);
            // console.log(tracks);
            return;
        } else {
            this.loadFullData(nextUrl)
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    initialPreload(i) {
            i = i || 0;
            if (i <= tracksLength-1) {
                let newPrecached = tracks[i];
                images[i] = new Image();
                images[i].src = newPrecached.artwork;
                precached.push(newPrecached);
                images[i].onload = () => {
                    this.initialPreload(i+1);
                }
            } else {
                console.log(precached);
            }
    }

    componentDidMount() {
        let url = `https://api.soundcloud.com/users/${userId}/tracks?client_id=${clientId}&linked_partitioning=1&limit=200`
        this.loadFullData(url);

        this.setState(prevState => ({
            currentTrack: {
                id: 1,
                stream: null,
                artwork: 'https://i1.sndcdn.com/avatars-000684564896-2q8pvk-t500x500.jpg'
            }
        }));

        // this.changeTrack();
    }

    changeTrack = () => {
        // let newTrack = this.state.tracks[Math.floor(Math.random() * this.state.tracks.length)];
        let newTrack = precached[Math.floor(Math.random() * precached.length)];

        if (net) {
            this.setState(prevState => ({
                currentTrack: newTrack
            }));

            net = false
        } else {
            net = true
        }
    }

    playPause = () => {
        let audio = new Audio(this.state.currentTrack.stream);
        this.setState(prevState =>({
            playing: !this.state.playing
        }), () => {
            this.state.playing ? audio.play() : audio.pause();
        })
    }

    render () {
        const { playing } = this.state;
        return (
            <div style={bgStyle}>
                <div onClick={this.playPause} onMouseMove={this.changeTrack} onTouchMove={this.changeTrack} style={ sectionStyle }>
                    <img src={this.state.currentTrack.artwork} style={sectionStyle}></img>
                </div>
            </div>
        )
    }
}

var sectionStyle = {
    // backgroundImage: "url(" + backgroundUrl + ")",
    width: "100vw",
    height: "100vh",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    position: 'center',
    backgroundColor: 'slateblue'
};

var bgStyle = {
    width: "100vw",
    height: "100vh",
    backgroundColor: 'black'
}


export default Tracks;
