import Action from './action.js';
import dispatcher from '../dispatcher.js';
import Node from '../Models/node.js';
import * as WebAPI from '../utils/webapi.js'

class AddNode extends Action {
  constructor(parent: Node, title: string, markdown: string, renderer: string){
    super("addNode", {
      parent,
      title,
      markdown,
      renderer
    });
  }
}

export default function addNode(parent: Node, title: string,
                                markdown: string, renderer: string){
  let action = new AddNode(parent, title, markdown, renderer);
  dispatcher.dispatch(action);
}
