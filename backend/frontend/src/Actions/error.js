/* @flow */
import { Map } from 'immutable';

import Action from './action.js';
import dispatcher from '../dispatcher.js';

class Error extends Action{
  constructor(err: string){
    super("error", {err});
  }
}

export default function error(err: string) {
  let action = new Error(err);
  dispatcher.dispatch(action);
}
