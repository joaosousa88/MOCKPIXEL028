import React from 'react';

// Styles
import styles from './Welcome.css';

const Welcome = ({ name }) => (
    <div className="welcome">
        Good mornig, <br/><span className="welcome-name">{ name }</span>
    </div>
);

export default Welcome;
