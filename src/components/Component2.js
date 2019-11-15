import React from 'react'
// import PropTypes from 'prop-types'
import {Trail} from 'react-spring/renderprops'

class Component2 extends React.Component {
    state = {
        coords: []
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
        this.storeCoordinate(3, 5, 1);
        this.storeCoordinate(19, 1000, 2);
        this.storeCoordinate(300, 578, 3);
    }

    render() {
        const { coords } = this.state;
        const styles = {
            container: {
                position: 'absolute',
                // left: {coords.x},
                // top: {coords.y},
                background: 'steelblue',
                width: '20px',
                height: '20px',
                borderRadius: '50%'
            }}
            console.log(this.state.coords);
        return (
            <div>
                <Trail
                    items={coords}
                    keys={coords => coords.id}
                    from={{opacity: 0, transform: 'scale(4)' }}
                    to={{opacity: 1, transform: 'scale(1)'}}
                >
                {coords => props => (
                    <div style={styles.container} className="circle">
                    </div>
                )}
          </Trail>
          </div>
        );
    }
}


export default Component2;
