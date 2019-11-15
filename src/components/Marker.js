// Modified from: https://css-tricks.com/creating-animations-using-react-spring/

import React from 'react'
// import PropTypes from 'prop-types'
import {Trail} from 'react-spring/renderprops'

class Marker extends React.Component {
    state = {
        coords: [
            {
                x: 10,
                y: 10,
                id: 1
            }
        ]
    };

    storeCoordinate(xVal, yVal, idVal) {
        let updatedCoords = this.state.coords.concat(
            {
                x: xVal,
                y: yVal,
                id: idVal
            }
        );

        this.setState((prevState) => ({ coords:updatedCoords }));


    }

    componentDidMount() {
        this.storeCoordinate(20, 20, 2);
        this.storeCoordinate(30, 30, 3);
        this.storeCoordinate(40, 40, 4);
    }

    render() {
        const { coords } = this.state;
        const styles = {
            container: {
                // position: 'absolute',
                // left: {coords.x},
                // top: {coords.y},
                // background: 'steelblue',
                // width: '20px',
                // height: '20px',
                // borderRadius: '50%'

            }}
            console.log(this.state.coords);
        return (
            <div>
                <Trail
                    items={coords}
                    keys={coords => coords.id}
                    from={{
                        opacity: 0,
                        transform: 'scale(4)',
                        background: 'steelblue',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%'
                    }}
                    to={{
                        opacity: 1,
                        transform: 'scale(1)'
                    }}
                >
                {coords => props => (
                    // <div style={styles.container} className="circle">
                    <div style={props} className="circle">
                    </div>
                )}
          </Trail>
          </div>
        );
    }
}


export default Marker;
