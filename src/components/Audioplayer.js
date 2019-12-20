import React from 'react'

const clientID='jMtgnPXQjVKtkucQ61iCf5jKyDXGXxbS'



class Audioplayer extends React.Component {
    state =  {
        trackID: '',
        playing: false
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    // componentDidUpdate = (prevProps, prevState) => {
    //     if(this.state.trackID !== prevState.trackID && this.state.playing === false) {
    //         let trackID = this.state.trackID;
    //         let url = `https://api.soundcloud.com/tracks/${trackID}/stream?client_id=${clientID}`
    //         // console.log('play');
    //         this.player.src = url;
    //         this.player.play();
    //         // this.setState({
    //         //     playing: !prevState.playing
    //         // })
    //     } else if (this.state.playing === false) {
    //         this.player.pause();
    //     } else if (this.state.trackID === prevState.trackID) {
    //         this.player.play();
    //     }
    // }

    componentDidUpdate = (prevProps, prevState) => {

        if (this.state.trackID !== prevState.trackID && this.state.playing === true) {
            let trackID = this.state.trackID;
            let url = `https://api.soundcloud.com/tracks/${trackID}/stream?client_id=${clientID}`
            this.player.src = url;
            this.player.play();
        }

    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    playPauseAudio = (id) => {
        if (id !== this.state.trackID) {
            this.setState({
                trackID: id,
                playing: true
            });

        }

        if (this.state.playing && this.state.trackID === id) {
            this.player.pause();
            this.setState({ playing: false });
            this.player.pause();
        }

    }

    stopAudio = () => {
        this.player.pause();
        this.player.currentTime = 0;
        this.props.stopPlayback();
        this.setState({
            playing: false
        })
    }

    render () {
        return (
            <div>
                <audio
                    ref={ref => this.player = ref}
                    src={this.state.src}
                    onEnded={this.props.playNext}
                />
            </div>

        )
    }
}

export default Audioplayer;
