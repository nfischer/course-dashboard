import Action from './action.js';
import dispatcher from '../dispatcher.js';
import Node from '../Models/node.js';
import * as WebAPI from '../utils/webapi.js';

class EditNode extends Action {
  constructor(node: Node){
    super("editNode", node);
  }
}

export default function editNode(node, markdown){
  let editedNode = new Node({
    id: node.id,
    contents: markdown,
    renderer: node.renderer,
    children: node.children
  });

  let action = new EditNode(editedNode);
  dispatcher.dispatch(action);
}
