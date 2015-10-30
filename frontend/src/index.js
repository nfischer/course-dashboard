import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import * as WEBAPI from './utils/webapi.js';

import Application from './application.js';

ReactDOM.render(
  <Application/>,
  document.getElementById('appArea')
);

global.$ = $;
global.WEBAPI = WEBAPI;
