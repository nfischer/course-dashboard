/* @flow */
import { ReduceStore } from 'flux/utils';
import { Dispatcher } from 'flux';
import { Map } from 'immutable';

import Action from '../Actions/action.js';
import Node from '../Models/node.js';
import dispatcher from '../dispatcher.js';

/*

{
  node_id: "sjkahfkasdjfha",
  contents: "foo, bar",
  renderer: "Resource",
  children: {
    "tag": "lsdkjlkjslkfjasdlkfj",

  }
}

*/

//add to NodeStoreState by appending to map
class NodeStoreState {
  rootId: string;
  nodes: Map<string, string>;

  constructor(rootId: string){
    this.rootId = rootId;
    this.nodes = new Map();
  }
}

class NodeStore extends ReduceStore<?NodeStoreState> {

  getInitialState() : ?NodeStoreState {
    return null;
  }

  __invokeOnDispatch(payload: Action){
    super.__invokeOnDispatch(payload);
  }

  reduce(state: ?LayerStoreState, action: Action) : ?NodeStoreState {
    switch(action.name){
    case "open":
      //handle creation of tree given data format from server
      let newState = state || new NodeStoreState(action.data.rootId);//Object.assign({}, state);
      action.data.nodes.forEach(node => {
        newState.nodes = newState.nodes.set(node.id, new Node(node));
      });

      return newState;
    case "addNode":
      //TODO: insert created node into tree at appropriate place
      //parent node links are updated as a part of comitting changes to db
      let newNode = action.data;
      let newState = state;
      newState.nodes = newState.nodes.set(newNode.id, newNode);

      return newState;
    case "editResource":
      //TODO: edit node
    case "removeResource":
      //TODO: delete node
    }

    return state;
  }
}

var nodeStore = new NodeStore(dispatcher);
export default nodeStore;
