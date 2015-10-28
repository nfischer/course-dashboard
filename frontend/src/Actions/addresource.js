/* @flow */
import Action from './action.js';
import dispatcher from '../dispatcher.js';
import Node from '../Models/node.js';

class AddResource extends Action {
  constructor(parentId: string, tag: string, contents: string){
    super("addResource", {parentId, tag, contents});
  }
}

export default function addResource(parentId: string, tag: string, contents: string){
  //create node for contents via ajax
  //edit parent to point to new child using tag
  //trigger rerender
}
