/* @flow */
import Action from './action.js';
import dispatcher from '../dispatcher.js';

class Open extends Action{
  constructor(data: Object){
    super("open", data);
  }
}

export default function open(data: Object) : void {
  let action = new Open(data);
  dispatcher.dispatch(action);
}
