import Action from './action.js';
import dispatcher from '../dispatcher.js';
import Node from '../Models/node.js';
import * as WebAPI from '../utils/webapi.js';

class EditNode extends Action {
  constructor(node: Node){
    super("editNode", node);
  }
}

export default function editNode(node, markdown, renderer, children){
  WebAPI.editNode(node, markdown, renderer, children, (node) => {
    let action = new EditNode(node);
    dispatcher.dispatch(action);
  });
}