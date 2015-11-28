import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import * as http from 'stream-http';

import * as WEBAPI from './utils/webapi.js';

import Application from './application.js';
import error from './Actions/error.js';


ReactDOM.render(
  <Application/>,
  document.getElementById('appArea')
);

window.onerror = function(err){
  console.error("GLOBAL ERROR", err);
  error(err.toString());
}

global.$ = $;
global.WEBAPI = WEBAPI;
global.HTTP = http;
