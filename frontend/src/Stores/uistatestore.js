/* @flow */
import { ReduceStore } from 'flux/utils';
import { Dispatcher } from 'flux';
import { Map, List } from 'immutable';

import Action from '../Actions/action.js';
import Node from '../Models/node.js';
import dispatcher from '../dispatcher.js';

class UIState {
  currentWeek: string;
  piazzaPosts: List<Object>;

  constructor(currentWeek: string){
    this.currentWeek = currentWeek;
    this.piazzaPosts = new List();
  }
}

//stores global UI state, which is made available to all nodes in the render tree.
class UIStateStore extends ReduceStore<?UIState> {

  getInitialState() : ?UIState {
    return new UIState("");
  }

  reduce(state: ?UIState, action: Action) : ?UIState {
    let newState;
    switch(action.name){
    case "open":
      return new UIState("");
    case "piazzaPostsFetched":
      newState = new UIState(state.currentWeek);
      newState.piazzaPosts = action.data.posts;
      break;
    case "expandWeek":
      //TODO: this is really ugly. may want to use Object.assign
      newState = new UIState(action.data);
      newState.piazzaPosts = state.piazzaPosts;
      break;
    }

    return newState;
  }
}

var uiStateStore = new UIStateStore(dispatcher);
export default uiStateStore;
