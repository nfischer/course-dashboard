/* @flow */
import { ReduceStore } from 'flux/utils';
import { Dispatcher } from 'flux';
import { Map } from 'immutable';

import Action from '../Actions/action.js';
import Node from '../Models/node.js';
import dispatcher from '../dispatcher.js';
import * as WebAPI from '../utils/webapi.js';

//add to NodeStoreState by appending to map
class NodeStoreState {
  rootId: string;
  nodes: Map<string, Node>;

  constructor(rootId: string){
    this.rootId = rootId;
    this.nodes = new Map();
  }
}

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
      //TODO: insert created node into tree at appropriate place
      //parent node links are updated as a part of comitting changes to db
      let newNode = action.data;
      newNode.id = (typeof newNode.id === "string") ? newNode.id : newNode.id.toString();
      newState = new NodeStoreState(state.rootId);
      newState.nodes = state.nodes.set(newNode.id, newNode);

      return newState;
    case "editNode":
      let editedNode = action.data;
      editedNode.id = (typeof editedNode.id === "string") ? editedNode.id : editedNode.id.toString();
      newState = new NodeStoreState(state.rootId);
      newState.nodes = state.nodes.set(editedNode.id, editedNode);

      return newState;
    case "removeNode":
      let nodeToRemove = action.data;
      nodeToRemove.id = (typeof nodeToRemove.id === "string") ? nodeToRemove.id : nodeToRemove.id.toString();
      newState = new NodeStoreState(state.rootId);
      // delete node
      newState.nodes = state.nodes.delete(nodeToRemove.id);
      // modify parent nodes to no longer point to deleted node
      newState.nodes.forEach(node => {
        let wasModified = false;
        let name;
        for (name in node.children) {
          if (node.children.hasOwnProperty(name) && node.children[name] === nodeToRemove.id) {
            delete node.children[name];
            wasModified = true;
          }
        }
        if (wasModified === true) {
          WebAPI.editNode(node, node.contents, node.renderer, node.children, () => {});
        }
      });
      return newState;
    }

    return state;
  }
}

var nodeStore = new NodeStore(dispatcher);
export default nodeStore;
