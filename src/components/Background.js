import React from 'react'


var backgrounds = new Array(

)

var i = 0;

var backgroundUrl


// import all images from "../images" into react (needed for webpack) and saves into array images[]. Access through images[index]
const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));


function importAll(r) {
    return r.keys().map(r);
}


  var userId = 288554452; // user_id of Ausschu$$war€
  var clientId = 'LPqZxMy7VDZTQ0w9g4fuCdMNflDZEdIs&' // client_id of Ausschu$$war€

class Background extends React.Component {

    state = {
        tracks: [],
        imageState: false
    }

    componentDidMount() {
        fetch('https://api.soundcloud.com/users/288554452/tracks?client_id=LPqZxMy7VDZTQ0w9g4fuCdMNflDZEdIs')
        .then(res => res.json())
        .then(data => {
            let tracksNew = data.map(function(track) {
                return {
                    id: track.id,
                    stream: track.stream_url,
                    artwork: track.artwork_url
                }
            })

            this.setState(prevState => ({
                tracks: tracksNew
            }));
        })
        console.log(this.state);

    }

    changeBg() {

        this.setState(prevState => ({
            imageState: !prevState.imageState
        }));

        // cycle through images[]

        if(i <= images.length){
            if(i > 0){
                backgroundUrl = images[i-1];
            }
            i++;
        } else {
            i = 0;
            backgroundUrl = images[i];
        }

        // select random element from images[]

        backgroundUrl = images[Math.floor(Math.random() * images.length)];
    }

    render () {
        return (
            <div onMouseMove={this.changeBg.bind(this)} onTouchMove={this.changeBg.bind(this)} style={ sectionStyle }>
                <img src={backgroundUrl} style={sectionStyle}></img>
            </div>
        )
    }
}

var sectionStyle = {
    // backgroundImage: "url(" + backgroundUrl + ")",
    width: "400px",
    height: "400px",
    // backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backGroundPosition: 'center'
};


export default Background;
