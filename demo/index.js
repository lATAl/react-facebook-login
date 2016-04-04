'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from '../src/facebook';

const responseFacebook = (response) => {
  console.log(response);
}

ReactDOM.render(
  <FacebookLogin
    appId="1733556690196497"
    autoLoad={false}
    callback={responseFacebook} />,
  document.getElementById('demo')
);
