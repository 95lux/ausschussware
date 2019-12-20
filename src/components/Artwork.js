import React from 'react'

class Artwork extends React.Component {
    state = {
        artwork: ''
    }

    componentDidUpdate(nextProps) {
        if (this.state.artwork === null) {
            this.setState({ artwork: 'https://i1.sndcdn.com/avatars-000684564896-2q8pvk-t500x500.jpg'})
        }
        if (nextProps.currentTrackArtwork !== this.state.artwork) {
            this.setState({ artwork: nextProps.currentTrackArtwork });
        }
    }
    render () {
        return(
            <img src={this.state.artwork} style={sectionStyle}></img>
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

export default Artwork;
