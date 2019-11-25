import React from 'react'

var tracks = [];
var nextUrl = '';
var net = true;
// var userId = 288554452; // user_id of Ausschu$$war€
// var clientId = 'LPqZxMy7VDZTQ0w9g4fuCdMNflDZEdIs&' // client_id of Ausschu$$war€

class Tracks extends React.Component {

    state = {
        tracks: [],
        currentTrack: {}
    }

    async loadData() {
        let responses = await fetch('https://api.soundcloud.com/users/288554452/tracks?client_id=LPqZxMy7VDZTQ0w9g4fuCdMNflDZEdIs')
        .then(res => res.json())
            .then(data => {
                let tracksFetched = data.map(function(track) {
                    let artworkSmall = track.artwork_url
                    if (artworkSmall == null) {
                        artworkSmall = track.user.avatar_url
                    }
                    let artworkBig = artworkSmall.replace("large", "t500x500");
                    return {
                        id: track.id,
                        stream: track.stream_url,
                        artwork: artworkBig
                    }
                })

                tracks = tracks.concat(tracksFetched);
            })

    }

    async loadFullData(url) {
        let responses = await fetch(url)
        .then(res => res.json())
            .then(data => {
                let tracksFetched = data.collection.map(function(track) {
                    let artworkSmall = track.artwork_url
                    if (artworkSmall == null) {
                        artworkSmall = track.user.avatar_url
                    }
                    let artworkBig = artworkSmall.replace("large", "t500x500");
                    return {
                        id: track.id,
                        stream: track.stream_url,
                        artwork: artworkBig
                    }
                })

                tracks = tracks.concat(tracksFetched);

                nextUrl = data.next_href;
            })
        this.loadFullData(nextUrl)
    }


    componentDidMount() {
        let url = 'https://api.soundcloud.com/users/288554452/tracks?client_id=LPqZxMy7VDZTQ0w9g4fuCdMNflDZEdIs&linked_partitioning=1'
        // this.loadData();
        this.loadFullData(url);

    }

    changeTrack() {
        // let newTrack = this.state.tracks[Math.floor(Math.random() * this.state.tracks.length)];
        let newTrack = tracks[Math.floor(Math.random() * tracks.length)];

        if (net) {
            this.setState(prevState => ({
                currentTrack: newTrack
            }));
            net = false
        } else {
            net = true
        }


        // console.log(newTrack.artwork);
    }

    render () {
        return (
            <div style={bgStyle}>
                <div onMouseMove={this.changeTrack.bind(this)} onTouchMove={this.changeTrack.bind(this)} style={ sectionStyle }>
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
