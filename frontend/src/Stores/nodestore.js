/* @flow */
import { ReduceStore } from 'flux/utils';
import { Dispatcher } from 'flux';
import { Map } from 'immutable';

import Action from '../Action/action.js';
import Node from '../Models/node.js';
import dispatcher from '../dispatcher.js';
import columnStore from './columnstore.js';

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

class NodeStoreState {
  constructor(rootId, nodes){
    this.rootId = rootId;
    this.nodes = nodes;
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
    let newState = Object.assign({}, state);
    switch(action.name){
    case "open":
      //TODO: handle creation of tree given data format from server
      var idx;
      var nodesList = action.data;
      var numNodes = nodesList.keys().length();
      if (numNodes > 0) {
      	  newState.rootID = nodesList[0].id;
      	  newState.nodes[nodesList[0].id] = nodesList[0];
      }
      for (idx = 1; idx < numNodes; idx++) {
      	  newState.nodes[nodesList[idx].id] = nodesList[idx];
      }
      break;
    case "addResource": 
      //TODO: insert created node into tree at appropriate place
      // I think we need the id of the parent node
    case "editResource":
      //TODO: edit node
    case "removeResource":
      //TODO: delete node
    }

    return newState;
  }
}

var nodeStore = new NodeStore(dispatcher);
export default nodeStore;
