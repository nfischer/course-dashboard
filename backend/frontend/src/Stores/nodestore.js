/* @flow */
import { ReduceStore } from 'flux/utils';
import { Dispatcher } from 'flux';
import { Map } from 'immutable';

import Action from '../Actions/action.js';
import Node from '../Models/node.js';
import dispatcher from '../dispatcher.js';
import * as WebAPI from '../utils/webapi.js';

import updateParentAndChild from '../Actions/updateparentandchild.js';

//add to NodeStoreState by appending to map
class NodeStoreState {
  rootId: string;
  nodes: Map<string, Node>;

  constructor(rootId: string){
    this.rootId = rootId;
    this.nodes = new Map();
  }
}

var nextSpoofedId = -1;

//this store contains the internal representation of all nodes in use by the frontend.
//the tree/graph can be traversed by starting at a root and looking up children in the map of id->node.
class NodeStore extends ReduceStore<?NodeStoreState> {

  getInitialState() : ?NodeStoreState {
    return null;
  }

  __invokeOnDispatch(payload: Action){
    super.__invokeOnDispatch(payload);
  }

  reduce(state: ?LayerStoreState, action: Action) : ?NodeStoreState { //TODO: make the state enforcably immutable
    let newState;

    switch(action.name){
    case "open":
      //handle creation of tree given data format from server
      newState = state || new NodeStoreState(action.data.rootId);//Object.assign({}, state);
      action.data.nodes.forEach(node => {
        node.id = (typeof node.id === "string") ? node.id : node.id.toString();
        newState.nodes = newState.nodes.set(node.id, new Node(node));
      });

      return newState;
    case "addNode":
      //we keep the store internally consistent using a spoofed id, which is resolved
      // once the request to update the backend goes through
      let newNode = new Node({
        id: (nextSpoofedId--).toString(),
        contents: action.data.markdown,
        renderer: action.data.renderer,
        children: {}
      });

      let newParent = Object.assign({}, action.data.parent);
      newParent.children[action.data.title] = newNode.id;

      newState = new NodeStoreState(state.rootId);
      newState.nodes = state.nodes.set(newNode.id, newNode);
      newState.nodes = newState.nodes.set(newParent.id, newParent);

      WebAPI.addNewChild(newParent, newNode, (initializedChild, updatedParent) => {
        updateParentAndChild(initializedChild, updatedParent);
      });
      return newState;
    case "updateParentAndChild": //this resolves the spoofed ID issues introduced in add
      newState = new NodeStoreState(state.rootId);
      newState.nodes = state.nodes.set(action.data.child.id, action.data.child);
      newState.nodes = newState.nodes.set(action.data.parent.id, action.data.parent);

      return newState;
    case "editNode":
      let editedNode = action.data;
      newState = new NodeStoreState(state.rootId);
      newState.nodes = state.nodes.set(editedNode.id, editedNode);

      WebAPI.editNode(editedNode, ()=>{});
      return newState;
    case "removeNode":
      let nodeToRemove = action.data;
      nodeToRemove.id = (typeof nodeToRemove.id === "string") ? nodeToRemove.id : nodeToRemove.id.toString();
      newState = new NodeStoreState(state.rootId);
      // delete node
      newState.nodes = state.nodes.delete(nodeToRemove.id);

      // modify parent nodes to no longer point to deleted node
      let parents = [];
      newState.nodes.forEach(node => {
        let wasModified = false;
        let name;
        for (name in node.children) {
          if (node.children.hasOwnProperty(name) && node.children[name] === nodeToRemove.id) {
            delete node.children[name];
            wasModified = true;
          }
        }
        if (wasModified) {
          parents.push(node);
        }
      });

      WebAPI.removeNode(nodeToRemove, parents, () => {});
      return newState;
    } //end of switch statement

    return state;
  }
}

var nodeStore = new NodeStore(dispatcher);
export default nodeStore;
