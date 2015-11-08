import Action from './action.js';
import dispatcher from '../dispatcher.js';
import Node from '../Models/node.js';
import * as WebAPI from '../utils/webapi.js'

class EditNode extends Action {
  constructor(node: Node){
    super("editNode", node);
  }
}

export default function editNode(id, markdown, renderer){
  let newNode = new Node({id: id, contents: markdown, renderer: renderer});

  WebAPI.overwriteNode(newNode).then((data) => {
    let action = new EditNode(newNode);
    dispatcher.dispatch(action);
  });
}