/* @flow */
import Action from './action.js';
import dispatcher from '../dispatcher.js';

class Open extends Action{
  constructor(nodes: Object, links: Object){
    super("open", nodes, links);
  }
}

export default function open(nodes: Object, links: Object) : void {
  let action = new Open(nodes, links);
  dispatcher.dispatch(action);
}
