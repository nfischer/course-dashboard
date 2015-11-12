import Action from './action.js';
import dispatcher from '../dispatcher.js';
import Node from '../Models/node.js';
import * as WebAPI from '../utils/webapi.js';

class AddNode extends Action {
  constructor(node: Node){
    super("addNode", node);
  }
}

export default function addNode(node, title, markdown, renderer){
  WebAPI.addNewChild(node, title, markdown, renderer, (node) => {
    let action = new AddNode(node);
    dispatcher.dispatch(action);
  });
}
