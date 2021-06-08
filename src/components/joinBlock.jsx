import React from 'react';
import socket from '../socket';

function JoinBlock() {
    return (<div className="main">
        <div className="wrap">
            <input type="text" className="input__text" />
            <input type="text" className="input__text" />
            <button className="btn__enter">Войти</button>
        </div>
    </div>);
}

export default JoinBlock;