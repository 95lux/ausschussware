import React from 'react'


const userId = 288554452; // user_id of Ausschu$$war€
const clientId = 'LPqZxMy7VDZTQ0w9g4fuCdMNflDZEdIs' // client_id of Ausschu$$war€
//       client_id=ssV1Qfh3hGcBHMcuZ3bz3xHb3aoP5KUB
var tracks = [];
var precached = [{
    id: 335383636,
    stream: 'https://api.soundcloud.com/tracks/335383636/stream?'+clientId,
    artwork: 'https://i1.sndcdn.com/avatars-000684564896-2q8pvk-t500x500.jpg'
}];
var net = true;
var tracksLength = 0;




class Tracks extends React.Component {

    state = {
        currentTrack: {}
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
        if (nextUrl == undefined) {
            tracksLength = tracksLength + tracksFetched.length -1;
            this.shuffleArray(tracks)

            // delete duplicates from tracks[]
            const uniqueSet = new Set(tracks);
            tracks = [...uniqueSet];

            return;
        } else {
            tracksLength = tracksLength + 50;
            console.log(tracksFetched);
            this.loadFullData(nextUrl)
        }
    }

    componentDidMount() {
        let url = `https://api.soundcloud.com/users/${userId}/tracks?client_id=${clientId}&linked_partitioning=1&limit=50`
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

    changeTrack() {
        // let newTrack = this.state.tracks[Math.floor(Math.random() * this.state.tracks.length)];
        let newTrack = precached[Math.floor(Math.random() * precached.length)];

        if (net) {
            this.setState(prevState => ({
                currentTrack: newTrack
            }));
        // AUDIO FETCH
            net = false
        } else {
            net = true
        }
        this.preloadTracks()
    }

    // preloadTracks(i) {
    //     i = i || 0;
    //     if (precached.length == tracks.length) {
    //         return;
    //     }
    //     if (i <= 5) {
    //         var img = new Image ();
    //
    //         // img.onload = () => {
    //         //     this.preloadTracks(i + 1);
    //         // }
    //         let newPrecached = tracks[Math.floor(Math.random() * tracks.length)];
    //         if (precached.some(e => e.id === newPrecached.id) === true) {
    //             this.preloadTracks(i + 1);
    //             return;
    //         } else {
    //             img.src = newPrecached.artwork;
    //             precached.push(newPrecached);
    //         }
    //         console.log(precached.length);
    //         console.log(tracks.length);
    //         // console.log(precached);
    //     }
    // }

    preloadTracks(i) {
        i = i || 0;

        if (precached.length === tracks.length) {
            return;
        }
        if (i <= 5) {
            var img = new Image ();

            // img.onload = () => {
            //     this.preloadTracks(i + 1);
            // }

            let newPrecached = tracks[Math.floor(Math.random() * tracks.length)];
            if (precached.some(e => e.id === newPrecached.id) === true) {
                this.preloadTracks(i + 1);
                return;
            } else {
                img.src = newPrecached.artwork;
                precached.push(newPrecached);
            }
            console.log('precache[]'+precached.length);
            console.log('tracks[]'+tracks.length);
            // console.log(precached);
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }


    playPause() {
        var audioElement = new Audio(this.state.currentTrack.stream);
        console.log(this.state.currentTrack.stream);
        audioElement.play();
    }

    render () {
        return (
            <div style={bgStyle}>
                <div onClick={this.playPause.bind(this)} onMouseMove={this.changeTrack.bind(this)} onTouchMove={this.changeTrack.bind(this)} style={ sectionStyle }>
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
