import React from 'react'

function Background(props) {

    let image = null

    if (!!props.track) {
        image =  <img src={props.track.artwork} className="artwork" alt="" />
    }

    return (
        <div id="background" onClick={props.playCurrentShown} onWheel={props.setVolume}>

            {props.children}

            {image}
        </div>
    )
}

export default Background
