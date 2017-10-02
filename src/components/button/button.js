import React, { Component } from 'react';

import styles from './button.css'

class Button extends Component {
    render() {
        const { text, handleClick } = this.props;
        return (
            <div>
                <p>{ text }</p>
                <div className={ ['Button', this.props.active && 'Active', !!this.props.isLoading && 'Loading'].join(' ') } onClick={ handleClick }>

                    <button style={ { color: '#FFF' } }></button>
                </div>
            </div>
        );
    }
}

export default Button;
