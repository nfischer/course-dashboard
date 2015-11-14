import Action from './action.js';
import dispatcher from '../dispatcher.js';
import Node from '../Models/node.js';
import * as WebAPI from '../utils/webapi.js'

class UpdateParentAndChild extends Action {
  constructor(child: Node, parent: Node){
    super("updateParentAndChild", {
      child,
      parent
    });
  }
}

export default function updateParentAndChild(child: Node, parent: Node){
  let action = new UpdateParentAndChild(child, parent);
  dispatcher.dispatch(action);
}
