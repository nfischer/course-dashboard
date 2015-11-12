import Action from './action.js';
import dispatcher from '../dispatcher.js';
import Node from '../Models/node.js';
import * as WebAPI from '../utils/webapi.js';

class RemoveNode extends Action {
  constructor(node: Node){
    super("removeNode", node);
  }
}

export default function removeNode(node){
  WebAPI.removeNode(node, (node) => {
    let action = new RemoveNode(node);
    dispatcher.dispatch(action);
  });
}