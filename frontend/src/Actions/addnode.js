import Action from './action.js';
import dispatcher from '../dispatcher.js';
import Node from '../Models/node.js';

class AddNode extends Action {
  constructor(node: Node){
    super("expandWeek", node);
  }
}

export default function addNode(node, title, markdown, renderer){
  WebAPI.addNewChild(this.props.node, title, markdown, "Resource", (node) => {
    let action = new ExpandWeek(node);
    dispatcher.dispatch(action);
  });
}
