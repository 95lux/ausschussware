// Modified from: https://css-tricks.com/creating-animations-using-react-spring/

import React from 'react'
// import PropTypes from 'prop-types'
import {Trail } from 'react-spring/renderprops'

class Marker extends React.Component {
    state = {
        coords: [
            {
                x: '200px',
                y: '200px',
                id: 0,
                link: 'https://www.google.com'
            },
            {
                y: '400px',
                x: '100px',
                id: 1,
                link: 'https://www.wikipedia.com'
            },
            {
                x: '600px',
                y: '600px',
                id: 2,
                link: 'https://www.sport.com'
            },
            {
                x: '850px',
                y: '800px',
                id: 3,
                link: 'https://www.test.com'
            },
            {
                x: '1500px',
                y: '200px',
                id: 4,
                link: 'https://www.google.com'
            }

        ]
    };

    // storeCoordinate(xVal, yVal, idVal) {
    //     let updatedCoords = this.state.coords.concat(
    //         {
    //             x: xVal,
    //             y: yVal,
    //             id: idVal
    //         }
    //     );
    //
    //     this.setState((prevState) => ({ coords:updatedCoords }));
    //
    //
    // }
    //
    // componentDidMount() {
    //     this.storeCoordinate(20, 20, 2);
    //     this.storeCoordinate(30, 30, 3);
    //     this.storeCoordinate(40, 40, 4);
    // }

    render() {
        const { coords } = this.state;
        return (
            <div>

             <Trail
                  items={coords}
                  keys={coords => coords.id}
                  from={{
                      opacity: 1,
                      // transform: 'perspective(100px) translate3d(20px, -50px, 200px)',
                      transform: 'scale(0)',
                      background: 'slateblue',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',


                  }}
                  to={{
                      opacity: 0,
                      transform: 'scale(3)'
                      // transform: 'perspective(100px) translate3d(0px, 0px, 0px)'
                  }}
                  config={{
                      delay: 800,
                      tension: 300,
                      friction: 80,
                  }}
              >
              {coords => props => (
                  <div style={{
                      left: coords.x,
                      top: coords.y,
                      position: 'absolute',
                      height: '20px',
                      width: '20px'


                  }} >
                      <div style={props}>
                      </div>
                  </div>
              )}
                </Trail>
                <Trail
                    items={coords}
                    keys={coords => coords.id}
                    from={{
                        opacity: 0,
                        // transform: 'perspective(100px) translate3d(20px, -50px, 200px)',
                        transform: 'scale(4)',
                        background: 'steelblue',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',


                    }}
                    to={{
                        opacity: 1,
                        transform: 'scale(1)'
                        // transform: 'perspective(100px) translate3d(0px, 0px, 0px)'
                    }}
                    config={{
                        delay: 500,
                        tension: 200,
                        friction: 15,
                    }}
                >
                {coords => props => (
                    <div style={{
                        left: coords.x,
                        top: coords.y,
                        position: 'absolute',
                        height: '20px',
                        width: '20px'


                    }} >
                        <div style={props} onClick={() => window.open(coords.link)}>

                        </div>
                    </div>
                )}
            </Trail>
          </div>
        );
    }
}


export default Marker;
