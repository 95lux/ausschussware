import React from 'react'
// import PropTypes from 'prop-types'
import {Spring} from 'react-spring/renderprops'

class Component1 extends React.Component {
    render () {
        return (
            <Spring
                from={{ opacity: 0 }}
                to={{ opacity: 1 }}>
                { props=> (
                    <div style={props}>
                        <div style={c1Style}>
                            <h1>Component1</h1>
                        </div>
                    </div>
                )}
            </Spring>

        )
    }
}

export default Component1;

const c1Style = {
    background: 'steelblue',
    color: 'white',
    padding: '1.5rem'
}
