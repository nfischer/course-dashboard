import Action from './action.js';
import dispatcher from '../dispatcher.js';
import Node from '../Models/node.js';

class ExpandWeek extends Action {
  constructor(tag: string){
    super("expandWeek", tag);
  }
}

export default function expandWeek(tag: string){
  let action = new ExpandWeek(tag);
  dispatcher.dispatch(action);
}
