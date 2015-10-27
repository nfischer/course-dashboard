/* @flow */
import Action from './action.js';
import dispatcher from '../dispatcher.js';

class Open extends Action{
  constructor(data: Object){
    super("open", data);
  }
}

export default function open(nodes, links) {
  let action = new Open({nodes, links});
  dispatcher.dispatch(action);
}
