import React from 'react'

function VolumeDisplay({ volume }) {

    let style = {
        height: volume * 100 + '%'
    }

    return (
        <div className="volume">
            <i style={style} />
        </div>
    )
}

export default VolumeDisplay
