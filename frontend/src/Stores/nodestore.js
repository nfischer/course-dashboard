/* @flow */
import { ReduceStore } from 'flux/utils';
import { Dispatcher } from 'flux';

import Action from '../Action/action.js';
import Node from '../Models/node.js';
import dispatcher from '../dispatcher.js';
import columnStore from './columnstore.js';

class NodeStore extends ReduceStore<?Node> {

  getInitialState() : ?Node {
    return null;
  }

  __invokeOnDispatch(payload: Action){
    super.__invokeOnDispatch(payload);
  }

  reduce(state: ?LayerStoreState, action: Action) : ?LayerStoreState {
    let newState = Object.assign({}, state);
    switch(action.name){
    case "open":
      //TODO: handle creation of tree given data format from server
    case "addResource":
      //TODO: insert created node into tree at appropriate place
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
